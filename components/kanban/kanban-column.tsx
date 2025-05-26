"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { SortableLeadCard } from "./sortable-lead-card"
import { cn } from "@/lib/utils"
import type { Column } from "@/hooks/use-kanban-state"

interface KanbanColumnProps {
  column: Column
  isActive?: boolean
  onAddLead?: (columnId: string) => void
}

export function KanbanColumn({ column, isActive = false, onAddLead }: KanbanColumnProps) {
  const getLeadId = (leadId: number) => `lead-${leadId}`

  return (
    <div className="flex-shrink-0 w-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="font-medium text-[#0a2942]">{column.title}</h3>
          <div
            className={cn(
              "ml-2 flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium",
              column.id === "quote-sent" ? "bg-[#fef2f2] text-[#b91c1c]" : "bg-[#f5f5f5] text-[#5a6a77]",
            )}
          >
            {column.count}
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#f5f5f5]"
            onClick={() => onAddLead?.(column.id)}
            aria-label={`Add lead to ${column.title}`}
          >
            <Plus className="h-4 w-4 text-[#5a6a77]" />
          </button>
          <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#f5f5f5]">
            <span className="text-[#5a6a77]">⋯</span>
          </button>
        </div>
      </div>

      <div
        id={column.id}
        data-column-id={column.id}
        className={cn(
          "min-h-[200px] rounded-lg w-full p-2 border-2 border-dashed",
          isActive ? "bg-[#f0f9eb] border-[#84cc16]" : "bg-[#f8f8f8] border-[#e5e5e5]",
        )}
      >
        <SortableContext items={column.leads.map((lead) => getLeadId(lead.id))} strategy={verticalListSortingStrategy}>
          {column.leads.map((lead, index) => (
            <SortableLeadCard
              key={getLeadId(lead.id)}
              id={getLeadId(lead.id)}
              lead={lead}
              className={index < column.leads.length - 1 ? "mb-4" : ""}
            />
          ))}
          {column.leads.length === 0 && <div className="text-center py-8 text-[#5a6a77] text-sm">Drop leads here</div>}
        </SortableContext>
      </div>
    </div>
  )
}
