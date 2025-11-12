import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromHeader } from "./jwt"

/**
 * Middleware to protect API routes
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: any) => Promise<Response>,
): Promise<Response> {
  const authHeader = request.headers.get("authorization")
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return NextResponse.json({ error: "Unauthorized", message: "Missing authentication token" }, { status: 401 })
  }

  const session = await verifyToken(token)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized", message: "Invalid or expired token" }, { status: 401 })
  }

  return handler(request, session)
}

/**
 * Middleware to require specific roles
 */
export async function withRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: (request: NextRequest, session: any) => Promise<Response>,
): Promise<Response> {
  return withAuth(request, async (req, session) => {
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden", message: "Insufficient permissions" }, { status: 403 })
    }

    return handler(req, session)
  })
}
