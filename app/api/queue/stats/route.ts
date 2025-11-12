import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { jobQueue } from "@/lib/queue/queue-client"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const stats = await jobQueue.getStats()

      return NextResponse.json({
        queue: stats,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Get queue stats error:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to fetch queue stats" },
        { status: 500 },
      )
    }
  })
}
