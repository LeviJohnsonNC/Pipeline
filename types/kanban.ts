// Centralized type definitions
export interface Lead {
  id: number
  days: number
  name: string
  service: string
  price: string
  assignedTo: string | null
  lastActivity: string
  tags?: string[]
  highlight?: boolean
  activityStatus?: ActivityStatus
}

export type ActivityStatus = "none" | "today" | "overdue" | "future"

export interface Column {
  id: string
  title: string
  count: number
  leads: Lead[]
}

export interface Stage {
  id: string
  title: string
}

// Type guards
export function isLead(obj: unknown): obj is Lead {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Lead).id === "number" &&
    typeof (obj as Lead).name === "string" &&
    typeof (obj as Lead).service === "string"
  )
}

export function isValidLeadId(id: string): boolean {
  return id.startsWith("lead-") && !isNaN(Number.parseInt(id.replace("lead-", ""), 10))
}

export function parseLeadId(id: string): number | null {
  if (!isValidLeadId(id)) return null
  return Number.parseInt(id.replace("lead-", ""), 10)
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}
