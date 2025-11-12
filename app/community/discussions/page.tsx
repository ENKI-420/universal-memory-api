"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Pin } from "lucide-react"
import Link from "next/link"

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const params = new URLSearchParams()
        if (filter) params.set("category", filter)

        const response = await apiClient(`/api/discussions?${params}`)
        setDiscussions(response.discussions)
      } catch (error) {
        console.error("[v0] Failed to fetch discussions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [filter])

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discussions</h1>
          <p className="text-muted-foreground">Join the conversation about quantum research</p>
        </div>
        <Link href="/community/discussions/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <Button variant={filter === "" ? "default" : "outline"} onClick={() => setFilter("")}>
            All
          </Button>
          <Button variant={filter === "general" ? "default" : "outline"} onClick={() => setFilter("general")}>
            General
          </Button>
          <Button variant={filter === "technical" ? "default" : "outline"} onClick={() => setFilter("technical")}>
            Technical
          </Button>
          <Button variant={filter === "papers" ? "default" : "outline"} onClick={() => setFilter("papers")}>
            Papers
          </Button>
          <Button variant={filter === "organisms" ? "default" : "outline"} onClick={() => setFilter("organisms")}>
            Organisms
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-secondary rounded w-2/3 mb-4" />
              <div className="h-4 bg-secondary rounded w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link key={discussion.id} href={`/community/discussions/${discussion.id}`}>
              <Card className="p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {discussion.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                        <h3 className="text-xl font-semibold">{discussion.title}</h3>
                      </div>
                      <Badge variant="outline">{discussion.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{discussion.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{discussion.viewsCount} views</span>
                      <span>{discussion.repliesCount} replies</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
