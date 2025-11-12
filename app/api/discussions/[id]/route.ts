import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const discussion = await CommunityRepository.getDiscussionById(params.id)
    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    return NextResponse.json(discussion)
  } catch (error) {
    return handleApiError(error)
  }
}
