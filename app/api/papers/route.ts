import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"
import { validatePaperSubmission } from "@/lib/errors/validation"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const filters = {
      status: searchParams.get("status") || undefined,
      category: searchParams.get("category") || undefined,
      userId: searchParams.get("userId") || undefined,
      limit: Number.parseInt(searchParams.get("limit") || "20"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    }

    const papers = await CommunityRepository.getPapers(filters)

    return NextResponse.json({ papers, count: papers.length })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    const validation = validatePaperSubmission(body)
    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 })
    }

    const paper = await CommunityRepository.createPaper({
      userId: user.id,
      title: body.title,
      abstract: body.abstract,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
      status: "draft",
      organismId: body.organismId || undefined,
    })

    // Create activity
    await CommunityRepository.createActivity({
      userId: user.id,
      activityType: "paper_published",
      targetType: "paper",
      targetId: paper.id,
      metadata: { title: paper.title },
      isPublic: paper.status === "published",
    })

    return NextResponse.json(paper, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
