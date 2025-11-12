import { type NextRequest, NextResponse } from "next/server"
import { userRepository } from "@/lib/repositories/user-repository"
import { hashPassword, validatePassword } from "@/lib/auth/password"
import { generateToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Validation error", message: "Email and password are required" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Validation error", message: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Password does not meet requirements",
          errors: passwordValidation.errors,
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Conflict", message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const user = await userRepository.create({
      email,
      password_hash,
      full_name,
      role: "user",
    })

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Return user data and token
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error", message: "Failed to create user" }, { status: 500 })
  }
}
