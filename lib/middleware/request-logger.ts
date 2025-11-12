import type { NextRequest } from "next/server"
import { logger } from "@/lib/monitoring/logger"
import { metricsCollector } from "@/lib/monitoring/metrics-collector"

/**
 * Middleware to log all API requests
 */
export async function withRequestLogging(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<Response>,
): Promise<Response> {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  // Create child logger with request context
  const requestLogger = logger.child({
    request_id: requestId,
    method: request.method,
    url: request.url,
    user_agent: request.headers.get("user-agent"),
  })

  requestLogger.info("Incoming request")

  try {
    const response = await handler(request)
    const duration = Date.now() - startTime

    // Log successful request
    requestLogger.info("Request completed", {
      status_code: response.status,
      duration_ms: duration,
    })

    // Record metrics
    await metricsCollector.recordApiRequest({
      endpoint: new URL(request.url).pathname,
      method: request.method,
      status_code: response.status,
      duration_ms: duration,
    })

    // Add request ID to response headers
    response.headers.set("X-Request-ID", requestId)

    return response
  } catch (error) {
    const duration = Date.now() - startTime

    // Log error
    requestLogger.error("Request failed", error instanceof Error ? error : undefined, { duration_ms: duration })

    throw error
  }
}
