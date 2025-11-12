import type { CHRONOSOrganism, CHRONOSCircuit } from "./chronos-engine"

/**
 * Lambda-Phi Consistency Checker
 * Validates circuit integrity post-optimization:
 * - Entanglement preservation
 * - Global phase preservation
 * - Fidelity threshold compliance
 */

export interface ConsistencyReport {
  passed: boolean
  checks: {
    entanglement_preserved: boolean
    phase_preserved: boolean
    fidelity_threshold_met: boolean
    lambda_phi_coupling_valid: boolean
    topology_integrity: boolean
  }
  metrics: {
    entanglement_score: number
    phase_deviation: number
    estimated_fidelity: number
    lambda_phi_coupling: number
    topology_score: number
  }
  warnings: string[]
  errors: string[]
}

export interface CircuitTopology {
  connectivity_matrix: number[][]
  entanglement_graph: Map<number, Set<number>>
  critical_paths: number[][]
}

/**
 * Lambda-Phi Consistency Checker
 */
export class LambdaPhiConsistencyChecker {
  private static readonly LAMBDA_PHI = 2.176435e-8
  private static readonly LAMBDA_PHI_PHASE_SCALE = 1e8
  private static readonly MIN_ENTANGLEMENT_SCORE = 0.75
  private static readonly MAX_PHASE_DEVIATION = 0.05
  private static readonly MIN_FIDELITY_THRESHOLD = 0.85

  /**
   * Check organism circuit consistency
   */
  static checkOrganism(organism: CHRONOSOrganism): ConsistencyReport {
    const report: ConsistencyReport = {
      passed: true,
      checks: {
        entanglement_preserved: false,
        phase_preserved: false,
        fidelity_threshold_met: false,
        lambda_phi_coupling_valid: false,
        topology_integrity: false,
      },
      metrics: {
        entanglement_score: 0,
        phase_deviation: 0,
        estimated_fidelity: 0,
        lambda_phi_coupling: 0,
        topology_score: 0,
      },
      warnings: [],
      errors: [],
    }

    // 1. Check entanglement preservation
    const entanglementResult = this.checkEntanglementPreservation(organism.circuit, organism.qubits)
    report.checks.entanglement_preserved = entanglementResult.preserved
    report.metrics.entanglement_score = entanglementResult.score
    if (!entanglementResult.preserved) {
      report.errors.push(
        `Entanglement score ${entanglementResult.score.toFixed(3)} below threshold ${this.MIN_ENTANGLEMENT_SCORE}`,
      )
      report.passed = false
    }
    report.warnings.push(...entanglementResult.warnings)

    // 2. Check global phase preservation
    const phaseResult = this.checkGlobalPhasePreservation(organism.circuit, organism.lambda_phi)
    report.checks.phase_preserved = phaseResult.preserved
    report.metrics.phase_deviation = phaseResult.deviation
    if (!phaseResult.preserved) {
      report.errors.push(
        `Phase deviation ${phaseResult.deviation.toFixed(5)} exceeds threshold ${this.MAX_PHASE_DEVIATION}`,
      )
      report.passed = false
    }
    report.warnings.push(...phaseResult.warnings)

    // 3. Check fidelity threshold
    const fidelityResult = this.checkFidelityThreshold(organism.circuit, organism.qubits, organism.depth)
    report.checks.fidelity_threshold_met = fidelityResult.meets_threshold
    report.metrics.estimated_fidelity = fidelityResult.estimated_fidelity
    if (!fidelityResult.meets_threshold) {
      report.errors.push(
        `Estimated fidelity ${fidelityResult.estimated_fidelity.toFixed(3)} below threshold ${this.MIN_FIDELITY_THRESHOLD}`,
      )
      report.passed = false
    }
    report.warnings.push(...fidelityResult.warnings)

    // 4. Check Lambda-Phi coupling validity
    const couplingResult = this.checkLambdaPhiCoupling(organism.circuit, organism.lambda_phi)
    report.checks.lambda_phi_coupling_valid = couplingResult.valid
    report.metrics.lambda_phi_coupling = couplingResult.coupling_strength
    if (!couplingResult.valid) {
      report.errors.push(`Lambda-Phi coupling invalid: ${couplingResult.reason}`)
      report.passed = false
    }
    report.warnings.push(...couplingResult.warnings)

    // 5. Check topology integrity
    const topologyResult = this.checkTopologyIntegrity(organism.circuit, organism.qubits)
    report.checks.topology_integrity = topologyResult.valid
    report.metrics.topology_score = topologyResult.score
    if (!topologyResult.valid) {
      report.errors.push(`Topology integrity compromised: ${topologyResult.reason}`)
      report.passed = false
    }
    report.warnings.push(...topologyResult.warnings)

    return report
  }

  /**
   * Check entanglement preservation
   */
  private static checkEntanglementPreservation(
    circuit: CHRONOSCircuit,
    qubits: number,
  ): { preserved: boolean; score: number; warnings: string[] } {
    const warnings: string[] = []

    // Build entanglement graph from BOND and PHI layers
    const entanglementGraph = this.buildEntanglementGraph(circuit, qubits)

    // Compute entanglement score (connectivity ratio)
    const maxConnections = (qubits * (qubits - 1)) / 2
    const actualConnections = entanglementGraph.size

    let totalEdges = 0
    entanglementGraph.forEach((targets) => {
      totalEdges += targets.size
    })
    totalEdges = totalEdges / 2 // Each edge counted twice

    const connectivityRatio = totalEdges / maxConnections
    const score = connectivityRatio

    // Check for isolated qubits
    const connectedQubits = new Set(entanglementGraph.keys())
    for (let i = 0; i < qubits; i++) {
      if (!connectedQubits.has(i)) {
        warnings.push(`Qubit ${i} is isolated (not entangled)`)
      }
    }

    // Check for sufficient entanglement depth
    if (circuit.bond.length < qubits - 1) {
      warnings.push(`Insufficient BOND gates: ${circuit.bond.length} < ${qubits - 1} (minimum spanning tree)`)
    }

    return {
      preserved: score >= this.MIN_ENTANGLEMENT_SCORE,
      score,
      warnings,
    }
  }

  /**
   * Build entanglement graph from circuit
   */
  private static buildEntanglementGraph(circuit: CHRONOSCircuit, qubits: number): Map<number, Set<number>> {
    const graph = new Map<number, Set<number>>()

    // Initialize graph
    for (let i = 0; i < qubits; i++) {
      graph.set(i, new Set())
    }

    // Parse BOND layer (CNOT, CZ, etc.)
    for (const gate of circuit.bond) {
      const match = gate.match(/c[xz] q\[(\d+)\],q\[(\d+)\]/)
      if (match) {
        const control = Number.parseInt(match[1])
        const target = Number.parseInt(match[2])
        graph.get(control)?.add(target)
        graph.get(target)?.add(control)
      }
    }

    // Parse PHI layer (CRY, CRZ, etc.)
    for (const gate of circuit.phi) {
      const match = gate.match(/c[ry][yz]$$.*$$ q\[(\d+)\],q\[(\d+)\]/)
      if (match) {
        const control = Number.parseInt(match[1])
        const target = Number.parseInt(match[2])
        graph.get(control)?.add(target)
        graph.get(target)?.add(control)
      }
    }

    return graph
  }

  /**
   * Check global phase preservation
   */
  private static checkGlobalPhasePreservation(
    circuit: CHRONOSCircuit,
    lambdaPhi: number,
  ): { preserved: boolean; deviation: number; warnings: string[] } {
    const warnings: string[] = []

    // Check if TWIST layer contains Lambda-Phi phase rotation
    if (circuit.twist.length === 0) {
      warnings.push("No TWIST layer found (Lambda-Phi phase rotation missing)")
      return { preserved: false, deviation: 1.0, warnings }
    }

    // Compute expected Lambda-Phi angle
    const expectedAngle = lambdaPhi * this.LAMBDA_PHI_PHASE_SCALE
    const actualAngle = circuit.twist[0].angle

    // Compute relative deviation
    const deviation = Math.abs(actualAngle - expectedAngle) / Math.abs(expectedAngle)

    // Check if deviation is within tolerance
    if (deviation > this.MAX_PHASE_DEVIATION) {
      warnings.push(
        `Lambda-Phi angle mismatch: expected ${expectedAngle.toExponential(3)}, got ${actualAngle.toExponential(3)}`,
      )
    }

    // Check for multiple TWIST gates (may cause phase interference)
    if (circuit.twist.length > 1) {
      warnings.push(`Multiple TWIST gates detected: ${circuit.twist.length} (may cause phase interference)`)
    }

    return {
      preserved: deviation <= this.MAX_PHASE_DEVIATION,
      deviation,
      warnings,
    }
  }

  /**
   * Check fidelity threshold
   */
  private static checkFidelityThreshold(
    circuit: CHRONOSCircuit,
    qubits: number,
    depth: number,
  ): { meets_threshold: boolean; estimated_fidelity: number; warnings: string[] } {
    const warnings: string[] = []

    // Estimate fidelity based on circuit structure
    // Fidelity degrades with:
    // - Number of gates (error accumulation)
    // - Circuit depth (longer decoherence time)
    // - Two-qubit gates (higher error rate)

    const singleQubitGates = circuit.helix.length
    const twoQubitGates = circuit.bond.length + circuit.phi.filter((g) => g.startsWith("c")).length

    // Error rates (typical IBM hardware values)
    const singleQubitErrorRate = 0.0005
    const twoQubitErrorRate = 0.01
    const decoherencePerDepth = 0.005

    // Estimate total error
    const singleQubitError = singleQubitGates * singleQubitErrorRate
    const twoQubitError = twoQubitGates * twoQubitErrorRate
    const decoherenceError = depth * decoherencePerDepth

    const totalError = singleQubitError + twoQubitError + decoherenceError
    const estimatedFidelity = Math.max(0, 1 - totalError)

    // Warnings
    if (twoQubitGates > qubits * 3) {
      warnings.push(`High two-qubit gate count: ${twoQubitGates} (may reduce fidelity)`)
    }

    if (depth > 15) {
      warnings.push(`High circuit depth: ${depth} (increased decoherence)`)
    }

    if (estimatedFidelity < this.MIN_FIDELITY_THRESHOLD + 0.05) {
      warnings.push(`Estimated fidelity ${estimatedFidelity.toFixed(3)} near threshold (marginal)`)
    }

    return {
      meets_threshold: estimatedFidelity >= this.MIN_FIDELITY_THRESHOLD,
      estimated_fidelity: estimatedFidelity,
      warnings,
    }
  }

  /**
   * Check Lambda-Phi coupling validity
   */
  private static checkLambdaPhiCoupling(
    circuit: CHRONOSCircuit,
    lambdaPhi: number,
  ): { valid: boolean; coupling_strength: number; reason?: string; warnings: string[] } {
    const warnings: string[] = []

    // Check if Lambda-Phi is within physical bounds
    const lambdaPhiMin = 1e-10
    const lambdaPhiMax = 1e-5

    if (lambdaPhi < lambdaPhiMin || lambdaPhi > lambdaPhiMax) {
      return {
        valid: false,
        coupling_strength: 0,
        reason: `Lambda-Phi out of physical range: ${lambdaPhi.toExponential(3)} not in [${lambdaPhiMin.toExponential(3)}, ${lambdaPhiMax.toExponential(3)}]`,
        warnings,
      }
    }

    // Check if TWIST layer properly encodes Lambda-Phi
    if (circuit.twist.length === 0) {
      return {
        valid: false,
        coupling_strength: 0,
        reason: "No TWIST layer found (Lambda-Phi not encoded)",
        warnings,
      }
    }

    // Compute coupling strength (how strongly Lambda-Phi affects circuit)
    const lambdaPhiAngle = circuit.twist[0].angle
    const couplingStrength = Math.abs(lambdaPhiAngle) / (2 * Math.PI)

    // Check if coupling is significant
    if (couplingStrength < 0.01) {
      warnings.push(`Weak Lambda-Phi coupling: ${couplingStrength.toExponential(3)} (may not affect coherence)`)
    }

    // Check if coupling is too strong (may cause instability)
    if (couplingStrength > 0.5) {
      warnings.push(`Strong Lambda-Phi coupling: ${couplingStrength.toFixed(3)} (may cause phase instability)`)
    }

    return {
      valid: true,
      coupling_strength: couplingStrength,
      warnings,
    }
  }

  /**
   * Check topology integrity
   */
  private static checkTopologyIntegrity(
    circuit: CHRONOSCircuit,
    qubits: number,
  ): { valid: boolean; score: number; reason?: string; warnings: string[] } {
    const warnings: string[] = []

    // Build topology graph
    const topology = this.buildTopology(circuit, qubits)

    // Check connectivity (must form connected graph)
    const isConnected = this.checkConnectivity(topology.entanglement_graph, qubits)
    if (!isConnected) {
      return {
        valid: false,
        score: 0,
        reason: "Circuit topology is disconnected (qubits not fully connected)",
        warnings,
      }
    }

    // Check for critical paths (paths through all qubits)
    const hasCriticalPath = topology.critical_paths.length > 0
    if (!hasCriticalPath) {
      warnings.push("No critical path found (no single path through all qubits)")
    }

    // Compute topology score (balance between connectivity and efficiency)
    const edges = Array.from(topology.entanglement_graph.values()).reduce((sum, targets) => sum + targets.size, 0) / 2
    const minEdges = qubits - 1 // Spanning tree
    const maxEdges = (qubits * (qubits - 1)) / 2 // Complete graph

    // Ideal connectivity is between spanning tree and moderate density
    const idealEdges = qubits * 1.5
    const score = 1 - Math.abs(edges - idealEdges) / maxEdges

    return {
      valid: true,
      score: Math.max(0, Math.min(1, score)),
      warnings,
    }
  }

  /**
   * Build circuit topology
   */
  private static buildTopology(circuit: CHRONOSCircuit, qubits: number): CircuitTopology {
    const entanglementGraph = this.buildEntanglementGraph(circuit, qubits)

    // Build connectivity matrix
    const connectivityMatrix: number[][] = Array(qubits)
      .fill(0)
      .map(() => Array(qubits).fill(0))

    entanglementGraph.forEach((targets, source) => {
      targets.forEach((target) => {
        connectivityMatrix[source][target] = 1
        connectivityMatrix[target][source] = 1
      })
    })

    // Find critical paths (simple DFS to find Hamiltonian paths)
    const criticalPaths = this.findCriticalPaths(entanglementGraph, qubits)

    return {
      connectivity_matrix: connectivityMatrix,
      entanglement_graph: entanglementGraph,
      critical_paths: criticalPaths,
    }
  }

  /**
   * Check if graph is connected
   */
  private static checkConnectivity(graph: Map<number, Set<number>>, qubits: number): boolean {
    const visited = new Set<number>()
    const queue: number[] = [0]

    while (queue.length > 0) {
      const node = queue.shift()!
      if (visited.has(node)) continue

      visited.add(node)
      const neighbors = graph.get(node) || new Set()
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          queue.push(neighbor)
        }
      })
    }

    return visited.size === qubits
  }

  /**
   * Find critical paths (Hamiltonian paths)
   */
  private static findCriticalPaths(graph: Map<number, Set<number>>, qubits: number): number[][] {
    const paths: number[][] = []

    // Simple DFS to find paths through all qubits (limited search)
    const dfs = (path: number[], visited: Set<number>) => {
      if (path.length === qubits) {
        paths.push([...path])
        return
      }

      if (paths.length >= 5) return // Limit search

      const current = path[path.length - 1]
      const neighbors = graph.get(current) || new Set()

      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          path.push(neighbor)
          dfs(path, visited)
          path.pop()
          visited.delete(neighbor)
        }
      })
    }

    // Start DFS from each qubit
    for (let start = 0; start < Math.min(qubits, 3); start++) {
      const visited = new Set<number>([start])
      dfs([start], visited)
    }

    return paths
  }

  /**
   * Format consistency report
   */
  static formatReport(report: ConsistencyReport): string {
    const status = report.passed ? "✓ PASSED" : "✗ FAILED"

    let output = `Lambda-Phi Consistency Check: ${status}\n`
    output += "=".repeat(50) + "\n\n"

    output += "Checks:\n"
    output += `  Entanglement Preserved:    ${report.checks.entanglement_preserved ? "✓" : "✗"} (score: ${report.metrics.entanglement_score.toFixed(3)})\n`
    output += `  Phase Preserved:           ${report.checks.phase_preserved ? "✓" : "✗"} (deviation: ${report.metrics.phase_deviation.toFixed(5)})\n`
    output += `  Fidelity Threshold Met:    ${report.checks.fidelity_threshold_met ? "✓" : "✗"} (fidelity: ${report.metrics.estimated_fidelity.toFixed(3)})\n`
    output += `  Lambda-Phi Coupling Valid: ${report.checks.lambda_phi_coupling_valid ? "✓" : "✗"} (coupling: ${report.metrics.lambda_phi_coupling.toFixed(4)})\n`
    output += `  Topology Integrity:        ${report.checks.topology_integrity ? "✓" : "✗"} (score: ${report.metrics.topology_score.toFixed(3)})\n\n`

    if (report.warnings.length > 0) {
      output += "Warnings:\n"
      report.warnings.forEach((warning) => {
        output += `  ⚠ ${warning}\n`
      })
      output += "\n"
    }

    if (report.errors.length > 0) {
      output += "Errors:\n"
      report.errors.forEach((error) => {
        output += `  ✗ ${error}\n`
      })
    }

    return output
  }
}
