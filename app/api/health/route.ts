import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/db"
import { metricsRepository } from "@/lib/repositories/metrics-repository"

export async function GET() {
  try {
    const startTime = Date.now()

    // Check database health
    const dbHealthy = await checkDatabaseHealth()

    // Get Lambda Phi constant
    const lambdaPhiMetric = await metricsRepository.getLatest("constant", "lambda_phi")
    const lambdaPhi = lambdaPhiMetric?.value || 2.176e-8

    // Calculate uptime (in production, this would be from a persistent store)
    const uptime = process.uptime()

    const responseTime = Date.now() - startTime

    const status = dbHealthy ? "healthy" : "unhealthy"

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      lambda_phi: {
        value: lambdaPhi,
        normalized: 1e-17,
        unit: "s^-1",
      },
      planck_constants: {
        time: 5.391e-44,
        length: 1.616e-35,
        mass: 2.176e-8,
      },
      system: {
        database: dbHealthy,
        uptime_seconds: Math.floor(uptime),
        response_time_ms: responseTime,
      },
      version: "2.0.0-ΛΦ",
    })
  } catch (error) {
    console.error("[v0] Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
