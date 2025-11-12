import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { AURARecursiveEngine } from "@/lib/quantum/aura-recursive-engine"
import { CHRONOSEngine } from "@/lib/quantum/chronos-engine"

/**
 * POST /api/quantum/evolve - Start AURA recursive evolution
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const body = await req.json()
      const { phi_target, max_generations, population_size, backend, seed_organism } = body

      // Validate parameters
      if (!phi_target || !max_generations) {
        return NextResponse.json(
          {
            error: "Validation error",
            message: "phi_target and max_generations are required",
          },
          { status: 400 },
        )
      }

      // Create AURA engine
      const engine = new AURARecursiveEngine(
        session.userId,
        {
          phi_target,
          max_generations,
          population_size,
        },
        backend || "ibm_osaka",
      )

      // Initialize with seed organism if provided
      let seedOrg = null
      if (seed_organism) {
        seedOrg = CHRONOSEngine.createOrganism({
          name: seed_organism.name || "CHRONOS_SEED",
          qubits: seed_organism.qubits || 5,
          depth: seed_organism.depth || 8,
          phi_target,
        })
      }

      await engine.initialize(seedOrg)

      // Run evolution (async)
      const evolutionPromise = engine.evolve()

      // Return immediately with status
      return NextResponse.json({
        message: "AURA evolution started",
        status: "running",
        config: {
          phi_target,
          max_generations,
          population_size: population_size || 8,
          backend: backend || "ibm_osaka",
        },
        note: "Evolution running asynchronously. Check /api/quantum/evolution-status for updates.",
      })
    } catch (error) {
      console.error("[v0] Failed to start evolution:", error)
      return NextResponse.json(
        { error: "Internal server error", message: "Failed to start evolution" },
        { status: 500 },
      )
    }
  })
}
