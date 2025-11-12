import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    const { targetType, targetId } = body

    if (!targetType || !targetId) {
      return NextResponse.json({ error: "targetType and targetId are required" }, { status: 400 })
    }

    const liked = await CommunityRepository.toggleLike(user.id, targetType, targetId)

    const likeCount = await CommunityRepository.getLikeCount(targetType, targetId)

    return NextResponse.json({ liked, likeCount })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const targetType = searchParams.get("targetType")
    const targetId = searchParams.get("targetId")

    if (!targetType || !targetId) {
      return NextResponse.json({ error: "targetType and targetId are required" }, { status: 400 })
    }

    const likeCount = await CommunityRepository.getLikeCount(targetType, targetId)

    return NextResponse.json({ likeCount })
  } catch (error) {
    return handleApiError(error)
  }
}
