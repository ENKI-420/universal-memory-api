import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { jobRepository } from "@/lib/repositories/job-repository"

// GET /api/jobs/:id - Get job details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = await params
      const job = await jobRepository.findById(id)

      if (!job) {
        return NextResponse.json({ error: "Not found", message: "Job not found" }, { status: 404 })
      }

      // Non-admin users can only see their own jobs
      if (session.role !== "admin" && job.user_id !== session.userId) {
        return NextResponse.json({ error: "Forbidden", message: "Access denied" }, { status: 403 })
      }

      return NextResponse.json({ job })
    } catch (error) {
      console.error("[v0] Get job error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to fetch job" }, { status: 500 })
    }
  })
}

// PATCH /api/jobs/:id - Update job status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = await params
      const body = await req.json()
      const { status, result, error_message, coherence_time, fidelity, purity, entropy } = body

      const job = await jobRepository.findById(id)

      if (!job) {
        return NextResponse.json({ error: "Not found", message: "Job not found" }, { status: 404 })
      }

      // Only admin or job owner can update
      if (session.role !== "admin" && job.user_id !== session.userId) {
        return NextResponse.json({ error: "Forbidden", message: "Access denied" }, { status: 403 })
      }

      const updatedJob = await jobRepository.updateStatus(id, status, {
        result,
        error_message,
        coherence_time,
        fidelity,
        purity,
        entropy,
      })

      return NextResponse.json({
        message: "Job updated successfully",
        job: updatedJob,
      })
    } catch (error) {
      console.error("[v0] Update job error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to update job" }, { status: 500 })
    }
  })
}
