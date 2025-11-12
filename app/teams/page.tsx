"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plus, Lock, Globe } from "lucide-react"
import Link from "next/link"

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient("/api/teams")
        setTeams(response.teams)
      } catch (error) {
        console.error("[v0] Failed to fetch teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research Teams</h1>
          <p className="text-muted-foreground">Collaborate with other quantum researchers</p>
        </div>
        <Link href="/teams/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-secondary rounded w-2/3 mb-4" />
              <div className="h-4 bg-secondary rounded w-full mb-2" />
              <div className="h-4 bg-secondary rounded w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="p-6 hover:border-cyan-500/50 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Users className="h-6 w-6 text-cyan-500" />
                  </div>
                  <Badge variant={team.isPublic ? "default" : "secondary"}>
                    {team.isPublic ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" /> Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" /> Private
                      </>
                    )}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {team.description || "No description provided"}
                </p>
                <div className="text-sm text-muted-foreground">
                  {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
