import { neon } from "@neondatabase/serverless"
import type { Paper, Team, Discussion, UserProfile, Activity, Notification } from "@/lib/types/community"

const sql = neon(process.env.NEON_DATABASE_URL!)

export class CommunityRepository {
  // Papers
  static async createPaper(data: Partial<Paper>): Promise<Paper> {
    const [paper] = await sql`
      INSERT INTO papers (user_id, title, abstract, content, category, tags, status, organism_id)
      VALUES (${data.userId}, ${data.title}, ${data.abstract}, ${data.content}, 
              ${data.category}, ${data.tags}, ${data.status || "draft"}, ${data.organismId || null})
      RETURNING *
    `
    return paper as Paper
  }

  static async getPapers(filters: {
    status?: string
    category?: string
    userId?: string
    limit?: number
    offset?: number
  }): Promise<Paper[]> {
    const { status, category, userId, limit = 20, offset = 0 } = filters

    let query = `SELECT * FROM papers WHERE 1=1`
    const params: any[] = []

    if (status) query += ` AND status = $${params.length + 1}` && params.push(status)
    if (category) query += ` AND category = $${params.length + 1}` && params.push(category)
    if (userId) query += ` AND user_id = $${params.length + 1}` && params.push(userId)

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    return (await sql(query, params)) as Paper[]
  }

  static async getPaperById(id: string): Promise<Paper | null> {
    const [paper] = await sql`SELECT * FROM papers WHERE id = ${id}`
    return (paper as Paper) || null
  }

  static async updatePaper(id: string, data: Partial<Paper>): Promise<Paper> {
    const [paper] = await sql`
      UPDATE papers 
      SET title = COALESCE(${data.title}, title),
          abstract = COALESCE(${data.abstract}, abstract),
          content = COALESCE(${data.content}, content),
          status = COALESCE(${data.status}, status),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return paper as Paper
  }

  static async incrementPaperViews(id: string): Promise<void> {
    await sql`UPDATE papers SET views_count = views_count + 1 WHERE id = ${id}`
  }

  // Teams
  static async createTeam(data: Partial<Team>): Promise<Team> {
    const [team] = await sql`
      INSERT INTO teams (name, description, owner_id, is_public)
      VALUES (${data.name}, ${data.description}, ${data.ownerId}, ${data.isPublic ?? true})
      RETURNING *
    `
    return team as Team
  }

  static async getTeams(isPublic?: boolean): Promise<Team[]> {
    if (isPublic !== undefined) {
      return (await sql`SELECT * FROM teams WHERE is_public = ${isPublic} ORDER BY created_at DESC`) as Team[]
    }
    return (await sql`SELECT * FROM teams ORDER BY created_at DESC`) as Team[]
  }

  static async getTeamById(id: string): Promise<Team | null> {
    const [team] = await sql`SELECT * FROM teams WHERE id = ${id}`
    return (team as Team) || null
  }

  static async addTeamMember(teamId: string, userId: string, role = "member"): Promise<void> {
    await sql`
      INSERT INTO team_members (team_id, user_id, role)
      VALUES (${teamId}, ${userId}, ${role})
      ON CONFLICT (team_id, user_id) DO NOTHING
    `
    await sql`UPDATE teams SET member_count = member_count + 1 WHERE id = ${teamId}`
  }

  // Discussions
  static async createDiscussion(data: Partial<Discussion>): Promise<Discussion> {
    const [discussion] = await sql`
      INSERT INTO discussions (user_id, title, content, category, tags, paper_id, organism_id, job_id)
      VALUES (${data.userId}, ${data.title}, ${data.content}, ${data.category}, 
              ${data.tags || []}, ${data.paperId || null}, ${data.organismId || null}, ${data.jobId || null})
      RETURNING *
    `
    return discussion as Discussion
  }

  static async getDiscussions(filters: {
    category?: string
    limit?: number
    offset?: number
  }): Promise<Discussion[]> {
    const { category, limit = 20, offset = 0 } = filters

    if (category) {
      return (await sql`
        SELECT * FROM discussions 
        WHERE category = ${category}
        ORDER BY is_pinned DESC, created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `) as Discussion[]
    }

    return (await sql`
      SELECT * FROM discussions 
      ORDER BY is_pinned DESC, created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `) as Discussion[]
  }

  static async getDiscussionById(id: string): Promise<Discussion | null> {
    const [discussion] = await sql`SELECT * FROM discussions WHERE id = ${id}`
    if (discussion) {
      await sql`UPDATE discussions SET views_count = views_count + 1 WHERE id = ${id}`
    }
    return (discussion as Discussion) || null
  }

  // User Profiles
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const [profile] = await sql`SELECT * FROM user_profiles WHERE user_id = ${userId}`
    return (profile as UserProfile) || null
  }

  static async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const [profile] = await sql`
      UPDATE user_profiles
      SET bio = COALESCE(${data.bio}, bio),
          affiliation = COALESCE(${data.affiliation}, affiliation),
          website = COALESCE(${data.website}, website),
          research_interests = COALESCE(${data.researchInterests}, research_interests),
          updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `
    return profile as UserProfile
  }

  // Activities
  static async createActivity(data: Partial<Activity>): Promise<Activity> {
    const [activity] = await sql`
      INSERT INTO activities (user_id, activity_type, target_type, target_id, metadata, is_public)
      VALUES (${data.userId}, ${data.activityType}, ${data.targetType}, ${data.targetId}, 
              ${JSON.stringify(data.metadata || {})}, ${data.isPublic ?? true})
      RETURNING *
    `
    return activity as Activity
  }

  static async getActivityFeed(userId?: string, limit = 50): Promise<Activity[]> {
    if (userId) {
      // Get activities from followed users
      return (await sql`
        SELECT a.* FROM activities a
        INNER JOIN user_follows uf ON a.user_id = uf.following_id
        WHERE uf.follower_id = ${userId} AND a.is_public = true
        ORDER BY a.created_at DESC
        LIMIT ${limit}
      `) as Activity[]
    }

    // Public feed
    return (await sql`
      SELECT * FROM activities 
      WHERE is_public = true 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `) as Activity[]
  }

  // Notifications
  static async createNotification(data: Partial<Notification>): Promise<Notification> {
    const [notification] = await sql`
      INSERT INTO notifications (user_id, from_user_id, type, title, message, link)
      VALUES (${data.userId}, ${data.fromUserId || null}, ${data.type}, 
              ${data.title}, ${data.message || null}, ${data.link || null})
      RETURNING *
    `
    return notification as Notification
  }

  static async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    return (await sql`
      SELECT * FROM notifications 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as Notification[]
  }

  static async markNotificationAsRead(id: string): Promise<void> {
    await sql`UPDATE notifications SET is_read = true WHERE id = ${id}`
  }

  static async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await sql`
      SELECT COUNT(*) as count FROM notifications 
      WHERE user_id = ${userId} AND is_read = false
    `
    return Number(result.count)
  }

  // Social Interactions
  static async toggleLike(userId: string, targetType: string, targetId: string): Promise<boolean> {
    const [existing] = await sql`
      SELECT id FROM likes 
      WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
    `

    if (existing) {
      await sql`
        DELETE FROM likes 
        WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
      `
      return false // unliked
    } else {
      await sql`
        INSERT INTO likes (user_id, target_type, target_id)
        VALUES (${userId}, ${targetType}, ${targetId})
      `
      return true // liked
    }
  }

  static async getLikeCount(targetType: string, targetId: string): Promise<number> {
    const [result] = await sql`
      SELECT COUNT(*) as count FROM likes 
      WHERE target_type = ${targetType} AND target_id = ${targetId}
    `
    return Number(result.count)
  }
}
