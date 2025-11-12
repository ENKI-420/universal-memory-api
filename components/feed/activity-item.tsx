"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/types/community"
import { FileText, Cpu, Zap, Users, MessageSquare } from "lucide-react"
import Link from "next/link"

interface ActivityItemProps {
  activity: Activity
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.activityType) {
      case "paper_published":
        return <FileText className="h-5 w-5 text-cyan-500" />
      case "organism_created":
        return <Cpu className="h-5 w-5 text-purple-500" />
      case "job_completed":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "team_created":
        return <Users className="h-5 w-5 text-green-500" />
      case "discussion_created":
        return <MessageSquare className="h-5 w-5 text-yellow-500" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    switch (activity.activityType) {
      case "paper_published":
        return "Published a paper"
      case "organism_created":
        return "Created a quantum organism"
      case "job_completed":
        return "Completed an experiment"
      case "team_created":
        return "Created a team"
      case "discussion_created":
        return "Started a discussion"
      default:
        return "New activity"
    }
  }

  const getLink = () => {
    switch (activity.targetType) {
      case "paper":
        return `/papers/${activity.targetId}`
      case "organism":
        return `/dashboard/quantum`
      case "job":
        return `/experiments/${activity.targetId}`
      case "team":
        return `/teams/${activity.targetId}`
      case "discussion":
        return `/community/discussions/${activity.targetId}`
      default:
        return "#"
    }
  }

  return (
    <Link href={getLink()}>
      <Card className="p-4 hover:border-cyan-500/50 transition-colors cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-secondary">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium">{getTitle()}</p>
              <Badge variant="outline" className="text-xs">
                {new Date(activity.createdAt).toLocaleDateString()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {activity.metadata?.title || activity.metadata?.name || "View details"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
