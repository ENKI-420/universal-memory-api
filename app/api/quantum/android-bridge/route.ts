import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { QuantumAndroidBridge, type AndroidTelemetry } from "@/lib/quantum/quantum-android-bridge"

const bridge = new QuantumAndroidBridge()

/**
 * POST /api/quantum/android-bridge - Send telemetry from Android device
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const telemetry: AndroidTelemetry = await req.json()

      // Validate telemetry
      if (!telemetry.device_id || typeof telemetry.signal_strength !== "number") {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "device_id and signal_strength are required",
          },
          { status: 400 },
        )
      }

      // Process telemetry
      const phaseUpdates = bridge.processTelemetry(telemetry)

      // Queue for batch processing
      bridge.queueTelemetry(telemetry)

      return NextResponse.json({
        message: "Telemetry received and processed",
        device_id: telemetry.device_id,
        phase_updates: phaseUpdates.length,
        updates: phaseUpdates.slice(0, 3), // Return first 3 for confirmation
      })
    } catch (error) {
      console.error("[v0] Failed to process telemetry:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to process telemetry" },
        { status: 500 },
      )
    }
  })
}

/**
 * GET /api/quantum/android-bridge - Get bridge status
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    return NextResponse.json({
      status: bridge.isActive() ? "connected" : "disconnected",
      lambda_phi: 2.176435e-8,
      websocket_url: process.env.NEXT_PUBLIC_ANDROID_BRIDGE_WS || "ws://localhost:8080",
    })
  })
}
