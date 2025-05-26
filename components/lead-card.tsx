"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActivityIndicator } from "./activity-indicator"

interface LeadCardProps {
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
  dragHandleProps?: any
  isDragging?: boolean
}

export function LeadCard({ lead, dragHandleProps, isDragging }: LeadCardProps) {
  const router = useRouter()

  // Handle click to navigate to lead details
  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if:
    // 1. Not clicking the activity indicator
    // 2. Not in the middle of a drag operation
    // 3. Not clicking the assign button
    if (
      !(e.target as HTMLElement).closest(".activity-indicator") &&
      !(e.target as HTMLElement).closest(".assign-button") &&
      !document.body.classList.contains("dragging") &&
      !isDragging
    ) {
      router.push(`/lead/${lead.id}`)
    }
  }

  const handleAssignClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking the assign button
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white overflow-hidden cursor-grab hover:shadow-md transition-shadow w-full lead-card",
        lead.highlight || lead.days >= 4 ? "border-[#ef4444] border-2" : "border-[#e5e5e5]",
        isDragging ? "shadow-lg opacity-50" : "",
      )}
      onClick={handleClick}
      data-testid={`lead-card-${lead.id}`}
      data-lead-id={lead.id}
      {...dragHandleProps} // Apply drag handle props to the entire card
    >
      <div className="px-3 py-2 flex items-center justify-between border-b border-[#e5e5e5]">
        <div className="flex items-center">
          <div className="text-xs text-[#5a6a77]">{lead.days}d</div>
        </div>

        {/* Position tags to the left of the activity indicator */}
        <div className="flex items-center gap-2">
          {lead.tags && lead.tags.length > 0 && (
            <div className="px-2 py-0.5 bg-[#fef9c3] text-[#854d0e] text-xs rounded">{lead.tags[0]}</div>
          )}

          {/* Activity indicator with improved padding */}
          <ActivityIndicator
            leadId={lead.id}
            initialStatus={lead.activityStatus || "none"}
            className="ml-1 activity-indicator"
          />
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-medium text-[#0a2942] mb-1">{lead.name}</h4>
        <p className="text-sm text-[#5a6a77] mb-2">{lead.service}</p>
        <p className="text-sm text-[#5a6a77] mb-3">{lead.price}</p>

        {lead.assignedTo ? (
          <div className="flex items-center mb-3">
            <div className="h-6 w-6 rounded-full bg-[#e5e5e5] flex items-center justify-center text-xs text-[#5a6a77] mr-2">
              {lead.assignedTo === "Alex" ? "A" : "N"}
            </div>
            <span className="text-sm text-[#5a6a77]">{lead.assignedTo}</span>
          </div>
        ) : (
          <div className="flex items-center mb-3">
            <button className="flex items-center text-sm text-[#5a6a77] assign-button" onClick={handleAssignClick}>
              <div className="h-6 w-6 rounded-full border border-dashed border-[#5a6a77] flex items-center justify-center mr-2">
                <Plus className="h-3 w-3" />
              </div>
              To be assigned
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-[#e5e5e5]">
          <p className="text-xs text-[#5a6a77] mb-1">Last activity</p>
          <p className="text-xs text-[#5a6a77]">{lead.lastActivity}</p>
        </div>
      </div>
    </div>
  )
}
