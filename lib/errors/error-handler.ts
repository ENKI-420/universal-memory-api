import { NextResponse } from "next/server"
import { AppError } from "./app-error"
import { logger } from "@/lib/monitoring/logger"

/**
 * Global error handler for API routes
 */
export function handleError(error: unknown): NextResponse {
  // Log the error
  if (error instanceof AppError) {
    logger.error(error.message, error, {
      statusCode: error.statusCode,
      code: error.code,
      details: error.details,
    })

    return NextResponse.json(error.toJSON(), { status: error.statusCode })
  }

  // Handle unknown errors
  if (error instanceof Error) {
    logger.critical("Unhandled error", error)

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : error.message,
      },
      { status: 500 },
    )
  }

  // Handle non-Error objects
  logger.critical("Unknown error type", undefined, { error })

  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    },
    { status: 500 },
  )
}

/**
 * Async error wrapper for API route handlers
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
): (...args: T) => Promise<R | NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleError(error)
    }
  }
}
