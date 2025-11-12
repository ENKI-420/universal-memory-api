import { neon } from "@neondatabase/serverless"

// Initialize Neon client with connection pooling
export const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

// Database query helpers with error handling
export async function query<T = any>(queryText: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql(queryText, params)
    return result as T[]
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Transaction helper
export async function transaction<T>(callback: (sql: typeof query) => Promise<T>): Promise<T> {
  try {
    return await callback(query)
  } catch (error) {
    console.error("[v0] Transaction error:", error)
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
