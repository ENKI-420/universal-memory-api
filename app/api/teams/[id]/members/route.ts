import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { CommunityRepository } from "@/lib/repositories/community-repository"
import { handleApiError } from "@/lib/errors/error-handler"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const members = await sql`
      SELECT tm.*, u.email, u.name, up.avatar_url, up.affiliation
      FROM team_members tm
      INNER JOIN users u ON tm.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE tm.team_id = ${params.id}
      ORDER BY tm.joined_at ASC
    `

    return NextResponse.json({ members, count: members.length })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    const { userId, role = "member" } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Check if user is admin/owner
    const [membership] = await sql`
      SELECT role FROM team_members
      WHERE team_id = ${params.id} AND user_id = ${user.id}
    `

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return NextResponse.json({ error: "Only team admins can add members" }, { status: 403 })
    }

    await CommunityRepository.addTeamMember(params.id, userId, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
