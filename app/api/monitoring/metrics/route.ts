import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { performanceMonitor } from "@/lib/monitoring/performance-monitor"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const memoryUsage = performanceMonitor.getMemoryUsage()
      const cpuUsage = performanceMonitor.getCpuUsage()

      return NextResponse.json({
        memory: memoryUsage,
        cpu: {
          usage_seconds: cpuUsage,
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Metrics error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to fetch metrics" }, { status: 500 })
    }
  })
}
