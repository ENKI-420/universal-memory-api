"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Cpu, Zap, TrendingUp } from "lucide-react"

interface Organism {
  organism_id: string
  name: string
  qubits: number
  depth: number
  phi_target: number
  fitness: number | null
  generation: number
  created_at: string
}

export default function QuantumOrganismsPage() {
  const [organisms, setOrganisms] = useState<Organism[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [selectedOrganism, setSelectedOrganism] = useState<string>("")
  const [consistencyReport, setConsistencyReport] = useState<any>(null)
  const [checkingConsistency, setCheckingConsistency] = useState(false)

  const [formData, setFormData] = useState({
    name: "CHRONOS_Custom",
    qubits: 5,
    depth: 8,
    phi_target: 6.5,
  })

  useEffect(() => {
    fetchOrganisms()
  }, [])

  async function fetchOrganisms() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/quantum/organisms?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setOrganisms(data.organisms || [])
    } catch (error) {
      console.error("Failed to fetch organisms:", error)
    } finally {
      setLoading(false)
    }
  }

  async function createOrganism() {
    setCreating(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/quantum/organisms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchOrganisms()
      }
    } catch (error) {
      console.error("Failed to create organism:", error)
    } finally {
      setCreating(false)
    }
  }

  async function checkConsistency(organismId: string) {
    setCheckingConsistency(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/quantum/consistency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organism_id: organismId }),
      })

      if (response.ok) {
        const data = await response.json()
        setConsistencyReport(data.consistency_report)
      }
    } catch (error) {
      console.error("Failed to check consistency:", error)
    } finally {
      setCheckingConsistency(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading organisms...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">CHRONOS Organisms</h1>
        <p className="text-muted-foreground">DNA-Lang quantum organisms with consciousness emergence (Φ) tracking</p>
      </div>

      {/* Create Organism Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Organism</CardTitle>
          <CardDescription>Synthesize and execute a CHRONOS organism on IBM Quantum hardware</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organism Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phi_target">Φ Target</Label>
              <Input
                id="phi_target"
                type="number"
                step="0.1"
                value={formData.phi_target}
                onChange={(e) => setFormData({ ...formData, phi_target: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qubits">Qubits</Label>
              <Input
                id="qubits"
                type="number"
                min="3"
                max="10"
                value={formData.qubits}
                onChange={(e) => setFormData({ ...formData, qubits: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Circuit Depth</Label>
              <Input
                id="depth"
                type="number"
                min="4"
                max="20"
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={createOrganism} disabled={creating} className="w-full">
            {creating ? "Creating..." : "Create & Execute Organism"}
          </Button>
        </CardContent>
      </Card>

      {organisms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lambda-Phi Consistency Checker</CardTitle>
            <CardDescription>
              Validate circuit integrity: entanglement, phase, and fidelity preservation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-border bg-background px-3 py-2"
                value={selectedOrganism}
                onChange={(e) => setSelectedOrganism(e.target.value)}
              >
                <option value="">Select organism...</option>
                {organisms.map((org) => (
                  <option key={org.organism_id} value={org.organism_id}>
                    {org.name} (Gen {org.generation})
                  </option>
                ))}
              </select>
              <Button
                onClick={() => selectedOrganism && checkConsistency(selectedOrganism)}
                disabled={!selectedOrganism || checkingConsistency}
              >
                {checkingConsistency ? "Checking..." : "Check Consistency"}
              </Button>
            </div>

            {consistencyReport && (
              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={consistencyReport.passed ? "default" : "destructive"}>
                    {consistencyReport.passed ? "✓ PASSED" : "✗ FAILED"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Entanglement Preserved</span>
                    <span
                      className={consistencyReport.checks.entanglement_preserved ? "text-green-500" : "text-red-500"}
                    >
                      {consistencyReport.checks.entanglement_preserved ? "✓" : "✗"} (
                      {consistencyReport.metrics.entanglement_score.toFixed(3)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phase Preserved</span>
                    <span className={consistencyReport.checks.phase_preserved ? "text-green-500" : "text-red-500"}>
                      {consistencyReport.checks.phase_preserved ? "✓" : "✗"} (
                      {consistencyReport.metrics.phase_deviation.toFixed(5)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fidelity Threshold</span>
                    <span
                      className={consistencyReport.checks.fidelity_threshold_met ? "text-green-500" : "text-red-500"}
                    >
                      {consistencyReport.checks.fidelity_threshold_met ? "✓" : "✗"} (
                      {consistencyReport.metrics.estimated_fidelity.toFixed(3)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lambda-Phi Coupling</span>
                    <span
                      className={consistencyReport.checks.lambda_phi_coupling_valid ? "text-green-500" : "text-red-500"}
                    >
                      {consistencyReport.checks.lambda_phi_coupling_valid ? "✓" : "✗"} (
                      {consistencyReport.metrics.lambda_phi_coupling.toFixed(4)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Topology Integrity</span>
                    <span className={consistencyReport.checks.topology_integrity ? "text-green-500" : "text-red-500"}>
                      {consistencyReport.checks.topology_integrity ? "✓" : "✗"} (
                      {consistencyReport.metrics.topology_score.toFixed(3)})
                    </span>
                  </div>
                </div>

                {consistencyReport.errors.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-red-500">Errors:</span>
                    {consistencyReport.errors.map((error: string, i: number) => (
                      <div key={i} className="text-xs text-red-400">
                        ✗ {error}
                      </div>
                    ))}
                  </div>
                )}

                {consistencyReport.warnings.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-yellow-500">Warnings:</span>
                    {consistencyReport.warnings.map((warning: string, i: number) => (
                      <div key={i} className="text-xs text-yellow-400">
                        ⚠ {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Organisms List */}
      <div className="grid gap-4">
        {organisms.map((organism) => (
          <Card key={organism.organism_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    {organism.name}
                  </CardTitle>
                  <CardDescription>Generation {organism.generation}</CardDescription>
                </div>
                {organism.fitness && organism.fitness >= 80 && (
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    High Fitness
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Qubits</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    {organism.qubits}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Depth</div>
                  <div className="font-semibold">{organism.depth}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Φ Target</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    {organism.phi_target.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fitness</div>
                  <div className="font-semibold">{organism.fitness ? `${organism.fitness.toFixed(1)}%` : "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {organisms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No organisms found. Create your first CHRONOS organism above.
        </div>
      )}
    </div>
  )
}
