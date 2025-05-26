"use client"

import React, { createContext, useContext, useCallback, useEffect } from "react"
import { useKanbanState, type Lead, type Column } from "@/hooks/use-kanban-state"
import { LeadsService, INITIAL_COLUMNS } from "@/services/leads-service"

interface KanbanContextType {
  columns: Column[]
  allColumns: Column[]
  isLoading: boolean
  error: string | null
  moveLead: (leadId: string, fromColumnId: string, toColumnId: string, toIndex?: number) => Promise<void>
  reorderLeads: (columnId: string, fromIndex: number, toIndex: number) => void
  updateStages: (newStages: { id: string; title: string }[]) => void
  updateVisibleStages: (visibleIds: string[]) => void
  findLead: (leadId: string) => { lead: Lead; columnId: string; index: number } | null
  refreshData: () => Promise<void>
}

const KanbanContext = createContext<KanbanContextType | null>(null)

interface KanbanProviderProps {
  children: React.ReactNode
  stages?: { id: string; title: string }[]
  visibleStageIds?: string[]
}

export function KanbanProvider({ children, stages, visibleStageIds }: KanbanProviderProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const kanbanState = useKanbanState({
    initialColumns: INITIAL_COLUMNS,
    stages,
    visibleStageIds,
  })

  // Load initial data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await LeadsService.getLeads()
      kanbanState.updateColumns(() => data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }, [kanbanState])

  // Enhanced move lead with API integration
  const moveLead = useCallback(
    async (leadId: string, fromColumnId: string, toColumnId: string, toIndex?: number) => {
      try {
        // Optimistic update
        kanbanState.moveLead(leadId, fromColumnId, toColumnId, toIndex)

        // API call
        const numericId = Number.parseInt(leadId.replace("lead-", ""), 10)
        await LeadsService.moveLead(numericId, fromColumnId, toColumnId)
      } catch (err) {
        // Revert on error
        setError(err instanceof Error ? err.message : "Failed to move lead")
        // In a real app, you'd revert the optimistic update here
      }
    },
    [kanbanState],
  )

  // Load data on mount
  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Update stages when prop changes
  useEffect(() => {
    if (stages) {
      kanbanState.updateStages(stages)
    }
  }, [stages, kanbanState])

  const value: KanbanContextType = {
    columns: kanbanState.columns,
    allColumns: kanbanState.allColumns,
    isLoading,
    error,
    moveLead,
    reorderLeads: kanbanState.reorderLeads,
    updateStages: kanbanState.updateStages,
    updateVisibleStages: kanbanState.updateVisibleStages,
    findLead: kanbanState.findLead,
    refreshData,
  }

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
}

export function useKanban() {
  const context = useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider")
  }
  return context
}
