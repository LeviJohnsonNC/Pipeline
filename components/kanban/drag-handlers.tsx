"use client"

import { useState, useCallback } from "react"
import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core"
import { useKanban } from "@/contexts/kanban-context"
import type { Lead } from "@/hooks/use-kanban-state"

interface UseDragHandlersReturn {
  activeId: string | null
  activeLead: Lead | null
  activeColumnId: string | null
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
}

export function useDragHandlers(): UseDragHandlersReturn {
  const { findLead, moveLead, reorderLeads } = useKanban()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const id = active.id as string

      setActiveId(id)

      if (id.startsWith("lead-")) {
        const result = findLead(id)
        if (result) {
          setActiveLead(result.lead)
          setActiveColumnId(result.columnId)
        }
      }

      document.body.classList.add("dragging")
    },
    [findLead],
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event

      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      // Skip if not dragging a lead
      if (!activeId.startsWith("lead-")) return

      const activeResult = findLead(activeId)
      if (!activeResult) return

      // Handle dragging over another lead
      if (overId.startsWith("lead-")) {
        const overResult = findLead(overId)
        if (!overResult) return

        // If leads are in different columns, move between columns
        if (activeResult.columnId !== overResult.columnId) {
          moveLead(activeId, activeResult.columnId, overResult.columnId, overResult.index)
        }
      }
      // Handle dragging over a column
      else {
        const columnId = overId
        if (columnId !== activeResult.columnId) {
          moveLead(activeId, activeResult.columnId, columnId)
        }
      }
    },
    [findLead, moveLead],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setActiveId(null)
      setActiveLead(null)
      setActiveColumnId(null)
      document.body.classList.remove("dragging")

      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      // Skip if not dragging a lead
      if (!activeId.startsWith("lead-")) return

      const activeResult = findLead(activeId)
      if (!activeResult) return

      // Handle reordering within the same column
      if (overId.startsWith("lead-")) {
        const overResult = findLead(overId)
        if (!overResult) return

        if (activeResult.columnId === overResult.columnId) {
          reorderLeads(activeResult.columnId, activeResult.index, overResult.index)
        }
      }
      // Handle dropping on a column
      else {
        const columnId = overId
        if (columnId !== activeResult.columnId) {
          moveLead(activeId, activeResult.columnId, columnId)
        }
      }
    },
    [findLead, moveLead, reorderLeads],
  )

  return {
    activeId,
    activeLead,
    activeColumnId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
