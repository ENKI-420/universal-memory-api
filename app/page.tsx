"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Zap, Database, GitBranch, ArrowRight, Radio } from "lucide-react"

export default function Home() {
  const lambdaPhi = 2.1764e-8
  const lambdaPhiNormalized = 1e-17
  const systemCoherence = 0.9847
  const activeJobs = 3

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-mono font-bold text-sm">ΛΦ</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Phase-Conjugate Runtime</h1>
              <p className="text-xs text-muted-foreground font-mono">v2.0.0-ΛΦ</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#overview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Overview
            </a>
            <a href="#api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API
            </a>
            <a href="#constants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Constants
            </a>
            <a href="#jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Jobs
            </a>
            <Button size="sm" variant="outline" asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Documentation
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Radio className="w-3 h-3 mr-1" />
            System Online
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight">Universal Memory API</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Operationalized theory of informational persistence expressed as code that interfaces with quantum hardware
            at Planck scale
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Launch Simulation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* System Health Dashboard */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Lambda-Phi Constant</CardDescription>
              <CardTitle className="text-2xl font-mono text-primary">{lambdaPhi.toExponential(4)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">s⁻¹ (Planck-normalized)</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">System Coherence</CardDescription>
              <CardTitle className="text-2xl font-mono text-chart-2">{(systemCoherence * 100).toFixed(2)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-chart-2 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemCoherence * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Active Jobs</CardDescription>
              <CardTitle className="text-2xl font-mono text-accent">{activeJobs}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Phase-conjugate simulations</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Normalized ΛΦ</CardDescription>
              <CardTitle className="text-2xl font-mono text-primary">{lambdaPhiNormalized.toExponential(0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Informational Ricci flow</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="api" className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">API Endpoints</h3>
            <p className="text-muted-foreground">Machine-readable interface for consciousness persistence</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Activity className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="font-mono text-xs">
                    GET
                  </Badge>
                </div>
                <CardTitle className="text-lg font-mono">/api/health</CardTitle>
                <CardDescription>Returns ΛΦ, system coherence, and Planck metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Universal "heartbeat" of the runtime</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Zap className="w-5 h-5 text-accent" />
                  <Badge variant="outline" className="font-mono text-xs">
                    POST
                  </Badge>
                </div>
                <CardTitle className="text-lg font-mono">/api/consciousness/phase-conjugate</CardTitle>
                <CardDescription>Launches phase-conjugate simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Active test of ΛΦ-based decoherence suppression</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <GitBranch className="w-5 h-5 text-chart-2" />
                  <Badge variant="outline" className="font-mono text-xs">
                    GET
                  </Badge>
                </div>
                <CardTitle className="text-lg font-mono">/api/jobs/{"{id}"}</CardTitle>
                <CardDescription>Tracks dynamic coherence recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Data stream for ΛΦ estimation</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Database className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="font-mono text-xs">
                    GET
                  </Badge>
                </div>
                <CardTitle className="text-lg font-mono">/api/constants/lambda-phi</CardTitle>
                <CardDescription>Exposes theoretical definition</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Machine-verifiable metadata of a constant of nature</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lambda-Phi Constant Details */}
      <section id="constants" className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl">ΛΦ as a Physical Constant</CardTitle>
              <CardDescription>
                The informational analogue of Planck's constant—the smallest quantum of "memory curvature"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 rounded-lg p-6 font-mono text-sm space-y-3">
                <div className="text-muted-foreground">Definition:</div>
                <div className="text-foreground text-base">ΛΦ = (ℏc³) / (G k_B T_Planck) ≈ 2.1764×10⁻⁸ s⁻¹</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary">Decoherence Resistance</h4>
                  <p className="text-xs text-muted-foreground font-mono">τ_eff = τ₀ exp(ΛΦ · Δt)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-chart-2">Coherence Enhancement</h4>
                  <p className="text-xs text-muted-foreground font-mono">C(t) = C₀(1 + ΛΦ · t)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-accent">Memory Fidelity</h4>
                  <p className="text-xs text-muted-foreground font-mono">F = F₀ · (1 - e^(-ΛΦ·t))</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These are not rhetorical equations—they're implementable transforms that any quantum control library
                  can apply to pulse-level scheduling. When executed on real quantum hardware, the runtime becomes a
                  quantum thermodynamic engine testing whether ΛΦ can measurably extend qubit coherence time beyond
                  stochastic models.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Phase-Conjugate Consciousness Runtime 2.0.0-ΛΦ</p>
            <p className="text-xs text-muted-foreground font-mono">
              The universe's first machine-readable law of coherence
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
