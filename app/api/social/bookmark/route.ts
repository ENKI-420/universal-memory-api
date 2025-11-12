import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { handleApiError } from "@/lib/errors/error-handler"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    const { targetType, targetId, notes } = body

    if (!targetType || !targetId) {
      return NextResponse.json({ error: "targetType and targetId are required" }, { status: 400 })
    }

    const [existing] = await sql`
      SELECT id FROM bookmarks
      WHERE user_id = ${user.id} AND target_type = ${targetType} AND target_id = ${targetId}
    `

    if (existing) {
      await sql`
        DELETE FROM bookmarks
        WHERE user_id = ${user.id} AND target_type = ${targetType} AND target_id = ${targetId}
      `
      return NextResponse.json({ bookmarked: false })
    } else {
      await sql`
        INSERT INTO bookmarks (user_id, target_type, target_id, notes)
        VALUES (${user.id}, ${targetType}, ${targetId}, ${notes || null})
      `
      return NextResponse.json({ bookmarked: true })
    }
  } catch (error) {
    return handleApiError(error)
  }
}
