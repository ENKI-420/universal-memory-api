import { sql } from "@/lib/db"
import type { User } from "@/lib/types/database"

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const users = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`
    return users[0] || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`
    return users[0] || null
  }

  async create(data: {
    email: string
    password_hash: string
    full_name?: string
    role?: string
  }): Promise<User> {
    const users = await sql<User[]>`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES (${data.email}, ${data.password_hash}, ${data.full_name || null}, ${data.role || "user"})
      RETURNING *
    `
    return users[0]
  }

  async updateLastLogin(id: string): Promise<void> {
    await sql`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ${id}`
  }

  async list(filters?: { role?: string; is_active?: boolean }): Promise<User[]> {
    if (!filters) {
      return sql<User[]>`SELECT * FROM users ORDER BY created_at DESC`
    }

    if (filters.role && filters.is_active !== undefined) {
      return sql<User[]>`
        SELECT * FROM users 
        WHERE role = ${filters.role} AND is_active = ${filters.is_active}
        ORDER BY created_at DESC
      `
    }

    if (filters.role) {
      return sql<User[]>`
        SELECT * FROM users 
        WHERE role = ${filters.role}
        ORDER BY created_at DESC
      `
    }

    if (filters.is_active !== undefined) {
      return sql<User[]>`
        SELECT * FROM users 
        WHERE is_active = ${filters.is_active}
        ORDER BY created_at DESC
      `
    }

    return sql<User[]>`SELECT * FROM users ORDER BY created_at DESC`
  }
}

export const userRepository = new UserRepository()
