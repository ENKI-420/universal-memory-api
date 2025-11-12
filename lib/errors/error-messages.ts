/**
 * Centralized error messages for consistency
 */

export const ErrorMessages = {
  // Authentication
  AUTH_REQUIRED: "Authentication required",
  AUTH_INVALID_CREDENTIALS: "Invalid email or password",
  AUTH_ACCOUNT_DISABLED: "Account is disabled",
  AUTH_TOKEN_EXPIRED: "Authentication token has expired",
  AUTH_TOKEN_INVALID: "Invalid authentication token",

  // Authorization
  AUTHZ_INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  AUTHZ_ADMIN_REQUIRED: "Admin access required",

  // Validation
  VALIDATION_REQUIRED_FIELD: (field: string) => `${field} is required`,
  VALIDATION_INVALID_EMAIL: "Invalid email format",
  VALIDATION_INVALID_UUID: "Invalid ID format",
  VALIDATION_INVALID_ENUM: (field: string, values: string[]) =>
    `Invalid ${field}. Allowed values: ${values.join(", ")}`,
  VALIDATION_OUT_OF_RANGE: (field: string, min: number, max: number) => `${field} must be between ${min} and ${max}`,

  // Resources
  RESOURCE_NOT_FOUND: (resource: string) => `${resource} not found`,
  RESOURCE_ALREADY_EXISTS: (resource: string) => `${resource} already exists`,

  // Jobs
  JOB_NOT_FOUND: "Job not found",
  JOB_INVALID_TYPE: "Invalid job type",
  JOB_INVALID_STATUS: "Invalid job status",
  JOB_EXECUTION_FAILED: "Job execution failed",

  // Queue
  QUEUE_FULL: "Job queue is full",
  QUEUE_UNAVAILABLE: "Job queue is unavailable",

  // Database
  DATABASE_CONNECTION_FAILED: "Database connection failed",
  DATABASE_QUERY_FAILED: "Database query failed",
  DATABASE_TRANSACTION_FAILED: "Database transaction failed",

  // External Services
  REDIS_CONNECTION_FAILED: "Redis connection failed",
  QUANTUM_BACKEND_UNAVAILABLE: "Quantum backend unavailable",

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",

  // General
  INTERNAL_SERVER_ERROR: "An unexpected error occurred",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
} as const
