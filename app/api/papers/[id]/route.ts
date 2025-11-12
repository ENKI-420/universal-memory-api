import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const paper = await CommunityRepository.getPaperById(params.id)
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }

    // Increment view count
    await CommunityRepository.incrementPaperViews(params.id)

    return NextResponse.json(paper)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    const existingPaper = await CommunityRepository.getPaperById(params.id)
    if (!existingPaper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }

    if (existingPaper.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedPaper = await CommunityRepository.updatePaper(params.id, body)

    return NextResponse.json(updatedPaper)
  } catch (error) {
    return handleApiError(error)
  }
}
