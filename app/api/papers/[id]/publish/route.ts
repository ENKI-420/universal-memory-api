import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request)

    const paper = await CommunityRepository.getPaperById(params.id)
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }

    if (paper.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (paper.status === "published") {
      return NextResponse.json({ error: "Paper already published" }, { status: 400 })
    }

    const updatedPaper = await CommunityRepository.updatePaper(params.id, {
      status: "published",
      publishedAt: new Date().toISOString(),
    })

    // Create public activity
    await CommunityRepository.createActivity({
      userId: user.id,
      activityType: "paper_published",
      targetType: "paper",
      targetId: paper.id,
      metadata: { title: paper.title },
      isPublic: true,
    })

    return NextResponse.json(updatedPaper)
  } catch (error) {
    return handleApiError(error)
  }
}
