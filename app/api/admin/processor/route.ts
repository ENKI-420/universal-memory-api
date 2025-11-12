import { type NextRequest, NextResponse } from "next/server"
import { withRole } from "@/lib/auth/middleware"
import { jobProcessor } from "@/lib/queue/job-processor"

// POST /api/admin/processor - Start job processor
export async function POST(request: NextRequest) {
  return withRole(request, ["admin"], async (req, session) => {
    try {
      const body = await req.json()
      const { action } = body

      if (action === "start") {
        jobProcessor.start()
        return NextResponse.json({
          message: "Job processor started",
          status: "running",
        })
      } else if (action === "stop") {
        jobProcessor.stop()
        return NextResponse.json({
          message: "Job processor stopped",
          status: "stopped",
        })
      } else {
        return NextResponse.json(
          { error: "Validation error", message: 'Invalid action. Use "start" or "stop"' },
          { status: 400 },
        )
      }
    } catch (error) {
      console.error("[v0] Processor control error:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to control processor" },
        { status: 500 },
      )
    }
  })
}
