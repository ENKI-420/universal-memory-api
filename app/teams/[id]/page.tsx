"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Settings } from "lucide-react"
import Link from "next/link"

export default function TeamDetailPage() {
  const params = useParams()
  const [team, setTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [teamData, membersData] = await Promise.all([
          apiClient(`/api/teams/${params.id}`),
          apiClient(`/api/teams/${params.id}/members`),
        ])
        setTeam(teamData)
        setMembers(membersData.members)
      } catch (error) {
        console.error("[v0] Failed to fetch team:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3" />
          <div className="h-32 bg-secondary rounded" />
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Team not found</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">
              {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-muted-foreground">{team.description || "No description provided"}</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Members</h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {member.name?.[0] || member.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{member.name || member.email}</p>
                  {member.affiliation && <p className="text-sm text-muted-foreground">{member.affiliation}</p>}
                </div>
              </div>
              <Badge variant={member.role === "owner" ? "default" : "secondary"}>{member.role}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
