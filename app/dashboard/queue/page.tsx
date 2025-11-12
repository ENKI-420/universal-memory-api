"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getApiClient } from "@/lib/api-client"
import { RefreshCw } from "lucide-react"

export default function QueuePage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const api = getApiClient()
      const data = await api.get("/queue/stats")
      setStats(data.queue)
    } catch (error) {
      console.error("[v0] Failed to fetch queue stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Queue</h1>
          <p className="text-muted-foreground">Redis-backed priority queue monitoring</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Pending Jobs</CardDescription>
            <CardTitle className="text-4xl font-mono">{stats?.pending || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader>
            <CardDescription>Processing</CardDescription>
            <CardTitle className="text-4xl font-mono text-primary">{stats?.processing || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardDescription>Failed (DLQ)</CardDescription>
            <CardTitle className="text-4xl font-mono text-destructive">{stats?.failed || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Dead letter queue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Information</CardTitle>
          <CardDescription>Priority-based job scheduling with automatic retry and exponential backoff</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Queue Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Priority-based scheduling (1-10)</li>
                <li>• Automatic retry with exponential backoff</li>
                <li>• Dead letter queue for failed jobs</li>
                <li>• Redis-backed distributed queue</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Processing Rules</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Max 3 retry attempts per job</li>
                <li>• 5-second polling interval</li>
                <li>• ΛΦ-enhanced decoherence resistance</li>
                <li>• Real-time metrics recording</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
