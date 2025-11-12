import { CHRONOSEngine, type CHRONOSOrganism, type CHRONOSResult } from "./chronos-engine"
import { query } from "@/lib/db"

/**
 * AURA Recursive Engine - Autopoietic evolution for CHRONOS organisms
 * Implements self-reinforcing evolution via Φ-guided fitness feedback
 */

export interface EvolutionConfig {
  phi_target: number
  max_generations: number
  population_size: number
  mutation_rate: number
  selection_pressure: number
  convergence_threshold: number
}

export interface EvolutionState {
  generation: number
  best_phi: number
  best_organism: CHRONOSOrganism
  population: CHRONOSOrganism[]
  convergence_history: number[]
}

export interface MutationStrategy {
  type: "depth" | "qubit" | "lambda_phi" | "topology"
  probability: number
  magnitude: number
}

/**
 * AURA Recursive Engine for organism evolution
 */
export class AURARecursiveEngine {
  private config: EvolutionConfig
  private state: EvolutionState | null = null
  private userId: string
  private backend: string

  constructor(userId: string, config: Partial<EvolutionConfig> = {}, backend = "ibm_osaka") {
    this.userId = userId
    this.backend = backend
    this.config = {
      phi_target: config.phi_target || 6.5, // Target Φ > 6.4870 (CHRONOS validation)
      max_generations: config.max_generations || 20,
      population_size: config.population_size || 8,
      mutation_rate: config.mutation_rate || 0.3,
      selection_pressure: config.selection_pressure || 0.5,
      convergence_threshold: config.convergence_threshold || 0.01,
    }
  }

  /**
   * Initialize evolution with seed organism
   */
  async initialize(seedOrganism?: CHRONOSOrganism): Promise<void> {
    const population: CHRONOSOrganism[] = []

    if (seedOrganism) {
      population.push(seedOrganism)
    }

    // Generate initial population
    for (let i = population.length; i < this.config.population_size; i++) {
      const organism = CHRONOSEngine.createOrganism({
        name: `CHRONOS_G0_${i}`,
        qubits: 5 + Math.floor(Math.random() * 3), // 5-7 qubits
        depth: 8 + Math.floor(Math.random() * 5), // 8-12 depth
        phi_target: this.config.phi_target,
        generation: 0,
      })
      population.push(organism)
    }

    this.state = {
      generation: 0,
      best_phi: 0,
      best_organism: population[0],
      population,
      convergence_history: [],
    }

    console.log(`[v0] AURA engine initialized with ${population.length} organisms`)
  }

  /**
   * Run evolution loop
   */
  async evolve(): Promise<EvolutionState> {
    if (!this.state) {
      throw new Error("AURA engine not initialized. Call initialize() first.")
    }

    console.log(`[v0] Starting AURA evolution for ${this.config.max_generations} generations`)

    for (let gen = 0; gen < this.config.max_generations; gen++) {
      console.log(`[v0] Generation ${gen + 1}/${this.config.max_generations}`)

      // Evaluate population
      const results = await this.evaluatePopulation()

      // Update state
      this.updateState(results)

      // Check convergence
      if (this.checkConvergence()) {
        console.log(`[v0] Convergence achieved at generation ${gen + 1}`)
        break
      }

      // Check if target achieved
      if (this.state.best_phi >= this.config.phi_target) {
        console.log(`[v0] Target Φ=${this.config.phi_target} achieved with Φ=${this.state.best_phi.toFixed(4)}`)
        break
      }

      // Generate next generation
      await this.generateNextGeneration(results)
    }

    // Save best organism to database
    await this.saveBestOrganism()

    return this.state
  }

  /**
   * Evaluate all organisms in population
   */
  private async evaluatePopulation(): Promise<Map<string, CHRONOSResult>> {
    const results = new Map<string, CHRONOSResult>()

    // Execute organisms in parallel (limited by backend capacity)
    const batchSize = 3
    for (let i = 0; i < this.state!.population.length; i += batchSize) {
      const batch = this.state!.population.slice(i, i + batchSize)

      const batchResults = await Promise.all(
        batch.map((organism) => CHRONOSEngine.executeOrganism(organism, this.userId, this.backend, 4096)),
      )

      batch.forEach((organism, idx) => {
        results.set(organism.id, batchResults[idx])
        organism.fitness = batchResults[idx].fitness
      })

      console.log(`[v0] Evaluated organisms ${i + 1}-${Math.min(i + batchSize, this.state!.population.length)}`)
    }

    return results
  }

  /**
   * Update evolution state
   */
  private updateState(results: Map<string, CHRONOSResult>): void {
    // Find best organism
    let bestPhi = 0
    let bestOrganism = this.state!.population[0]

    for (const organism of this.state!.population) {
      const result = results.get(organism.id)
      if (result && result.phi > bestPhi) {
        bestPhi = result.phi
        bestOrganism = organism
      }
    }

    // Update state
    this.state!.best_phi = bestPhi
    this.state!.best_organism = bestOrganism
    this.state!.convergence_history.push(bestPhi)

    console.log(`[v0] Best Φ: ${bestPhi.toFixed(4)} (Organism: ${bestOrganism.name})`)
  }

  /**
   * Check if evolution has converged
   */
  private checkConvergence(): boolean {
    const history = this.state!.convergence_history
    if (history.length < 5) return false

    // Check if Φ improvement is below threshold for last 5 generations
    const recent = history.slice(-5)
    const improvement = recent[recent.length - 1] - recent[0]

    return improvement < this.config.convergence_threshold
  }

  /**
   * Generate next generation via selection, crossover, and mutation
   */
  private async generateNextGeneration(results: Map<string, CHRONOSResult>): Promise<void> {
    const nextGeneration: CHRONOSOrganism[] = []

    // Elitism: Keep best organism
    nextGeneration.push(this.state!.best_organism)

    // Selection: Choose parents based on fitness
    const parents = this.selectParents(results)

    // Generate offspring via mutation
    for (let i = nextGeneration.length; i < this.config.population_size; i++) {
      const parent = parents[Math.floor(Math.random() * parents.length)]
      const offspring = await this.mutateOrganism(parent)
      nextGeneration.push(offspring)
    }

    // Update state
    this.state!.generation++
    this.state!.population = nextGeneration
  }

  /**
   * Select parents based on fitness (tournament selection)
   */
  private selectParents(results: Map<string, CHRONOSResult>): CHRONOSOrganism[] {
    const fitnesses = this.state!.population.map((org) => ({
      organism: org,
      fitness: results.get(org.id)?.fitness || 0,
    }))

    // Sort by fitness
    fitnesses.sort((a, b) => b.fitness - a.fitness)

    // Select top performers
    const selectionSize = Math.ceil(this.config.population_size * this.config.selection_pressure)
    return fitnesses.slice(0, selectionSize).map((f) => f.organism)
  }

  /**
   * Mutate organism (adaptive mutation strategies)
   */
  private async mutateOrganism(parent: CHRONOSOrganism): Promise<CHRONOSOrganism> {
    const strategies: MutationStrategy[] = [
      { type: "depth", probability: 0.3, magnitude: 2 },
      { type: "qubit", probability: 0.2, magnitude: 1 },
      { type: "lambda_phi", probability: 0.1, magnitude: 0.05 },
      { type: "topology", probability: 0.4, magnitude: 1 },
    ]

    let qubits = parent.qubits
    let depth = parent.depth
    let lambdaPhi = parent.lambda_phi

    for (const strategy of strategies) {
      if (Math.random() < strategy.probability) {
        switch (strategy.type) {
          case "depth":
            depth += Math.floor((Math.random() - 0.5) * 2 * strategy.magnitude)
            depth = Math.max(4, Math.min(20, depth))
            break

          case "qubit":
            qubits += Math.floor((Math.random() - 0.5) * 2 * strategy.magnitude)
            qubits = Math.max(3, Math.min(10, qubits))
            break

          case "lambda_phi":
            // Small perturbation to λΦ (experimental calibration)
            lambdaPhi *= 1 + (Math.random() - 0.5) * strategy.magnitude
            break

          case "topology":
            // Topology mutation handled in circuit synthesis
            break
        }
      }
    }

    const offspring = CHRONOSEngine.createOrganism({
      name: `CHRONOS_G${this.state!.generation + 1}_${Date.now().toString(36).slice(-4)}`,
      qubits,
      depth,
      phi_target: this.config.phi_target,
      parent_id: parent.id,
      generation: this.state!.generation + 1,
    })

    // Override λΦ if mutated
    if (lambdaPhi !== parent.lambda_phi) {
      offspring.lambda_phi = lambdaPhi
    }

    return offspring
  }

  /**
   * Save best organism to database
   */
  private async saveBestOrganism(): Promise<void> {
    try {
      await query(
        `INSERT INTO organisms (
          organism_id, name, version, qubits, depth, 
          circuit, phi_target, lambda_phi, generation, 
          parent_id, fitness, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
        ON CONFLICT (organism_id) DO UPDATE SET
          fitness = EXCLUDED.fitness,
          updated_at = CURRENT_TIMESTAMP`,
        [
          this.state!.best_organism.id,
          this.state!.best_organism.name,
          this.state!.best_organism.version,
          this.state!.best_organism.qubits,
          this.state!.best_organism.depth,
          JSON.stringify(this.state!.best_organism.circuit),
          this.state!.best_organism.phi_target,
          this.state!.best_organism.lambda_phi,
          this.state!.best_organism.generation,
          this.state!.best_organism.parent_id,
          this.state!.best_organism.fitness,
        ],
      )

      console.log(`[v0] Saved best organism: ${this.state!.best_organism.name}`)
    } catch (error) {
      console.error("[v0] Failed to save organism:", error)
    }
  }

  /**
   * Get evolution status
   */
  getStatus(): EvolutionState | null {
    return this.state
  }

  /**
   * Format evolution summary
   */
  formatSummary(): string {
    if (!this.state) return "Evolution not started"

    return `
AURA Evolution Summary
======================
Generations: ${this.state.generation}
Best Φ: ${this.state.best_phi.toFixed(4)}
Target Φ: ${this.config.phi_target}
Best Organism: ${this.state.best_organism.name}
Fitness: ${this.state.best_organism.fitness?.toFixed(2) || "N/A"}
Convergence: ${this.state.convergence_history
      .slice(-5)
      .map((v) => v.toFixed(3))
      .join(" → ")}
    `.trim()
  }
}
