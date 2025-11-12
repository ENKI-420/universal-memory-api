import { type NextRequest, NextResponse } from "next/server"
import { withRole } from "@/lib/auth/middleware"
import { jobQueue } from "@/lib/queue/queue-client"

export async function GET(request: NextRequest) {
  return withRole(request, ["admin"], async (req, session) => {
    try {
      const jobs = await jobQueue.getPendingJobs()

      return NextResponse.json({
        jobs,
        count: jobs.length,
      })
    } catch (error) {
      console.error("[v0] Get pending jobs error:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to fetch pending jobs" },
        { status: 500 },
      )
    }
  })
}
