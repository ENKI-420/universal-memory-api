import { cookies } from "next/headers"
import { verifyToken, type JWTPayload } from "./jwt"

const SESSION_COOKIE_NAME = "pcr_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  return session
}

/**
 * Require specific role - throws if not authorized
 */
export async function requireRole(allowedRoles: string[]): Promise<JWTPayload> {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.role)) {
    throw new Error("Forbidden")
  }

  return session
}
