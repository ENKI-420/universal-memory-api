import { type NextRequest, NextResponse } from "next/server"
import { userRepository } from "@/lib/repositories/user-repository"
import { verifyPassword } from "@/lib/auth/password"
import { generateToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Validation error", message: "Email and password are required" },
        { status: 400 },
      )
    }

    // Find user by email
    const user = await userRepository.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication failed", message: "Invalid email or password" },
        { status: 401 },
      )
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Authentication failed", message: "Account is disabled" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Authentication failed", message: "Invalid email or password" },
        { status: 401 },
      )
    }

    // Update last login
    await userRepository.updateLastLogin(user.id)

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Return user data and token
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error", message: "Failed to authenticate" }, { status: 500 })
  }
}
