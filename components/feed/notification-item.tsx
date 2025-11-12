"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/lib/types/community"
import { Heart, MessageCircle, UserPlus, FileText, AtSign } from "lucide-react"
import Link from "next/link"

interface NotificationItemProps {
  notification: Notification
  onRead?: () => void
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "paper_citation":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "mention":
        return <AtSign className="h-4 w-4 text-cyan-500" />
      default:
        return null
    }
  }

  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead()
    }
  }

  return (
    <Link href={notification.link || "#"} onClick={handleClick}>
      <Card
        className={`p-4 hover:border-cyan-500/50 transition-colors cursor-pointer ${
          !notification.isRead ? "bg-cyan-500/5 border-cyan-500/30" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-secondary">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm">{notification.title}</p>
              {!notification.isRead && <Badge className="bg-cyan-500 text-xs">New</Badge>}
            </div>
            {notification.message && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
