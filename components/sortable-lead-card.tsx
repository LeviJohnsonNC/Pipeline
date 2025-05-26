"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LeadCard } from "./lead-card"
import { cn } from "@/lib/utils"

interface SortableLeadCardProps {
  id: string
  lead: {
    id: number
    days: number
    name: string
    service: string
    price: string
    assignedTo: string | null
    lastActivity: string
    tags?: string[]
    highlight?: boolean
    activityStatus?: "none" | "today" | "overdue" | "future"
  }
  className?: string
}

export function SortableLeadCard({ id, lead, className }: SortableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting, over, active } = useSortable(
    {
      id,
      data: {
        type: "lead",
        lead,
      },
    },
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  } as React.CSSProperties

  // Combine all drag-related props
  const dragHandleProps = {
    ...attributes,
    ...listeners,
    style: {
      ...style,
      cursor: isDragging ? "grabbing" : "grab",
    },
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(className, isDragging ? "z-50" : "")}
      data-testid={`sortable-lead-${lead.id}`}
      data-lead-id={lead.id}
    >
      <LeadCard lead={lead} dragHandleProps={dragHandleProps} isDragging={isDragging} />
    </div>
  )
}
