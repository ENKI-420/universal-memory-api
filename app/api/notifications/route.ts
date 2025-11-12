import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const notifications = await CommunityRepository.getNotifications(user.id, limit)
    const unreadCount = await CommunityRepository.getUnreadNotificationCount(user.id)

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    return handleApiError(error)
  }
}
