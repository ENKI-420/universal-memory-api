"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getApiClient } from "@/lib/api-client"
import { RefreshCw, Activity, Database, Cpu, HardDrive } from "lucide-react"

export default function MonitoringPage() {
  const [health, setHealth] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const api = getApiClient()
      const [healthData, metricsData] = await Promise.all([
        fetch("/api/monitoring/health").then((r) => r.json()),
        api.get("/monitoring/metrics"),
      ])

      setHealth(healthData)
      setMetrics(metricsData)
    } catch (error) {
      console.error("[v0] Failed to fetch monitoring data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading monitoring data...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "degraded":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "unhealthy":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time observability and health metrics</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Health Status */}
      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Overall system status and component health</CardDescription>
            </div>
            <Badge className={getStatusColor(health?.status)}>
              <Activity className="w-3 h-3 mr-1" />
              {health?.status || "Unknown"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Database</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={health?.checks?.database?.status ? "default" : "destructive"}>
                  {health?.checks?.database?.status ? "Connected" : "Disconnected"}
                </Badge>
                {health?.checks?.database?.latency_ms && (
                  <p className="text-xs text-muted-foreground font-mono">{health.checks.database.latency_ms}ms</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Redis</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={health?.checks?.redis?.status ? "default" : "destructive"}>
                  {health?.checks?.redis?.status ? "Connected" : "Disconnected"}
                </Badge>
                {health?.checks?.redis?.latency_ms && (
                  <p className="text-xs text-muted-foreground font-mono">{health.checks.redis.latency_ms}ms</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Memory</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={health?.checks?.memory?.status ? "default" : "destructive"}>
                  {health?.checks?.memory?.usage_percent?.toFixed(1)}% Used
                </Badge>
                <p className="text-xs text-muted-foreground">{health?.checks?.memory?.status ? "Normal" : "High"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Heap Used</CardDescription>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-mono">{metrics?.memory?.heapUsed?.toFixed(2) || 0} MB</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">of {metrics?.memory?.heapTotal?.toFixed(2) || 0} MB total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>RSS Memory</CardDescription>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-mono">{metrics?.memory?.rss?.toFixed(2) || 0} MB</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Resident set size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>CPU Usage</CardDescription>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-mono">{metrics?.cpu?.usage_seconds?.toFixed(2) || 0}s</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total CPU time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Uptime</CardDescription>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-mono">
              {metrics?.uptime ? `${Math.floor(metrics.uptime / 3600)}h` : "0h"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {metrics?.uptime ? `${Math.floor((metrics.uptime % 3600) / 60)}m` : "0m"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Information */}
      <Card>
        <CardHeader>
          <CardTitle>Observability Stack</CardTitle>
          <CardDescription>Production monitoring and logging infrastructure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Structured Logging</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• JSON-formatted log entries</li>
                <li>• Multiple log levels (debug, info, warning, error, critical)</li>
                <li>• Contextual metadata and error tracking</li>
                <li>• Request ID correlation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Metrics Collection</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• API request duration and status codes</li>
                <li>• Job execution time and quantum metrics</li>
                <li>• System health (CPU, memory, latency)</li>
                <li>• Lambda Phi calibration tracking</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-2">Audit Logging</h4>
            <p className="text-sm text-muted-foreground">
              All user actions, resource access, and security events are logged to the audit_logs table for compliance
              and security monitoring. Logs include user ID, action type, resource details, IP address, and user agent
              information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
