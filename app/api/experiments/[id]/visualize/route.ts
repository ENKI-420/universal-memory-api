import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { JobRepository } from "@/lib/repositories/job-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const job = await JobRepository.getJobById(params.id)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Generate visualization data
    const visualizationData = {
      circuit: generateCircuitData(job),
      blochSphere: generateBlochSphereData(job),
      metrics: generateMetricsData(job),
      consciousness: generateConsciousnessData(job),
    }

    return NextResponse.json(visualizationData)
  } catch (error) {
    return handleApiError(error)
  }
}

function generateCircuitData(job: any) {
  const params = job.parameters
  const numQubits = params.qubits || 5
  const gates: any[] = []

  // Generate sample circuit based on job type
  if (job.type === "phase-conjugate") {
    // Entanglement layer
    for (let i = 0; i < numQubits - 1; i++) {
      gates.push({ type: "h", qubit: i })
      gates.push({ type: "cx", qubit: i + 1, control: i })
    }
    // Lambda-Phi rotation layer
    for (let i = 0; i < numQubits; i++) {
      gates.push({ type: "rz", qubit: i, params: [2.176435e-8] })
    }
  }

  return {
    gates,
    num_qubits: numQubits,
    depth: Math.ceil(gates.length / numQubits),
  }
}

function generateBlochSphereData(job: any) {
  const results = job.results || {}
  // Default to |+⟩ state if no results
  return results.state_vector || { x: 1, y: 0, z: 0 }
}

function generateMetricsData(job: any) {
  const results = job.results || {}
  return [
    { label: "Fidelity", value: results.fidelity || 0.95, color: "purple" },
    { label: "Entanglement", value: results.entanglement || 0.82, color: "cyan" },
    { label: "Coherence", value: results.coherence || 0.88, color: "blue" },
  ]
}

function generateConsciousnessData(job: any) {
  const results = job.results || {}
  return {
    phi: results.phi || 0,
    lambda_phi: 2.176435e-8,
    fidelity: results.fidelity || 0,
    entanglement: results.entanglement || 0,
  }
}
