import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface QueueJob {
  id: string
  type: string
  data: any
  priority: number
  attempts: number
  maxAttempts: number
  createdAt: number
  processedAt?: number
}

export class JobQueue {
  private queueName: string
  private processingSet: string
  private deadLetterQueue: string

  constructor(queueName = "pcr_jobs") {
    this.queueName = queueName
    this.processingSet = `${queueName}:processing`
    this.deadLetterQueue = `${queueName}:dlq`
  }

  /**
   * Add a job to the queue
   */
  async enqueue(job: Omit<QueueJob, "attempts" | "createdAt">): Promise<void> {
    const queueJob: QueueJob = {
      ...job,
      attempts: 0,
      createdAt: Date.now(),
    }

    // Use priority as score (lower number = higher priority)
    await redis.zadd(this.queueName, {
      score: job.priority,
      member: JSON.stringify(queueJob),
    })

    console.log(`[v0] Job ${job.id} enqueued with priority ${job.priority}`)
  }

  /**
   * Dequeue the highest priority job
   */
  async dequeue(): Promise<QueueJob | null> {
    // Get the highest priority job (lowest score)
    const jobs = await redis.zrange(this.queueName, 0, 0)

    if (jobs.length === 0) {
      return null
    }

    const jobData = jobs[0]
    const job: QueueJob = JSON.parse(jobData as string)

    // Move to processing set
    await redis.zrem(this.queueName, jobData)
    await redis.sadd(this.processingSet, jobData)

    console.log(`[v0] Job ${job.id} dequeued for processing`)
    return job
  }

  /**
   * Mark a job as completed
   */
  async complete(job: QueueJob): Promise<void> {
    const jobData = JSON.stringify(job)
    await redis.srem(this.processingSet, jobData)
    console.log(`[v0] Job ${job.id} completed`)
  }

  /**
   * Mark a job as failed and retry or move to DLQ
   */
  async fail(job: QueueJob, error: string): Promise<void> {
    const jobData = JSON.stringify(job)
    await redis.srem(this.processingSet, jobData)

    job.attempts++

    if (job.attempts < job.maxAttempts) {
      // Retry with exponential backoff (increase priority)
      const backoffPriority = job.priority + Math.pow(2, job.attempts)
      await redis.zadd(this.queueName, {
        score: backoffPriority,
        member: JSON.stringify(job),
      })
      console.log(`[v0] Job ${job.id} failed, retrying (attempt ${job.attempts}/${job.maxAttempts})`)
    } else {
      // Move to dead letter queue
      await redis.lpush(this.deadLetterQueue, JSON.stringify({ ...job, error }))
      console.log(`[v0] Job ${job.id} moved to DLQ after ${job.attempts} attempts`)
    }
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    pending: number
    processing: number
    failed: number
  }> {
    const [pending, processing, failed] = await Promise.all([
      redis.zcard(this.queueName),
      redis.scard(this.processingSet),
      redis.llen(this.deadLetterQueue),
    ])

    return {
      pending: pending || 0,
      processing: processing || 0,
      failed: failed || 0,
    }
  }

  /**
   * Get all pending jobs
   */
  async getPendingJobs(): Promise<QueueJob[]> {
    const jobs = await redis.zrange(this.queueName, 0, -1)
    return jobs.map((job) => JSON.parse(job as string))
  }

  /**
   * Clear all jobs (use with caution)
   */
  async clear(): Promise<void> {
    await redis.del(this.queueName)
    await redis.del(this.processingSet)
    console.log("[v0] Queue cleared")
  }
}

// Singleton instance
export const jobQueue = new JobQueue()
