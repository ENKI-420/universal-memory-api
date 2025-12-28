import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function query<T = any>(queryText: string, params?: any[]): Promise<T[]> {
  try {
    // Note: This is for backward compatibility only
    // Neon now requires tagged template literals, so this will throw an error
    // Use sql`...` template literals instead
    throw new Error(
      "query() is deprecated. Use sql`...` tagged template literals instead. Example: sql`SELECT * FROM table WHERE id = ${id}`",
    )
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

// Health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("[v0] Database health check failed:", error)
    return false
  }
}
