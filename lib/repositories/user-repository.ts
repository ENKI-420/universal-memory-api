import { query } from "@/lib/db"
import type { User } from "@/lib/types/database"

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const users = await query<User>("SELECT * FROM users WHERE id = $1", [id])
    return users[0] || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await query<User>("SELECT * FROM users WHERE email = $1", [email])
    return users[0] || null
  }

  async create(data: {
    email: string
    password_hash: string
    full_name?: string
    role?: string
  }): Promise<User> {
    const users = await query<User>(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.email, data.password_hash, data.full_name || null, data.role || "user"],
    )
    return users[0]
  }

  async updateLastLogin(id: string): Promise<void> {
    await query("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1", [id])
  }

  async list(filters?: { role?: string; is_active?: boolean }): Promise<User[]> {
    let queryText = "SELECT * FROM users WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (filters?.role) {
      queryText += ` AND role = $${paramIndex}`
      params.push(filters.role)
      paramIndex++
    }

    if (filters?.is_active !== undefined) {
      queryText += ` AND is_active = $${paramIndex}`
      params.push(filters.is_active)
      paramIndex++
    }

    queryText += " ORDER BY created_at DESC"

    return query<User>(queryText, params)
  }
}

export const userRepository = new UserRepository()
