import { type NextRequest, NextResponse } from "next/server"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profile = await CommunityRepository.getUserProfile(params.id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return handleApiError(error)
  }
}
