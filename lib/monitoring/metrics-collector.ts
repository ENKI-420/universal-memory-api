import { metricsRepository } from "@/lib/repositories/metrics-repository"

/**
 * Metrics collector for system observability
 */
export class MetricsCollector {
  /**
   * Record API request metrics
   */
  async recordApiRequest(data: {
    endpoint: string
    method: string
    status_code: number
    duration_ms: number
    user_id?: string
  }): Promise<void> {
    try {
      await metricsRepository.record({
        metric_type: "api",
        metric_name: "request",
        value: data.duration_ms,
        unit: "ms",
        tags: {
          endpoint: data.endpoint,
          method: data.method,
          status_code: data.status_code,
          user_id: data.user_id,
        },
      })
    } catch (error) {
      console.error("[v0] Failed to record API request metric:", error)
    }
  }

  /**
   * Record job execution metrics
   */
  async recordJobExecution(data: {
    job_id: string
    job_type: string
    duration_ms: number
    status: string
    coherence_time?: number
    fidelity?: number
  }): Promise<void> {
    try {
      // Record duration
      await metricsRepository.record({
        metric_type: "job",
        metric_name: "execution_time",
        value: data.duration_ms,
        unit: "ms",
        tags: {
          job_id: data.job_id,
          job_type: data.job_type,
          status: data.status,
        },
      })

      // Record coherence time if available
      if (data.coherence_time) {
        await metricsRepository.record({
          metric_type: "quantum",
          metric_name: "coherence_time",
          value: data.coherence_time,
          unit: "s",
          tags: {
            job_id: data.job_id,
            job_type: data.job_type,
          },
        })
      }

      // Record fidelity if available
      if (data.fidelity) {
        await metricsRepository.record({
          metric_type: "quantum",
          metric_name: "fidelity",
          value: data.fidelity,
          unit: "ratio",
          tags: {
            job_id: data.job_id,
            job_type: data.job_type,
          },
        })
      }
    } catch (error) {
      console.error("[v0] Failed to record job execution metrics:", error)
    }
  }

  /**
   * Record system health metrics
   */
  async recordSystemHealth(data: {
    cpu_usage?: number
    memory_usage?: number
    database_latency_ms?: number
    redis_latency_ms?: number
  }): Promise<void> {
    try {
      const promises: Promise<any>[] = []

      if (data.cpu_usage !== undefined) {
        promises.push(
          metricsRepository.record({
            metric_type: "system",
            metric_name: "cpu_usage",
            value: data.cpu_usage,
            unit: "percent",
          }),
        )
      }

      if (data.memory_usage !== undefined) {
        promises.push(
          metricsRepository.record({
            metric_type: "system",
            metric_name: "memory_usage",
            value: data.memory_usage,
            unit: "percent",
          }),
        )
      }

      if (data.database_latency_ms !== undefined) {
        promises.push(
          metricsRepository.record({
            metric_type: "system",
            metric_name: "database_latency",
            value: data.database_latency_ms,
            unit: "ms",
          }),
        )
      }

      if (data.redis_latency_ms !== undefined) {
        promises.push(
          metricsRepository.record({
            metric_type: "system",
            metric_name: "redis_latency",
            value: data.redis_latency_ms,
            unit: "ms",
          }),
        )
      }

      await Promise.all(promises)
    } catch (error) {
      console.error("[v0] Failed to record system health metrics:", error)
    }
  }

  /**
   * Record Lambda Phi calibration metrics
   */
  async recordLambdaPhiCalibration(data: {
    measured_value: number
    theoretical_value: number
    deviation: number
    confidence_interval: number
  }): Promise<void> {
    try {
      await Promise.all([
        metricsRepository.record({
          metric_type: "constant",
          metric_name: "lambda_phi_measured",
          value: data.measured_value,
          unit: "s^-1",
          tags: { source: "calibration" },
        }),
        metricsRepository.record({
          metric_type: "constant",
          metric_name: "lambda_phi_deviation",
          value: data.deviation,
          unit: "ratio",
          tags: { source: "calibration" },
        }),
        metricsRepository.record({
          metric_type: "constant",
          metric_name: "lambda_phi_confidence",
          value: data.confidence_interval,
          unit: "ratio",
          tags: { source: "calibration" },
        }),
      ])
    } catch (error) {
      console.error("[v0] Failed to record Lambda Phi calibration metrics:", error)
    }
  }
}

// Singleton instance
export const metricsCollector = new MetricsCollector()
