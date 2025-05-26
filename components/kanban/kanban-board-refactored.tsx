"use client"

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  sortableKeyboardCoordinates,
} from "@dnd-kit/core"
import { KanbanColumn } from "./kanban-column"
import { LeadCard } from "../lead-card"
import { useDragHandlers } from "./drag-handlers"
import { useKanban } from "@/contexts/kanban-context"
import { ErrorBoundary } from "../error-boundary"
import { LoadingSpinner } from "../loading-spinner"

interface KanbanBoardRefactoredProps {
  onAddLead?: (columnId: string) => void
}

export function KanbanBoardRefactored({ onAddLead }: KanbanBoardRefactoredProps) {
  const { columns, isLoading, error } = useKanban()
  const { activeId, activeLead, activeColumnId, handleDragStart, handleDragOver, handleDragEnd } = useDragHandlers()

  // Configure sensors with very low thresholds for easy dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
        tolerance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading kanban board: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the kanban board.</div>}>
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
              <KanbanColumn
                key={column.id}
                column={column}
                isActive={activeColumnId === column.id}
                onAddLead={onAddLead}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId && activeLead && (
            <div className="opacity-80">
              <LeadCard lead={activeLead} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </ErrorBoundary>
  )
}
