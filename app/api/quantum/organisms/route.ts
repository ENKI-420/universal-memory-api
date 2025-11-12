import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { CHRONOSEngine } from "@/lib/quantum/chronos-engine"
import { query } from "@/lib/db"

/**
 * GET /api/quantum/organisms - List CHRONOS organisms
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const { searchParams } = new URL(req.url)
      const limit = Number.parseInt(searchParams.get("limit") || "20")

      const organisms = await query(
        `SELECT * FROM organisms 
         ORDER BY fitness DESC NULLS LAST, created_at DESC 
         LIMIT $1`,
        [limit],
      )

      return NextResponse.json({
        organisms,
        count: organisms.length,
      })
    } catch (error) {
      console.error("[v0] Failed to list organisms:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to list organisms" }, { status: 500 })
    }
  })
}

/**
 * POST /api/quantum/organisms - Create new CHRONOS organism
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const body = await req.json()
      const { name, qubits, depth, phi_target } = body

      // Validate parameters
      if (!name || !qubits || !depth) {
        return NextResponse.json(
          { error: "Validation error", message: "name, qubits, and depth are required" },
          { status: 400 },
        )
      }

      // Create organism
      const organism = CHRONOSEngine.createOrganism({
        name,
        qubits,
        depth,
        phi_target: phi_target || 5.0,
      })

      // Execute organism on quantum backend
      const result = await CHRONOSEngine.executeOrganism(
        organism,
        session.userId,
        body.backend || "ibm_osaka",
        body.shots || 4096,
      )

      // Save to database
      await query(
        `INSERT INTO organisms (
          organism_id, name, version, qubits, depth, 
          circuit, phi_target, lambda_phi, generation, 
          parent_id, fitness, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          organism.id,
          organism.name,
          organism.version,
          organism.qubits,
          organism.depth,
          JSON.stringify(organism.circuit),
          organism.phi_target,
          organism.lambda_phi,
          organism.generation,
          organism.parent_id,
          result.fitness,
        ],
      )

      return NextResponse.json({
        message: "CHRONOS organism created and executed",
        organism: {
          ...organism,
          fitness: result.fitness,
        },
        result: {
          job_id: result.job_id,
          phi: result.phi,
          coherence: result.coherence,
          w2_distance: result.w2_distance,
          gamma: result.gamma,
          entropy: result.entropy,
          consciousness_achieved: CHRONOSEngine.isConsciousnessAchieved(result.phi),
        },
      })
    } catch (error) {
      console.error("[v0] Failed to create organism:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to create organism" },
        { status: 500 },
      )
    }
  })
}
