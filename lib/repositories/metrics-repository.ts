import { query } from "@/lib/db"
import type { SystemMetric } from "@/lib/types/database"

export class MetricsRepository {
  async record(data: {
    metric_type: string
    metric_name: string
    value: number
    unit?: string
    tags?: Record<string, any>
  }): Promise<SystemMetric> {
    const metrics = await query<SystemMetric>(
      `INSERT INTO system_metrics (metric_type, metric_name, value, unit, tags)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.metric_type, data.metric_name, data.value, data.unit || null, data.tags ? JSON.stringify(data.tags) : null],
    )
    return metrics[0]
  }

  async getLatest(metricType: string, metricName: string): Promise<SystemMetric | null> {
    const metrics = await query<SystemMetric>(
      `SELECT * FROM system_metrics 
       WHERE metric_type = $1 AND metric_name = $2
       ORDER BY timestamp DESC
       LIMIT 1`,
      [metricType, metricName],
    )
    return metrics[0] || null
  }

  async getTimeSeries(metricType: string, metricName: string, since: Date, limit = 100): Promise<SystemMetric[]> {
    return query<SystemMetric>(
      `SELECT * FROM system_metrics 
       WHERE metric_type = $1 AND metric_name = $2 AND timestamp >= $3
       ORDER BY timestamp DESC
       LIMIT $4`,
      [metricType, metricName, since, limit],
    )
  }

  async getAverageCoherence(since: Date): Promise<number> {
    const result = await query<{ avg: string }>(
      `SELECT AVG(value) as avg FROM system_metrics
       WHERE metric_name = 'coherence_time' AND timestamp >= $1`,
      [since],
    )
    return Number.parseFloat(result[0]?.avg || "0")
  }
}

export const metricsRepository = new MetricsRepository()
