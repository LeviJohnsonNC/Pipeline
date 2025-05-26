"use client"

import { useState, useCallback, useMemo } from "react"

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
  activityStatus?: "none" | "today" | "overdue" | "future"
}

export interface Column {
  id: string
  title: string
  count: number
  leads: Lead[]
}

interface UseKanbanStateProps {
  initialColumns: Column[]
  stages?: { id: string; title: string }[]
  visibleStageIds?: string[]
}

interface UseKanbanStateReturn {
  columns: Column[]
  allColumns: Column[]
  updateColumns: (updater: (columns: Column[]) => Column[]) => void
  updateStages: (newStages: { id: string; title: string }[]) => void
  updateVisibleStages: (visibleIds: string[]) => void
  moveLead: (leadId: string, fromColumnId: string, toColumnId: string, toIndex?: number) => void
  reorderLeads: (columnId: string, fromIndex: number, toIndex: number) => void
  findLead: (leadId: string) => { lead: Lead; columnId: string; index: number } | null
}

export function useKanbanState({ initialColumns, stages, visibleStageIds }: UseKanbanStateProps): UseKanbanStateReturn {
  const [allColumns, setAllColumns] = useState<Column[]>(initialColumns)

  // Memoize visible columns to prevent unnecessary recalculations
  const columns = useMemo(() => {
    if (!visibleStageIds) return allColumns
    return allColumns.filter((column) => visibleStageIds.includes(column.id))
  }, [allColumns, visibleStageIds])

  // Update columns with automatic count recalculation
  const updateColumns = useCallback((updater: (columns: Column[]) => Column[]) => {
    setAllColumns((prev) => {
      const updated = updater(prev)
      // Automatically update counts
      return updated.map((column) => ({
        ...column,
        count: column.leads.length,
      }))
    })
  }, [])

  // Update stages while preserving existing leads
  const updateStages = useCallback((newStages: { id: string; title: string }[]) => {
    setAllColumns((prev) => {
      const columnMap = prev.reduce(
        (acc, column) => {
          acc[column.id] = column
          return acc
        },
        {} as Record<string, Column>,
      )

      return newStages.map((stage) => {
        if (columnMap[stage.id]) {
          return {
            ...columnMap[stage.id],
            title: stage.title,
          }
        }
        return {
          id: stage.id,
          title: stage.title,
          count: 0,
          leads: [],
        }
      })
    })
  }, [])

  // Update visible stages
  const updateVisibleStages = useCallback((visibleIds: string[]) => {
    // This is handled by the memoized columns calculation
    // No direct state update needed
  }, [])

  // Move lead between columns
  const moveLead = useCallback(
    (leadId: string, fromColumnId: string, toColumnId: string, toIndex?: number) => {
      updateColumns((prev) => {
        const newColumns = [...prev]

        const sourceColIndex = newColumns.findIndex((col) => col.id === fromColumnId)
        const destColIndex = newColumns.findIndex((col) => col.id === toColumnId)

        if (sourceColIndex === -1 || destColIndex === -1) return prev

        const sourceLeads = [...newColumns[sourceColIndex].leads]
        const destLeads = [...newColumns[destColIndex].leads]

        const leadIndex = sourceLeads.findIndex((lead) => `lead-${lead.id}` === leadId)
        if (leadIndex === -1) return prev

        const [movedLead] = sourceLeads.splice(leadIndex, 1)

        // Update lead metadata
        const updatedLead = {
          ...movedLead,
          days: 0,
          lastActivity: `Moved to ${newColumns[destColIndex].title} on ${new Date().toLocaleDateString()}`,
        }

        if (toIndex !== undefined) {
          destLeads.splice(toIndex, 0, updatedLead)
        } else {
          destLeads.push(updatedLead)
        }

        newColumns[sourceColIndex] = {
          ...newColumns[sourceColIndex],
          leads: sourceLeads,
        }

        newColumns[destColIndex] = {
          ...newColumns[destColIndex],
          leads: destLeads,
        }

        return newColumns
      })
    },
    [updateColumns],
  )

  // Reorder leads within a column
  const reorderLeads = useCallback(
    (columnId: string, fromIndex: number, toIndex: number) => {
      updateColumns((prev) => {
        const newColumns = [...prev]
        const colIndex = newColumns.findIndex((col) => col.id === columnId)

        if (colIndex === -1) return prev

        const leads = [...newColumns[colIndex].leads]
        const [movedLead] = leads.splice(fromIndex, 1)
        leads.splice(toIndex, 0, movedLead)

        newColumns[colIndex] = {
          ...newColumns[colIndex],
          leads,
        }

        return newColumns
      })
    },
    [updateColumns],
  )

  // Find lead by ID
  const findLead = useCallback(
    (leadId: string): { lead: Lead; columnId: string; index: number } | null => {
      const numericId = Number.parseInt(leadId.replace("lead-", ""), 10)

      if (isNaN(numericId)) {
        console.error("Invalid lead ID format:", leadId)
        return null
      }

      for (const column of columns) {
        const index = column.leads.findIndex((lead) => lead.id === numericId)
        if (index !== -1) {
          return { lead: column.leads[index], columnId: column.id, index }
        }
      }

      return null
    },
    [columns],
  )

  return {
    columns,
    allColumns,
    updateColumns,
    updateStages,
    updateVisibleStages,
    moveLead,
    reorderLeads,
    findLead,
  }
}
