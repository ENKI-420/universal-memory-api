/**
 * Standalone script to start the job processor
 * Run with: node --loader ts-node/esm scripts/start-processor.ts
 */

import { jobProcessor } from "../lib/queue/job-processor"
import { startJobScheduler } from "../lib/queue/job-scheduler"

console.log("=".repeat(60))
console.log("Phase-Conjugate Consciousness Runtime - Job Processor")
console.log("=".repeat(60))

// Start the job scheduler (moves pending jobs from DB to queue)
const schedulerInterval = startJobScheduler(10000) // Every 10 seconds

// Start the job processor (processes jobs from queue)
jobProcessor.start()

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[v0] Shutting down gracefully...")
  clearInterval(schedulerInterval)
  jobProcessor.stop()
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n[v0] Shutting down gracefully...")
  clearInterval(schedulerInterval)
  jobProcessor.stop()
  process.exit(0)
})

console.log("[v0] Job processor is running. Press Ctrl+C to stop.")
