import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { userRepository } from "@/lib/repositories/user-repository"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const user = await userRepository.findById(session.userId)

      if (!user) {
        return NextResponse.json({ error: "Not found", message: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
          last_login_at: user.last_login_at,
        },
      })
    } catch (error) {
      console.error("[v0] Get user error:", error)
      return NextResponse.json({ error: "Internal server error", message: "Failed to fetch user" }, { status: 500 })
    }
  })
}
