import { checkDatabaseHealth } from "@/lib/db"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy"
  checks: {
    database: { status: boolean; latency_ms?: number }
    redis: { status: boolean; latency_ms?: number }
    memory: { status: boolean; usage_percent: number }
  }
  timestamp: string
}

/**
 * Comprehensive health check for all system components
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const checks = {
    database: { status: false, latency_ms: 0 },
    redis: { status: false, latency_ms: 0 },
    memory: { status: false, usage_percent: 0 },
  }

  // Check database
  try {
    const dbStart = Date.now()
    checks.database.status = await checkDatabaseHealth()
    checks.database.latency_ms = Date.now() - dbStart
  } catch (error) {
    console.error("[v0] Database health check failed:", error)
  }

  // Check Redis
  try {
    const redisStart = Date.now()
    await redis.ping()
    checks.redis.status = true
    checks.redis.latency_ms = Date.now() - redisStart
  } catch (error) {
    console.error("[v0] Redis health check failed:", error)
  }

  // Check memory
  const memUsage = process.memoryUsage()
  const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
  checks.memory.usage_percent = Math.round(memPercent * 100) / 100
  checks.memory.status = memPercent < 90 // Unhealthy if > 90%

  // Determine overall status
  let status: "healthy" | "degraded" | "unhealthy" = "healthy"

  if (!checks.database.status || !checks.redis.status) {
    status = "unhealthy"
  } else if (!checks.memory.status) {
    status = "degraded"
  }

  return {
    status,
    checks,
    timestamp: new Date().toISOString(),
  }
}
