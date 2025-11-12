import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { jobRepository } from "@/lib/repositories/job-repository"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      // Non-admin users can only see their own stats
      const userId = session.role === "admin" ? undefined : session.userId

      const stats = await jobRepository.getStats(userId)

      return NextResponse.json({ stats })
    } catch (error) {
      console.error("[v0] Get job stats error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to fetch stats" }, { status: 500 })
    }
  })
}
