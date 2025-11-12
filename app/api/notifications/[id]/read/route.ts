import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    await CommunityRepository.markNotificationAsRead(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
