/**
 * Structured logging utility for production monitoring
 */

export type LogLevel = "debug" | "info" | "warning" | "error" | "critical"

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: {
    name: string
    message: string
    stack?: string
  }
  user_id?: string
  request_id?: string
}

class Logger {
  private serviceName = "pcr-runtime"
  private environment: string = process.env.NODE_ENV || "development"

  /**
   * Create a structured log entry
   */
  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        service: this.serviceName,
        environment: this.environment,
      },
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    return entry
  }

  /**
   * Log to console with structured format
   */
  private log(entry: LogEntry): void {
    const logString = JSON.stringify(entry)

    switch (entry.level) {
      case "debug":
        console.debug(logString)
        break
      case "info":
        console.info(logString)
        break
      case "warning":
        console.warn(logString)
        break
      case "error":
      case "critical":
        console.error(logString)
        break
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry("debug", message, context)
    this.log(entry)
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry("info", message, context)
    this.log(entry)
  }

  warning(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry("warning", message, context)
    this.log(entry)
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry("error", message, context, error)
    this.log(entry)
  }

  critical(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry("critical", message, context, error)
    this.log(entry)
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): ChildLogger {
    return new ChildLogger(this, context)
  }
}

class ChildLogger {
  constructor(
    private parent: Logger,
    private context: Record<string, any>,
  ) {}

  private mergeContext(additionalContext?: Record<string, any>): Record<string, any> {
    return { ...this.context, ...additionalContext }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.parent.debug(message, this.mergeContext(context))
  }

  info(message: string, context?: Record<string, any>): void {
    this.parent.info(message, this.mergeContext(context))
  }

  warning(message: string, context?: Record<string, any>): void {
    this.parent.warning(message, this.mergeContext(context))
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.parent.error(message, error, this.mergeContext(context))
  }

  critical(message: string, error?: Error, context?: Record<string, any>): void {
    this.parent.critical(message, error, this.mergeContext(context))
  }
}

// Singleton instance
export const logger = new Logger()
