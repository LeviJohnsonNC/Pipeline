"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LeadStagesModalProps {
  isOpen: boolean
  onClose: () => void
  stages: { id: string; title: string }[]
  visibleStages: string[]
  onVisibilityChange: (visibleStageIds: string[]) => void
}

export function LeadStagesModal({ isOpen, onClose, stages, visibleStages, onVisibilityChange }: LeadStagesModalProps) {
  const [selectedStages, setSelectedStages] = useState<string[]>(visibleStages)

  // Reset selected stages when the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStages([...visibleStages])
    }
  }, [isOpen, visibleStages])

  if (!isOpen) return null

  const handleToggleStage = (stageId: string) => {
    setSelectedStages((prev) => {
      if (prev.includes(stageId)) {
        return prev.filter((id) => id !== stageId)
      } else {
        return [...prev, stageId]
      }
    })
  }

  const handleApply = () => {
    onVisibilityChange(selectedStages)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-medium text-[#0a2942]">Lead Stages</h2>
          <button onClick={onClose} className="text-[#5a6a77] hover:text-[#0a2942]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-[#5a6a77] mb-4">
            Select which lead stages you want to display in your pipeline view.
          </p>

          <div className="space-y-2 mb-6">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center p-2 hover:bg-[#f8f8f8] rounded-md cursor-pointer"
                onClick={() => handleToggleStage(stage.id)}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded flex items-center justify-center mr-3",
                    selectedStages.includes(stage.id) ? "bg-green-600 text-white" : "border border-[#d1d5db]",
                  )}
                >
                  {selectedStages.includes(stage.id) && <Check className="h-3 w-3" />}
                </div>
                <span className="text-[#0a2942]">{stage.title}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="outline" className="text-[#5a6a77] border-[#e5e5e5]">
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-[#166534] hover:bg-[#14532d]">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
