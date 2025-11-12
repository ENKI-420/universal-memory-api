import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { jobRepository } from "@/lib/repositories/job-repository"
import type { CreateJobRequest } from "@/lib/types/database"

// GET /api/jobs - List jobs
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const { searchParams } = new URL(req.url)
      const status = searchParams.get("status") as any
      const jobType = searchParams.get("job_type") as any
      const limit = Number.parseInt(searchParams.get("limit") || "50")

      // Non-admin users can only see their own jobs
      const userId = session.role === "admin" ? undefined : session.userId

      const jobs = await jobRepository.list({
        user_id: userId,
        status,
        job_type: jobType,
        limit,
      })

      return NextResponse.json({ jobs })
    } catch (error) {
      console.error("[v0] List jobs error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to fetch jobs" }, { status: 500 })
    }
  })
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const body: CreateJobRequest = await req.json()

      // Validate job type
      const validJobTypes = ["phase_conjugate", "decoherence_test", "lambda_phi_calibration", "ricci_flow"]
      if (!validJobTypes.includes(body.job_type)) {
        return NextResponse.json({ error: "Validation error", message: "Invalid job type" }, { status: 400 })
      }

      // Validate parameters
      if (!body.parameters || typeof body.parameters !== "object") {
        return NextResponse.json({ error: "Validation error", message: "Parameters are required" }, { status: 400 })
      }

      // Create job
      const job = await jobRepository.create(session.userId, body)

      return NextResponse.json(
        {
          message: "Job submitted with ΛΦ-enhanced decoherence resistance",
          job,
          lambda_phi: 2.176e-8,
        },
        { status: 201 },
      )
    } catch (error) {
      console.error("[v0] Create job error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to create job" }, { status: 500 })
    }
  })
}
