import { sql } from "@/lib/db"
import type { Job, JobType, JobStatus, CreateJobRequest } from "@/lib/types/database"

export class JobRepository {
  async findById(id: string): Promise<Job | null> {
    const jobs = await sql<Job[]>`SELECT * FROM jobs WHERE id = ${id}`
    return jobs[0] || null
  }

  async create(userId: string, data: CreateJobRequest): Promise<Job> {
    const jobs = await sql<Job[]>`
      INSERT INTO jobs (
        user_id, job_type, parameters, backend, priority,
        lambda_phi_value, lambda_phi_normalized
      )
      VALUES (
        ${userId}, ${data.job_type}, ${JSON.stringify(data.parameters)}, 
        ${data.backend || "ibm_quantum"}, ${data.priority || 5},
        ${2.176e-8}, ${1e-17}
      )
      RETURNING *
    `
    return jobs[0]
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    updates?: Partial<Pick<Job, "result" | "error_message" | "coherence_time" | "fidelity" | "purity" | "entropy">>,
  ): Promise<Job> {
    if (status === "running" && !updates) {
      const jobs = await sql<Job[]>`
        UPDATE jobs 
        SET status = ${status}, started_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return jobs[0]
    }

    if (status === "completed" || status === "failed") {
      const jobs = await sql<Job[]>`
        UPDATE jobs 
        SET status = ${status},
            completed_at = CURRENT_TIMESTAMP,
            duration_ms = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) * 1000,
            result = ${updates?.result ? JSON.stringify(updates.result) : null},
            error_message = ${updates?.error_message || null},
            coherence_time = ${updates?.coherence_time || null},
            fidelity = ${updates?.fidelity || null},
            purity = ${updates?.purity || null},
            entropy = ${updates?.entropy || null}
        WHERE id = ${id}
        RETURNING *
      `
      return jobs[0]
    }

    const jobs = await sql<Job[]>`
      UPDATE jobs 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `
    return jobs[0]
  }

  async list(filters?: {
    user_id?: string
    status?: JobStatus
    job_type?: JobType
    limit?: number
  }): Promise<Job[]> {
    const limit = filters?.limit || 100

    if (!filters || (!filters.user_id && !filters.status && !filters.job_type)) {
      return sql<Job[]>`SELECT * FROM jobs ORDER BY created_at DESC LIMIT ${limit}`
    }

    if (filters.user_id && filters.status && filters.job_type) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE user_id = ${filters.user_id} 
          AND status = ${filters.status}
          AND job_type = ${filters.job_type}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    if (filters.user_id && filters.status) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE user_id = ${filters.user_id} AND status = ${filters.status}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    if (filters.user_id && filters.job_type) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE user_id = ${filters.user_id} AND job_type = ${filters.job_type}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    if (filters.status && filters.job_type) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE status = ${filters.status} AND job_type = ${filters.job_type}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    if (filters.user_id) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE user_id = ${filters.user_id}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    if (filters.status) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE status = ${filters.status}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    if (filters.job_type) {
      return sql<Job[]>`
        SELECT * FROM jobs 
        WHERE job_type = ${filters.job_type}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    return sql<Job[]>`SELECT * FROM jobs ORDER BY created_at DESC LIMIT ${limit}`
  }

  async getStats(userId?: string): Promise<{
    total: number
    pending: number
    running: number
    completed: number
    failed: number
  }> {
    const result = userId
      ? await sql<any[]>`
          SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'running') as running,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'failed') as failed
          FROM jobs 
          WHERE user_id = ${userId}
        `
      : await sql<any[]>`
          SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'running') as running,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'failed') as failed
          FROM jobs
        `

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
