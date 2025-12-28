import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { sql } from "@/lib/db"
import { handleApiError } from "@/lib/errors/error-handler"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request)
    const targetUserId = params.id

    if (user.id === targetUserId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if already following
    const existing = await sql`
      SELECT id FROM user_follows 
      WHERE follower_id = ${user.id} AND following_id = ${targetUserId}
    `

    if (existing.length > 0) {
      // Unfollow
      await sql`
        DELETE FROM user_follows 
        WHERE follower_id = ${user.id} AND following_id = ${targetUserId}
      `
      await sql`UPDATE user_profiles SET followers_count = followers_count - 1 WHERE user_id = ${targetUserId}`
      await sql`UPDATE user_profiles SET following_count = following_count - 1 WHERE user_id = ${user.id}`

      return NextResponse.json({ following: false })
    } else {
      // Follow
      await sql`
        INSERT INTO user_follows (follower_id, following_id)
        VALUES (${user.id}, ${targetUserId})
      `
      await sql`UPDATE user_profiles SET followers_count = followers_count + 1 WHERE user_id = ${targetUserId}`
      await sql`UPDATE user_profiles SET following_count = following_count + 1 WHERE user_id = ${user.id}`

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    return handleApiError(error)
  }
}
