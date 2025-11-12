import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { metricsRepository } from "@/lib/repositories/metrics-repository"

// GET /api/metrics - Get system metrics
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const { searchParams } = new URL(req.url)
      const metricType = searchParams.get("type")
      const metricName = searchParams.get("name")
      const since = searchParams.get("since")

      if (!metricType || !metricName) {
        return NextResponse.json(
          { error: "Validation error", message: "type and name parameters are required" },
          { status: 400 },
        )
      }

      if (since) {
        const sinceDate = new Date(since)
        const metrics = await metricsRepository.getTimeSeries(metricType, metricName, sinceDate)
        return NextResponse.json({ metrics })
      } else {
        const metric = await metricsRepository.getLatest(metricType, metricName)
        return NextResponse.json({ metric })
      }
    } catch (error) {
      console.error("[v0] Get metrics error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to fetch metrics" }, { status: 500 })
    }
  })
}

// POST /api/metrics - Record a metric (admin only)
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      // Only admins can record metrics
      if (session.role !== "admin") {
        return NextResponse.json({ error: "Forbidden", message: "Admin access required" }, { status: 403 })
      }

      const body = await req.json()
      const { metric_type, metric_name, value, unit, tags } = body

      if (!metric_type || !metric_name || value === undefined) {
        return NextResponse.json(
          { error: "Validation error", message: "metric_type, metric_name, and value are required" },
          { status: 400 },
        )
      }

      const metric = await metricsRepository.record({
        metric_type,
        metric_name,
        value,
        unit,
        tags,
      })

      return NextResponse.json({
        message: "Metric recorded successfully",
        metric,
      })
    } catch (error) {
      console.error("[v0] Record metric error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to record metric" }, { status: 500 })
    }
  })
}
