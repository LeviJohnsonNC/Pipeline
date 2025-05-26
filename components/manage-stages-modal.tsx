"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, GripVertical, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Stage {
  id: string
  title: string
}

interface ManageStagesModalProps {
  isOpen: boolean
  onClose: () => void
  stages: Stage[]
  onSaveStages: (stages: Stage[]) => void
}

export function ManageStagesModal({ isOpen, onClose, stages, onSaveStages }: ManageStagesModalProps) {
  const [editableStages, setEditableStages] = useState<Stage[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")

  // Initialize editable stages when the modal opens
  useEffect(() => {
    if (isOpen) {
      setEditableStages([...stages])
      setShowWarning(false)
    }
  }, [isOpen, stages])

  if (!isOpen) return null

  const handleRenameStage = (index: number, newTitle: string) => {
    const updatedStages = [...editableStages]
    updatedStages[index] = { ...updatedStages[index], title: newTitle }
    setEditableStages(updatedStages)
  }

  const handleAddStage = () => {
    if (editableStages.length >= 8) {
      setWarningMessage("You can have a maximum of 8 stages.")
      setShowWarning(true)
      return
    }

    // Generate a unique ID
    const newId = `stage-${Date.now()}`
    setEditableStages([...editableStages, { id: newId, title: "New Stage" }])
  }

  const handleRemoveStage = (index: number) => {
    if (editableStages.length <= 2) {
      setWarningMessage("You need at least 2 stages in your pipeline.")
      setShowWarning(true)
      return
    }

    const updatedStages = [...editableStages]
    updatedStages.splice(index, 1)
    setEditableStages(updatedStages)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newStages = [...editableStages]
    const draggedStage = newStages[draggedIndex]

    // Remove the dragged item
    newStages.splice(draggedIndex, 1)
    // Insert it at the new position
    newStages.splice(index, 0, draggedStage)

    setEditableStages(newStages)
    setDraggedIndex(index)
  }

  const handleSave = () => {
    // Validate that all stages have names
    const emptyStageIndex = editableStages.findIndex((stage) => !stage.title.trim())
    if (emptyStageIndex !== -1) {
      setWarningMessage("All stages must have names.")
      setShowWarning(true)
      return
    }

    // Check for duplicate names
    const stageNames = editableStages.map((stage) => stage.title.trim())
    const hasDuplicates = stageNames.some((name, index) => stageNames.indexOf(name) !== index)
    if (hasDuplicates) {
      setWarningMessage("Stage names must be unique.")
      setShowWarning(true)
      return
    }

    onSaveStages(editableStages)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-semibold text-[#0a2942]">Manage Pipeline Stages</h2>
          <button onClick={onClose} className="text-[#5a6a77] hover:text-[#0a2942]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {showWarning && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{warningMessage}</p>
            </div>
          )}

          <p className="text-[#5a6a77] mb-4">
            Drag to reorder stages. Changes will affect how leads move through your pipeline.
          </p>

          <div className="space-y-2 mb-6">
            {editableStages.map((stage, index) => (
              <div
                key={stage.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                className={cn(
                  "flex items-center p-3 bg-[#f8f8f8] border border-[#e5e5e5] rounded-md",
                  draggedIndex === index ? "opacity-50" : "",
                )}
              >
                <div className="cursor-move mr-2 text-[#5a6a77]">
                  <GripVertical className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={stage.title}
                  onChange={(e) => handleRenameStage(index, e.target.value)}
                  className="flex-1 bg-white border border-[#e5e5e5] rounded-md px-3 py-2 text-[#0a2942]"
                  placeholder="Stage name"
                />
                <button
                  onClick={() => handleRemoveStage(index)}
                  className="ml-2 text-[#5a6a77] hover:text-red-500"
                  aria-label="Remove stage"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handleAddStage}
              variant="outline"
              className="flex items-center text-[#166534] border-[#166534]"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Stage
            </Button>

            <div className="space-x-2">
              <Button onClick={onClose} variant="outline" className="text-[#5a6a77]">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#166534] hover:bg-[#14532d]">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
