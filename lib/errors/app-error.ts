/**
 * Custom application error classes for better error handling
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR")
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR")
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`
    super(message, 404, "NOT_FOUND")
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, "CONFLICT", details)
  }
}

export class RateLimitError extends AppError {
  constructor(resetAt: Date) {
    super("Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED", { resetAt })
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 500, "DATABASE_ERROR", { originalError: originalError?.message })
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(`${service} error: ${message}`, 502, "EXTERNAL_SERVICE_ERROR", { service })
  }
}

export class QuantumSimulationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, "QUANTUM_SIMULATION_ERROR", details)
  }
}
