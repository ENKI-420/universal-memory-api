import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { handleApiError } from "@/lib/errors/error-handler"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const searchPattern = `%${query}%`
    const results: any = {}

    // Search papers
    if (type === "all" || type === "papers") {
      results.papers = await sql`
        SELECT id, title, abstract, category, created_at, views_count
        FROM papers
        WHERE status = 'published' 
          AND (title ILIKE ${searchPattern} OR abstract ILIKE ${searchPattern})
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    }

    // Search organisms
    if (type === "all" || type === "organisms") {
      results.organisms = await sql`
        SELECT id, name, description, phi, w2_fidelity, created_at
        FROM organisms
        WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    }

    // Search discussions
    if (type === "all" || type === "discussions") {
      results.discussions = await sql`
        SELECT id, title, content, category, created_at, views_count
        FROM discussions
        WHERE title ILIKE ${searchPattern} OR content ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    }

    // Search users
    if (type === "all" || type === "users") {
      results.users = await sql`
        SELECT u.id, u.email, u.full_name, up.affiliation, up.research_interests
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.full_name ILIKE ${searchPattern} 
          OR u.email ILIKE ${searchPattern}
          OR up.affiliation ILIKE ${searchPattern}
        LIMIT ${limit}
      `
    }

    return NextResponse.json({ results })
  } catch (error) {
    return handleApiError(error)
  }
}
