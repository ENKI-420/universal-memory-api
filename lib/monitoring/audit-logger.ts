import { query } from "@/lib/db"

export interface AuditLogEntry {
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
}

/**
 * Audit logger for security and compliance
 */
export class AuditLogger {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await query(
        `INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id,
          ip_address, user_agent, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          entry.user_id || null,
          entry.action,
          entry.resource_type || null,
          entry.resource_id || null,
          entry.ip_address || null,
          entry.user_agent || null,
          entry.metadata ? JSON.stringify(entry.metadata) : null,
        ],
      )
    } catch (error) {
      console.error("[v0] Failed to write audit log:", error)
    }
  }

  async logUserAction(userId: string, action: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      user_id: userId,
      action,
      metadata,
    })
  }

  async logResourceAccess(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    })
  }

  async logSecurityEvent(
    action: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      action,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata,
    })
  }
}

// Singleton instance
export const auditLogger = new AuditLogger()
