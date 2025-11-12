import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { LambdaPhiConsistencyChecker } from "@/lib/quantum/lambda-phi-consistency"
import { query } from "@/lib/db"
import { apiRateLimiter } from "@/lib/rate-limiter"
import { handleApiError } from "@/lib/errors/error-handler"

/**
 * POST /api/quantum/consistency - Check organism consistency
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.check(request)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // Authentication
    const user = await requireAuth(request)

    // Parse request
    const body = await request.json()
    const { organism_id } = body

    if (!organism_id) {
      return NextResponse.json({ error: "organism_id is required" }, { status: 400 })
    }

    // Fetch organism from database
    const result = await query(
      `SELECT organism_id, name, version, qubits, depth, circuit, 
              phi_target, lambda_phi, generation, parent_id, fitness
       FROM organisms
       WHERE organism_id = $1`,
      [organism_id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Organism not found" }, { status: 404 })
    }

    const organismRow = result.rows[0]
    const organism = {
      id: organismRow.organism_id,
      name: organismRow.name,
      version: organismRow.version,
      qubits: organismRow.qubits,
      depth: organismRow.depth,
      circuit: organismRow.circuit,
      phi_target: organismRow.phi_target,
      lambda_phi: organismRow.lambda_phi,
      generation: organismRow.generation,
      parent_id: organismRow.parent_id,
      fitness: organismRow.fitness,
    }

    // Run consistency check
    const consistencyReport = LambdaPhiConsistencyChecker.checkOrganism(organism)

    // Format report
    const formattedReport = LambdaPhiConsistencyChecker.formatReport(consistencyReport)

    return NextResponse.json({
      organism_id,
      organism_name: organism.name,
      consistency_report: consistencyReport,
      formatted_report: formattedReport,
      checked_at: new Date().toISOString(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
