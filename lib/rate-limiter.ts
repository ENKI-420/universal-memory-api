import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Rate limiter using Redis for distributed rate limiting
 */
export async function rateLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const windowStart = now - config.windowMs

  try {
    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart)

    // Count requests in current window
    const requestCount = await redis.zcard(key)

    if (requestCount >= config.maxRequests) {
      // Get the oldest request timestamp to calculate reset time
      const oldestRequest = await redis.zrange(key, 0, 0, { withScores: true })
      const resetAt =
        oldestRequest.length > 0
          ? new Date((oldestRequest[0].score as number) + config.windowMs)
          : new Date(now + config.windowMs)

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      }
    }

    // Add current request
    await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` })
    await redis.expire(key, Math.ceil(config.windowMs / 1000))

    return {
      allowed: true,
      remaining: config.maxRequests - requestCount - 1,
      resetAt: new Date(now + config.windowMs),
    }
  } catch (error) {
    console.error("[v0] Rate limit error:", error)
    // Fail open - allow request if rate limiter fails
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(now + config.windowMs),
    }
  }
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  identifier: string,
  config: RateLimitConfig,
  handler: () => Promise<Response>,
): Promise<Response> {
  const result = await rateLimit(identifier, config)

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Too many requests",
        resetAt: result.resetAt.toISOString(),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.resetAt.toISOString(),
          "Retry-After": Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString(),
        },
      },
    )
  }

  const response = await handler()

  // Add rate limit headers to successful responses
  response.headers.set("X-RateLimit-Limit", config.maxRequests.toString())
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
  response.headers.set("X-RateLimit-Reset", result.resetAt.toISOString())

  return response
}
