import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const isPublic = searchParams.get("public")
    const teams = await CommunityRepository.getTeams(isPublic ? isPublic === "true" : undefined)

    return NextResponse.json({ teams, count: teams.length })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const team = await CommunityRepository.createTeam({
      name: body.name,
      description: body.description,
      ownerId: user.id,
      isPublic: body.isPublic ?? true,
    })

    // Add creator as owner
    await CommunityRepository.addTeamMember(team.id, user.id, "owner")

    // Create activity
    await CommunityRepository.createActivity({
      userId: user.id,
      activityType: "team_created",
      targetType: "team",
      targetId: team.id,
      metadata: { name: team.name },
      isPublic: team.isPublic,
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
