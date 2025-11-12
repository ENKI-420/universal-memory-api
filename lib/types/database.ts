// Database type definitions for Phase-Conjugate Consciousness Runtime

export type UserRole = "admin" | "researcher" | "user"

export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: Date
  updated_at: Date
  last_login_at: Date | null
}

export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  key_prefix: string
  name: string
  scopes: string[]
  rate_limit: number
  is_active: boolean
  expires_at: Date | null
  last_used_at: Date | null
  created_at: Date
}

export type JobType = "phase_conjugate" | "decoherence_test" | "lambda_phi_calibration" | "ricci_flow"
export type JobStatus = "pending" | "running" | "completed" | "failed" | "cancelled"

export interface Job {
  id: string
  user_id: string
  job_type: JobType
  status: JobStatus
  priority: number
  parameters: Record<string, any>
  backend: string
  backend_config: Record<string, any> | null
  lambda_phi_value: number
  lambda_phi_normalized: number
  result: Record<string, any> | null
  coherence_time: number | null
  fidelity: number | null
  purity: number | null
  entropy: number | null
  started_at: Date | null
  completed_at: Date | null
  duration_ms: number | null
  error_message: string | null
  retry_count: number
  created_at: Date
  updated_at: Date
}

export interface JobLog {
  id: string
  job_id: string
  level: "debug" | "info" | "warning" | "error"
  message: string
  metadata: Record<string, any> | null
  created_at: Date
}

export interface SystemMetric {
  id: string
  metric_type: string
  metric_name: string
  value: number
  unit: string | null
  tags: Record<string, any> | null
  timestamp: Date
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, any> | null
  created_at: Date
}

export interface LambdaPhiCalibration {
  id: string
  job_id: string | null
  measured_value: number
  theoretical_value: number
  deviation: number
  confidence_interval: number | null
  backend: string
  qubit_count: number | null
  gate_count: number | null
  measurement_data: Record<string, any> | null
  created_at: Date
}

// Request/Response types for API
export interface CreateJobRequest {
  job_type: JobType
  parameters: Record<string, any>
  backend?: string
  priority?: number
}

export interface JobResponse extends Job {
  user?: Pick<User, "id" | "email" | "full_name">
}

export interface SystemHealthResponse {
  status: "healthy" | "degraded" | "unhealthy"
  database: boolean
  redis: boolean
  lambda_phi: number
  uptime: number
  timestamp: Date
}
