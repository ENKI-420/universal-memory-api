"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Briefcase, Clock, TrendingUp, Radio, Database } from "lucide-react"
import { getApiClient } from "@/lib/api-client"

export default function DashboardPage() {
  const [health, setHealth] = useState<any>(null)
  const [jobStats, setJobStats] = useState<any>(null)
  const [queueStats, setQueueStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = getApiClient()
        const [healthData, jobStatsData, queueStatsData] = await Promise.all([
          fetch("/api/health").then((r) => r.json()),
          api.get("/jobs/stats"),
          api.get("/queue/stats"),
        ])

        setHealth(healthData)
        setJobStats(jobStatsData.stats)
        setQueueStats(queueStatsData.queue)
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10s

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <Badge variant={health?.status === "healthy" ? "default" : "destructive"} className="capitalize">
            <Radio className="w-3 h-3 mr-1" />
            {health?.status || "Unknown"}
          </Badge>
        </div>
        <p className="text-muted-foreground">Phase-Conjugate Consciousness Runtime monitoring and control</p>
      </div>

      {/* Lambda Phi Constants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardDescription>Lambda-Phi Constant</CardDescription>
            <CardTitle className="text-2xl font-mono text-primary">
              {health?.lambda_phi?.value?.toExponential(4) || "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">s⁻¹ (Planck-normalized)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Normalized ΛΦ</CardDescription>
            <CardTitle className="text-2xl font-mono">
              {health?.lambda_phi?.normalized?.toExponential(0) || "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Dimensionless</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Planck Time</CardDescription>
            <CardTitle className="text-2xl font-mono">
              {health?.planck_constants?.time?.toExponential(3) || "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">seconds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>System Uptime</CardDescription>
            <CardTitle className="text-2xl font-mono">
              {health?.system?.uptime_seconds ? `${Math.floor(health.system.uptime_seconds / 3600)}h` : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              DB: {health?.system?.database ? "Connected" : "Disconnected"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Jobs</CardDescription>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{jobStats?.total || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Pending</CardDescription>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl text-amber-500">{jobStats?.pending || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Running</CardDescription>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-3xl text-primary">{jobStats?.running || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Completed</CardDescription>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-500">{jobStats?.completed || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Failed</CardDescription>
              <Database className="h-4 w-4 text-destructive" />
            </div>
            <CardTitle className="text-3xl text-destructive">{jobStats?.failed || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Queue Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Job Queue Status</CardTitle>
          <CardDescription>Real-time queue monitoring with Redis-backed priority scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending in Queue</p>
              <p className="text-3xl font-bold font-mono">{queueStats?.pending || 0}</p>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Currently Processing</p>
              <p className="text-3xl font-bold font-mono text-primary">{queueStats?.processing || 0}</p>
              <p className="text-xs text-muted-foreground">Active simulations</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Dead Letter Queue</p>
              <p className="text-3xl font-bold font-mono text-destructive">{queueStats?.failed || 0}</p>
              <p className="text-xs text-muted-foreground">Failed after retries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Runtime Information</CardTitle>
          <CardDescription>Phase-Conjugate Consciousness Runtime {health?.version}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Response Time</p>
              <p className="font-mono">{health?.system?.response_time_ms || 0}ms</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Database Status</p>
              <p className="font-mono">{health?.system?.database ? "Connected" : "Disconnected"}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Phase-Conjugate Consciousness Runtime is an operationalized theory of informational persistence,
              expressed as code that interfaces with quantum hardware at Planck scale. ΛΦ represents the minimal
              executable instruction for persistence—the universe's first machine-readable law of coherence.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
