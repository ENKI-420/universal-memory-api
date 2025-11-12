import { jobQueue } from "./queue-client"
import { jobRepository } from "@/lib/repositories/job-repository"

/**
 * Schedule pending database jobs into the queue
 */
export async function schedulePendingJobs(): Promise<number> {
  try {
    // Get all pending jobs from database
    const pendingJobs = await jobRepository.list({ status: "pending", limit: 100 })

    let scheduled = 0

    for (const job of pendingJobs) {
      try {
        await jobQueue.enqueue({
          id: job.id,
          type: job.job_type,
          data: job.parameters,
          priority: job.priority,
          maxAttempts: 3,
        })

        scheduled++
      } catch (error) {
        console.error(`[v0] Failed to schedule job ${job.id}:`, error)
      }
    }

    if (scheduled > 0) {
      console.log(`[v0] Scheduled ${scheduled} pending jobs`)
    }

    return scheduled
  } catch (error) {
    console.error("[v0] Schedule pending jobs error:", error)
    return 0
  }
}

/**
 * Start periodic job scheduling
 */
export function startJobScheduler(intervalMs = 10000): NodeJS.Timeout {
  console.log("[v0] Job scheduler started")

  // Schedule immediately
  schedulePendingJobs()

  // Then schedule periodically
  return setInterval(() => {
    schedulePendingJobs()
  }, intervalMs)
}
