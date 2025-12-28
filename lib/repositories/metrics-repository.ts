import { sql } from "@/lib/db"
import type { SystemMetric } from "@/lib/types/database"

export class MetricsRepository {
  async record(data: {
    metric_type: string
    metric_name: string
    value: number
    unit?: string
    tags?: Record<string, any>
  }): Promise<SystemMetric> {
    const metrics = await sql<SystemMetric[]>`
      INSERT INTO system_metrics (metric_type, metric_name, value, unit, tags)
      VALUES (
        ${data.metric_type}, ${data.metric_name}, ${data.value}, 
        ${data.unit || null}, ${data.tags ? JSON.stringify(data.tags) : null}
      )
      RETURNING *
    `
    return metrics[0]
  }

  async getLatest(metricType: string, metricName: string): Promise<SystemMetric | null> {
    const metrics = await sql<SystemMetric[]>`
      SELECT * FROM system_metrics 
      WHERE metric_type = ${metricType} AND metric_name = ${metricName}
      ORDER BY timestamp DESC
      LIMIT 1
    `
    return metrics[0] || null
  }

  async getTimeSeries(metricType: string, metricName: string, since: Date, limit = 100): Promise<SystemMetric[]> {
    return sql<SystemMetric[]>`
      SELECT * FROM system_metrics 
      WHERE metric_type = ${metricType} 
        AND metric_name = ${metricName} 
        AND timestamp >= ${since.toISOString()}
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `
  }

  async getAverageCoherence(since: Date): Promise<number> {
    const result = await sql<{ avg: string }[]>`
      SELECT AVG(value) as avg FROM system_metrics
      WHERE metric_name = 'coherence_time' AND timestamp >= ${since.toISOString()}
    `
    return Number.parseFloat(result[0]?.avg || "0")
  }
}

export const metricsRepository = new MetricsRepository()
