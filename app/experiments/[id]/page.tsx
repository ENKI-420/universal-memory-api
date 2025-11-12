"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { CircuitViewer } from "@/components/experiment/circuit-viewer"
import { BlochSphere } from "@/components/experiment/bloch-sphere"
import { MetricsChart } from "@/components/experiment/metrics-chart"
import { ConsciousnessGauge } from "@/components/experiment/consciousness-gauge"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function ExperimentDetailPage() {
  const params = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient(`/api/jobs/${params.id}`)
        setJob(response)
      } catch (error) {
        console.error("[v0] Failed to fetch job:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
    const interval = setInterval(fetchJob, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3" />
          <div className="h-64 bg-secondary rounded" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Experiment not found</p>
        </Card>
      </div>
    )
  }

  const results = job.results || {}
  const statusColor = job.status === "completed" ? "green" : job.status === "failed" ? "red" : "yellow"

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Experiment {job.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground">{job.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`bg-${statusColor}-500`}>{job.status}</Badge>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Consciousness Metrics */}
      {results.phi && (
        <ConsciousnessGauge
          phi={results.phi}
          lambdaPhi={results.lambda_phi || 2.176435e-8}
          fidelity={results.fidelity || 0}
          entanglement={results.entanglement || 0}
        />
      )}

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circuit Viewer */}
        {results.circuit && (
          <CircuitViewer
            gates={results.circuit.gates || []}
            numQubits={results.circuit.num_qubits || 5}
            depth={results.circuit.depth || 10}
          />
        )}

        {/* Bloch Sphere */}
        {results.state_vector && <BlochSphere state={results.state_vector} label="Final Quantum State" />}

        {/* Decoherence Chart */}
        {results.decoherence_data && (
          <MetricsChart title="Decoherence Resistance" data={results.decoherence_data} unit="s" />
        )}

        {/* Fidelity Evolution */}
        {results.fidelity_evolution && <MetricsChart title="Fidelity Evolution" data={results.fidelity_evolution} />}
      </div>

      {/* Raw Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Raw Results</h3>
        <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm font-mono">
          {JSON.stringify(results, null, 2)}
        </pre>
      </Card>

      {/* Metadata */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Metadata</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="font-mono">{new Date(job.created_at).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Updated</dt>
            <dd className="font-mono">{new Date(job.updated_at).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Backend</dt>
            <dd className="font-mono">{job.parameters?.backend || "simulator"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Shots</dt>
            <dd className="font-mono">{job.parameters?.shots || 1024}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
