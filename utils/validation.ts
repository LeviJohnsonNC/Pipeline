import type { Lead, Stage } from "@/types/kanban"

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export function validateLead(lead: Partial<Lead>): Lead {
  if (!lead.id || typeof lead.id !== "number") {
    throw new ValidationError("Lead ID is required and must be a number", "id")
  }

  if (!lead.name || typeof lead.name !== "string" || lead.name.trim().length === 0) {
    throw new ValidationError("Lead name is required", "name")
  }

  if (!lead.service || typeof lead.service !== "string" || lead.service.trim().length === 0) {
    throw new ValidationError("Service is required", "service")
  }

  return {
    id: lead.id,
    days: lead.days ?? 0,
    name: lead.name.trim(),
    service: lead.service.trim(),
    price: lead.price ?? "n/a",
    assignedTo: lead.assignedTo ?? null,
    lastActivity: lead.lastActivity ?? "No activity recorded",
    tags: lead.tags ?? [],
    highlight: lead.highlight ?? false,
    activityStatus: lead.activityStatus ?? "none",
  }
}

export function validateStage(stage: Partial<Stage>): Stage {
  if (!stage.id || typeof stage.id !== "string" || stage.id.trim().length === 0) {
    throw new ValidationError("Stage ID is required", "id")
  }

  if (!stage.title || typeof stage.title !== "string" || stage.title.trim().length === 0) {
    throw new ValidationError("Stage title is required", "title")
  }

  return {
    id: stage.id.trim(),
    title: stage.title.trim(),
  }
}
