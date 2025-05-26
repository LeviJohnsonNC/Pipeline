"use client"

import { Button } from "@/components/ui/button"

interface FilterBarProps {
  view: "pipeline" | "list"
  onViewChange: (view: "pipeline" | "list") => void
  onManageStages?: () => void
  visibleStageCount: number
  onToggleStagesModal: () => void
}

export function FilterBar({
  view,
  onViewChange,
  onManageStages,
  visibleStageCount,
  onToggleStagesModal,
}: FilterBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="flex rounded-full bg-[#e5e5e5] overflow-hidden">
          <button className="px-4 py-2 text-sm font-medium text-[#5a6a77]">Views</button>
          <button
            className="px-4 py-2 text-sm font-medium bg-[#d9d9d9] text-[#5a6a77]"
            onClick={() => onViewChange(view === "pipeline" ? "list" : "pipeline")}
          >
            {view === "pipeline" ? "Pipeline" : "List"}
          </button>
        </div>

        <div
          className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#e5e5e5] cursor-pointer hover:bg-[#d9d9d9]"
          onClick={onToggleStagesModal}
        >
          <span className="text-sm font-medium text-[#5a6a77]">Lead stages</span>
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#d9d9d9] text-xs font-medium text-[#5a6a77]">
            {visibleStageCount}
          </div>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#e5e5e5]">
          <span className="text-sm font-medium text-[#5a6a77]">Leads</span>
          <span className="px-2 py-0.5 rounded-full bg-[#d9d9d9] text-xs font-medium text-[#5a6a77]">Active</span>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#e5e5e5]">
          <span className="text-sm font-medium text-[#5a6a77]">Sort by</span>
          <span className="px-2 py-0.5 rounded-full bg-[#d9d9d9] text-xs font-medium text-[#5a6a77]">
            Days in stages
          </span>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#e5e5e5]">
          <span className="text-sm font-medium text-[#5a6a77]">Tags</span>
          <span className="px-2 py-0.5 rounded-full bg-[#d9d9d9] text-xs font-medium text-[#5a6a77]">Active</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="text-[#4d7c0f] border-[#4d7c0f] hover:bg-[#f0f9eb] hover:text-[#4d7c0f]"
        onClick={onManageStages}
      >
        Manage Stages
      </Button>
    </div>
  )
}
