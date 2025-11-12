import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const filters = {
      category: searchParams.get("category") || undefined,
      limit: Number.parseInt(searchParams.get("limit") || "20"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    }

    const discussions = await CommunityRepository.getDiscussions(filters)

    return NextResponse.json({ discussions, count: discussions.length })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json({ error: "title, content, and category are required" }, { status: 400 })
    }

    const discussion = await CommunityRepository.createDiscussion({
      userId: user.id,
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
      paperId: body.paperId,
      organismId: body.organismId,
      jobId: body.jobId,
    })

    // Create activity
    await CommunityRepository.createActivity({
      userId: user.id,
      activityType: "discussion_created",
      targetType: "discussion",
      targetId: discussion.id,
      metadata: { title: discussion.title },
      isPublic: true,
    })

    return NextResponse.json(discussion, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
