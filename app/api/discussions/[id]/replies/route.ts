import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { handleApiError } from "@/lib/errors/error-handler"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const replies = await sql`
      SELECT dr.*, u.email, u.name, up.avatar_url
      FROM discussion_replies dr
      INNER JOIN users u ON dr.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE dr.discussion_id = ${params.id}
      ORDER BY dr.created_at ASC
    `

    return NextResponse.json({ replies, count: replies.length })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    if (!body.content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 })
    }

    const [reply] = await sql`
      INSERT INTO discussion_replies (discussion_id, user_id, content, parent_reply_id)
      VALUES (${params.id}, ${user.id}, ${body.content}, ${body.parentReplyId || null})
      RETURNING *
    `

    // Update reply count
    await sql`
      UPDATE discussions
      SET replies_count = replies_count + 1
      WHERE id = ${params.id}
    `

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
