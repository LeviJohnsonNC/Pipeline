"use client"

import { useState, useEffect, useRef } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { LeadCard } from "@/components/lead-card"
import { SortableLeadCard } from "@/components/sortable-lead-card"
import { cn } from "@/lib/utils"

// Define types for better type safety
interface Lead {
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

interface KanbanBoardProps {
  stages?: { id: string; title: string }[]
  visibleStageIds?: string[]
  onStagesChange?: (stages: { id: string; title: string }[]) => void
}

export function KanbanBoard({ stages, visibleStageIds, onStagesChange }: KanbanBoardProps) {
  // Initial data for columns
  const initialColumnsRef = useRef([
    {
      id: "new",
      title: "New Leads",
      count: 3,
      leads: [
        {
          id: 1,
          days: 0,
          name: "Tony Stark",
          service: "Garden clean up and leaf removal",
          price: "n/a",
          assignedTo: null,
          lastActivity: "Contacted through website today",
          tags: ["Existing client"],
          activityStatus: "none",
        },
        {
          id: 2,
          days: 0,
          name: "Peter Parker",
          service: "Garden clean up and leaf removal",
          price: "n/a",
          assignedTo: null,
          lastActivity: "Lead manually created today",
          tags: [],
          activityStatus: "future",
        },
        {
          id: 3,
          days: 0,
          name: "Bruce Banner",
          service: "Pool Deck Redesign",
          price: "$1,400.20",
          assignedTo: null,
          lastActivity: "Requested through AI Receptionist today",
          tags: [],
          activityStatus: "none",
        },
      ],
    },
    {
      id: "contacted",
      title: "Contacted",
      count: 2,
      leads: [
        {
          id: 4,
          days: 4,
          name: "Pepper Potts",
          service: "Stone pathway",
          price: "n/a",
          assignedTo: "Alex",
          lastActivity: "Call logged 4 days ago",
          tags: [],
          activityStatus: "today",
        },
        {
          id: 5,
          days: 2,
          name: "Diana Prince",
          service: "Landscape design",
          price: "n/a",
          assignedTo: "Alex",
          lastActivity: "Email sent 2 days ago",
          tags: [],
          activityStatus: "overdue",
        },
      ],
    },
    {
      id: "quote-sent",
      title: "Quote sent",
      count: 2,
      leads: [
        {
          id: 6,
          days: 6,
          name: "Stephen Strange",
          service: "Fence installation",
          price: "$1029.30",
          assignedTo: "Natasha",
          lastActivity: "Quote sent 6 days ago",
          tags: [],
          highlight: true,
          activityStatus: "future",
        },
        {
          id: 7,
          days: 1,
          name: "Clark Kent",
          service: "Landscape design",
          price: "$4639.20",
          assignedTo: "Alex",
          lastActivity: "Quote sent 1 day ago",
          tags: [],
          activityStatus: "none",
        },
      ],
    },
    {
      id: "quote-signed",
      title: "Quote signed",
      count: 3,
      leads: [
        {
          id: 8,
          days: 0,
          name: "Natasha Romanoff",
          service: "Leaf removal",
          price: "$3,100.00",
          assignedTo: "Natasha",
          lastActivity: "Quote signed 1 day ago",
          tags: [],
          activityStatus: "today",
        },
        {
          id: 9,
          days: 0,
          name: "Wanda Maximoff",
          service: "Leaf removal",
          price: "$550.50",
          assignedTo: "Alex",
          lastActivity: "Quote signed today",
          tags: [],
          activityStatus: "none",
        },
        {
          id: 10,
          days: 0,
          name: "Matt Murdock",
          service: "Balcony design",
          price: "$2,489.71",
          assignedTo: "Natasha",
          lastActivity: "Quote signed today",
          tags: [],
          activityStatus: "overdue",
        },
      ],
    },
    {
      id: "job-scheduled",
      title: "Job scheduled",
      count: 2,
      leads: [
        {
          id: 11,
          days: 4,
          name: "Shuri Udaku",
          service: "Lights installation",
          price: "$2,121.11",
          assignedTo: "Alex",
          lastActivity: "Job scheduled yesterday",
          tags: [],
          activityStatus: "future",
        },
        {
          id: 12,
          days: 0,
          name: "Steve Rogers",
          service: "Landscape design",
          price: "$3,820.10",
          assignedTo: "Natasha",
          lastActivity: "On-site assessment scheduled today",
          tags: [],
          activityStatus: "today",
        },
      ],
    },
    {
      id: "won",
      title: "Won leads",
      count: 1,
      leads: [
        {
          id: 13,
          days: 0,
          name: "T'Challa",
          service: "Complete garden redesign",
          price: "$8,500.00",
          assignedTo: "Natasha",
          lastActivity: "Project completed and paid",
          tags: [],
          activityStatus: "none",
        },
      ],
    },
    {
      id: "lost",
      title: "Leads lost",
      count: 1,
      leads: [
        {
          id: 14,
          days: 0,
          name: "Loki Laufeyson",
          service: "Fence installation",
          price: "$2,300.00",
          assignedTo: "Alex",
          lastActivity: "Customer went with competitor",
          tags: [],
          activityStatus: "none",
        },
      ],
    },
  ])

  const [columns, setColumns] = useState<Column[]>(initialColumnsRef.current)
  const [allColumns, setAllColumns] = useState<Column[]>(initialColumnsRef.current)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)
  const [prevStagesRef, setPrevStagesRef] = useState<{ id: string; title: string }[] | undefined>(undefined)
  const [prevVisibleStageIdsRef, setPrevVisibleStageIdsRef] = useState<string[] | undefined>(undefined)

  // Configure sensors with better activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Slightly higher threshold for more reliable detection
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Slightly longer delay for touch
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Update columns when stages prop changes
  useEffect(() => {
    if (!stages || JSON.stringify(stages) === JSON.stringify(prevStagesRef)) {
      return
    }

    setPrevStagesRef(stages)

    // Create a map of existing columns by ID for easy lookup
    const columnMap = allColumns.reduce(
      (acc, column) => {
        acc[column.id] = column
        return acc
      },
      {} as Record<string, Column>,
    )

    // Create new columns array based on the new stages
    const updatedColumns = stages.map((stage) => {
      // If we have an existing column with this ID, keep its leads
      if (columnMap[stage.id]) {
        return {
          ...columnMap[stage.id],
          title: stage.title,
        }
      }

      // Otherwise, create a new empty column
      return {
        id: stage.id,
        title: stage.title,
        count: 0,
        leads: [],
      }
    })

    setAllColumns(updatedColumns)

    // Filter visible columns
    if (visibleStageIds) {
      const filteredColumns = updatedColumns.filter((col) => visibleStageIds.includes(col.id))
      setColumns(filteredColumns)
    } else {
      setColumns(updatedColumns)
    }
  }, [stages, allColumns])

  // Update visible columns when visibleStageIds changes
  useEffect(() => {
    if (!visibleStageIds || JSON.stringify(visibleStageIds) === JSON.stringify(prevVisibleStageIdsRef)) {
      return
    }

    setPrevVisibleStageIdsRef(visibleStageIds)

    // Filter columns based on visibility
    const filteredColumns = allColumns.filter((column) => visibleStageIds.includes(column.id))
    setColumns(filteredColumns)
  }, [visibleStageIds, allColumns])

  // Update column counts whenever leads change
  useEffect(() => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      count: column.leads.length,
    }))

    if (JSON.stringify(updatedColumns) !== JSON.stringify(columns)) {
      setColumns(updatedColumns)

      // Also update the all columns array
      setAllColumns((prev) => {
        const newAllColumns = [...prev]
        updatedColumns.forEach((updatedCol) => {
          const index = newAllColumns.findIndex((col) => col.id === updatedCol.id)
          if (index !== -1) {
            newAllColumns[index] = updatedCol
          }
        })
        return newAllColumns
      })
    }
  }, [columns])

  // Method to update stages (called from parent)
  const updateStages = (newStages: { id: string; title: string }[]) => {
    // Create a map of existing columns by ID for easy lookup
    const columnMap = allColumns.reduce(
      (acc, column) => {
        acc[column.id] = column
        return acc
      },
      {} as Record<string, Column>,
    )

    // Create new columns array based on the new stages
    const updatedColumns = newStages.map((stage) => {
      // If we have an existing column with this ID, keep its leads
      if (columnMap[stage.id]) {
        return {
          ...columnMap[stage.id],
          title: stage.title,
        }
      }

      // Otherwise, create a new empty column
      return {
        id: stage.id,
        title: stage.title,
        count: 0,
        leads: [],
      }
    })

    setAllColumns(updatedColumns)

    // Filter visible columns
    if (visibleStageIds) {
      const filteredColumns = updatedColumns.filter((col) => visibleStageIds.includes(col.id))
      setColumns(filteredColumns)
    } else {
      setColumns(updatedColumns)
    }
  }

  // Expose the updateStages method to parent components
  if (typeof window !== "undefined") {
    // @ts-ignore - This is a hack to expose the method to the parent component
    window.kanbanUpdateStages = updateStages
  }

  // Create a unique ID for each lead
  const getLeadId = (lead: Lead) => `lead-${lead.id}`

  // CRITICAL FIX: Improved findLead function to correctly parse IDs
  const findLead = (id: string): { lead: Lead; columnId: string; index: number } | null => {
    // Extract the numeric ID from the string (e.g., "lead-1" -> 1)
    const numericId = Number.parseInt(id.replace("lead-", ""), 10)

    if (isNaN(numericId)) {
      console.error("Invalid lead ID format:", id)
      return null
    }

    for (const column of columns) {
      const index = column.leads.findIndex((lead) => lead.id === numericId)
      if (index !== -1) {
        return { lead: column.leads[index], columnId: column.id, index }
      }
    }

    console.warn("Lead not found:", id)
    return null
  }

  // Handle drag start - CRITICAL FIX: Improved logging and error handling
  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag started:", event)
    const { active } = event
    const id = active.id as string

    setActiveId(id)

    if (id.startsWith("lead-")) {
      const result = findLead(id)
      if (result) {
        setActiveLead(result.lead)
        setActiveColumnId(result.columnId)
        console.log("Active lead set:", result.lead.name)
      } else {
        console.error("Could not find lead for ID:", id)
      }
    }

    document.body.classList.add("dragging")
  }

  // Handle drag over - CRITICAL FIX: Improved column detection
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    console.log("Drag over:", { activeId, overId })

    // Skip if not dragging a lead
    if (!activeId.startsWith("lead-")) return

    const activeResult = findLead(activeId)
    if (!activeResult) return

    // If over a lead, we need to move within or between columns
    if (overId.startsWith("lead-")) {
      const overResult = findLead(overId)
      if (!overResult) return

      // If leads are in different columns
      if (activeResult.columnId !== overResult.columnId) {
        setColumns((prev) => {
          const newColumns = [...prev]

          // Find the source and destination column indices
          const sourceColIndex = newColumns.findIndex((col) => col.id === activeResult.columnId)
          const destColIndex = newColumns.findIndex((col) => col.id === overResult.columnId)

          if (sourceColIndex === -1 || destColIndex === -1) return prev

          // Create copies of the leads arrays
          const sourceLeads = [...newColumns[sourceColIndex].leads]
          const destLeads = [...newColumns[destColIndex].leads]

          // Remove from source
          const [movedLead] = sourceLeads.splice(activeResult.index, 1)

          // Add to destination
          destLeads.splice(overResult.index, 0, movedLead)

          // Update the columns
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
      }
    }
    // CRITICAL FIX: Improved column detection logic
    else {
      // Check if we're over a column
      const columnId = overId
      const columnIndex = columns.findIndex((col) => col.id === columnId)

      if (columnIndex !== -1) {
        console.log("Over column:", columnId)

        setColumns((prev) => {
          const newColumns = [...prev]

          // Find the source column index
          const sourceColIndex = newColumns.findIndex((col) => col.id === activeResult.columnId)

          if (sourceColIndex === -1) return prev

          // Create copies of the leads arrays
          const sourceLeads = [...newColumns[sourceColIndex].leads]
          const destLeads = [...newColumns[columnIndex].leads]

          // Remove from source
          const [movedLead] = sourceLeads.splice(activeResult.index, 1)

          // Add to destination at the end
          destLeads.push(movedLead)

          // Update the columns
          newColumns[sourceColIndex] = {
            ...newColumns[sourceColIndex],
            leads: sourceLeads,
          }

          newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            leads: destLeads,
          }

          return newColumns
        })
      }
    }
  }

  // Handle drag end - CRITICAL FIX: Improved error handling and logging
  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag ended:", event)
    const { active, over } = event

    setActiveId(null)
    setActiveLead(null)
    setActiveColumnId(null)
    document.body.classList.remove("dragging")

    if (!over) {
      console.log("Dropped outside any droppable area")
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    console.log("Drag end:", { activeId, overId })

    // Skip if not dragging a lead
    if (!activeId.startsWith("lead-")) {
      console.log("Not dragging a lead")
      return
    }

    const activeResult = findLead(activeId)
    if (!activeResult) {
      console.error("Active lead not found")
      return
    }

    // If over a lead, we need to reorder within the column
    if (overId.startsWith("lead-")) {
      const overResult = findLead(overId)
      if (!overResult) {
        console.error("Over lead not found")
        return
      }

      // If in the same column, reorder
      if (activeResult.columnId === overResult.columnId) {
        console.log("Reordering within column:", activeResult.columnId)

        setColumns((prev) => {
          const newColumns = [...prev]
          const colIndex = newColumns.findIndex((col) => col.id === activeResult.columnId)

          if (colIndex === -1) return prev

          const leads = [...newColumns[colIndex].leads]
          const result = arrayMove(leads, activeResult.index, overResult.index)

          newColumns[colIndex] = {
            ...newColumns[colIndex],
            leads: result,
          }

          return newColumns
        })
      }
    }
    // CRITICAL FIX: Handle dropping directly on a column
    else {
      // Check if we're over a column
      const columnId = overId
      const columnIndex = columns.findIndex((col) => col.id === columnId)

      if (columnIndex !== -1 && columnId !== activeResult.columnId) {
        console.log("Dropped on column:", columnId)

        setColumns((prev) => {
          const newColumns = [...prev]

          // Find the source column index
          const sourceColIndex = newColumns.findIndex((col) => col.id === activeResult.columnId)

          if (sourceColIndex === -1) return prev

          // Create copies of the leads arrays
          const sourceLeads = [...newColumns[sourceColIndex].leads]
          const destLeads = [...newColumns[columnIndex].leads]

          // Remove from source
          const [movedLead] = sourceLeads.splice(activeResult.index, 1)

          // Update the lead with new information
          movedLead.days = 0
          movedLead.lastActivity = `Moved to ${newColumns[columnIndex].title} on ${new Date().toLocaleDateString()}`

          // Add to destination at the end
          destLeads.push(movedLead)

          // Update the columns
          newColumns[sourceColIndex] = {
            ...newColumns[sourceColIndex],
            leads: sourceLeads,
          }

          newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            leads: destLeads,
          }

          return newColumns
        })
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-[280px]">
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
                  <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#f5f5f5]">
                    <Plus className="h-4 w-4 text-[#5a6a77]" />
                  </button>
                  <button className="h-6 w-6 rounded flex items-center justify-center hover:bg-[#f5f5f5]">
                    <span className="text-[#5a6a77]">⋯</span>
                  </button>
                </div>
              </div>

              {/* CRITICAL FIX: Made column droppable by adding id */}
              <div
                id={column.id}
                data-column-id={column.id}
                className={cn(
                  "min-h-[200px] rounded-lg w-full",
                  activeColumnId === column.id ? "bg-[#f0f9eb]" : "bg-[#f8f8f8]",
                  "p-2 border-2 border-dashed",
                  activeColumnId === column.id ? "border-[#84cc16]" : "border-[#e5e5e5]",
                )}
              >
                <SortableContext
                  items={column.leads.map((lead) => getLeadId(lead))}
                  strategy={verticalListSortingStrategy}
                >
                  {column.leads.map((lead) => (
                    <SortableLeadCard
                      key={getLeadId(lead)}
                      id={getLeadId(lead)}
                      lead={lead}
                      className={column.leads.indexOf(lead) < column.leads.length - 1 ? "mb-4" : ""}
                    />
                  ))}
                  {column.leads.length === 0 && (
                    <div className="text-center py-8 text-[#5a6a77] text-sm">Drop leads here</div>
                  )}
                </SortableContext>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drag overlay - shows what's being dragged */}
      <DragOverlay>
        {activeId && activeLead && (
          <div className="opacity-80">
            <LeadCard lead={activeLead} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
