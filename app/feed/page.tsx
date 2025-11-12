"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { ActivityItem } from "@/components/feed/activity-item"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function FeedPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = async () => {
    try {
      const response = await apiClient("/api/feed")
      setActivities(response.activities)
    } catch (error) {
      console.error("[v0] Failed to fetch feed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return (
    <div className="container mx-auto max-w-3xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Feed</h1>
          <p className="text-muted-foreground">Latest updates from the quantum research community</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchFeed}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-3 bg-secondary rounded w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No activities yet. Follow users to see their updates here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
