import { query } from "@/lib/db"
import type { Job, JobType, JobStatus, CreateJobRequest } from "@/lib/types/database"

export class JobRepository {
  async findById(id: string): Promise<Job | null> {
    const jobs = await query<Job>("SELECT * FROM jobs WHERE id = $1", [id])
    return jobs[0] || null
  }

  async create(userId: string, data: CreateJobRequest): Promise<Job> {
    const jobs = await query<Job>(
      `INSERT INTO jobs (
        user_id, job_type, parameters, backend, priority,
        lambda_phi_value, lambda_phi_normalized
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        userId,
        data.job_type,
        JSON.stringify(data.parameters),
        data.backend || "ibm_quantum",
        data.priority || 5,
        2.176e-8, // Default ΛΦ value
        1e-17, // Default normalized ΛΦ
      ],
    )
    return jobs[0]
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    updates?: Partial<Pick<Job, "result" | "error_message" | "coherence_time" | "fidelity" | "purity" | "entropy">>,
  ): Promise<Job> {
    const setClause: string[] = ["status = $2"]
    const params: any[] = [id, status]
    let paramIndex = 3

    if (status === "running" && !updates) {
      setClause.push(`started_at = CURRENT_TIMESTAMP`)
    }

    if (status === "completed" || status === "failed") {
      setClause.push(`completed_at = CURRENT_TIMESTAMP`)
      setClause.push(`duration_ms = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) * 1000`)
    }

    if (updates) {
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          setClause.push(`${key} = $${paramIndex}`)
          params.push(typeof value === "object" ? JSON.stringify(value) : value)
          paramIndex++
        }
      })
    }

    const jobs = await query<Job>(`UPDATE jobs SET ${setClause.join(", ")} WHERE id = $1 RETURNING *`, params)
    return jobs[0]
  }

  async list(filters?: {
    user_id?: string
    status?: JobStatus
    job_type?: JobType
    limit?: number
  }): Promise<Job[]> {
    let queryText = "SELECT * FROM jobs WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (filters?.user_id) {
      queryText += ` AND user_id = $${paramIndex}`
      params.push(filters.user_id)
      paramIndex++
    }

    if (filters?.status) {
      queryText += ` AND status = $${paramIndex}`
      params.push(filters.status)
      paramIndex++
    }

    if (filters?.job_type) {
      queryText += ` AND job_type = $${paramIndex}`
      params.push(filters.job_type)
      paramIndex++
    }

    queryText += " ORDER BY created_at DESC"

    if (filters?.limit) {
      queryText += ` LIMIT $${paramIndex}`
      params.push(filters.limit)
    }

    return query<Job>(queryText, params)
  }

  async getStats(userId?: string): Promise<{
    total: number
    pending: number
    running: number
    completed: number
    failed: number
  }> {
    const whereClause = userId ? "WHERE user_id = $1" : ""
    const params = userId ? [userId] : []

    const result = await query<any>(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'running') as running,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM jobs ${whereClause}`,
      params,
    )

    return {
      total: Number.parseInt(result[0].total),
      pending: Number.parseInt(result[0].pending),
      running: Number.parseInt(result[0].running),
      completed: Number.parseInt(result[0].completed),
      failed: Number.parseInt(result[0].failed),
    }
  }
}

export const jobRepository = new JobRepository()
