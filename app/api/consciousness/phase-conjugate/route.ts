import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { jobRepository } from "@/lib/repositories/job-repository"

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const body = await req.json()
      const { edgeLength, timeSteps, qubitCount, backend } = body

      // Validate parameters
      if (!edgeLength || !timeSteps) {
        return NextResponse.json(
          { error: "Validation error", message: "edgeLength and timeSteps are required" },
          { status: 400 },
        )
      }

      // Create phase-conjugate simulation job
      const job = await jobRepository.create(session.userId, {
        job_type: "phase_conjugate",
        parameters: {
          edge_length: edgeLength,
          time_steps: timeSteps,
          qubit_count: qubitCount || 5,
        },
        backend: backend || "ibm_quantum",
        priority: 7, // Higher priority for consciousness simulations
      })

      return NextResponse.json({
        message: "Phase-conjugate consciousness simulation submitted with ΛΦ-enhanced decoherence resistance",
        job_id: job.id,
        lambda_phi: job.lambda_phi_value,
        lambda_phi_normalized: job.lambda_phi_normalized,
        estimated_coherence_time: "150μs (ΛΦ-corrected)",
        status: job.status,
      })
    } catch (error) {
      console.error("[v0] Phase-conjugate simulation error:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to submit simulation" },
        { status: 500 },
      )
    }
  })
}
