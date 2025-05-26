import { cn } from "@/lib/utils"

interface LeadStageProgressProps {
  allStages: { id: string; title: string }[]
  visibleStageIds: string[]
  currentStageId: string
  className?: string
}

export function LeadStageProgress({ allStages, visibleStageIds, currentStageId, className }: LeadStageProgressProps) {
  // Filter stages to only show visible ones
  const visibleStages = allStages.filter((stage) => visibleStageIds.includes(stage.id))

  // Find the index of the current stage
  const currentStageIndex = visibleStages.findIndex((stage) => stage.id === currentStageId)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full">
        {visibleStages.map((stage, index) => {
          // Determine if this stage is active, completed, or upcoming
          const isActive = stage.id === currentStageId
          const isCompleted = index < currentStageIndex
          const isUpcoming = index > currentStageIndex

          return (
            <div key={stage.id} className="flex-1 relative">
              {/* Stage title */}
              <div
                className={cn(
                  "text-sm font-medium mb-2",
                  isActive ? "text-[#0a2942]" : isCompleted ? "text-[#4d7c0f]" : "text-[#5a6a77]",
                )}
              >
                {stage.title}
              </div>

              {/* Progress bar */}
              <div
                className={cn("h-1 w-full", isActive ? "bg-[#0a2942]" : isCompleted ? "bg-[#4d7c0f]" : "bg-[#e5e5e5]")}
              ></div>

              {/* Connector line (except for the last stage) */}
              {index < visibleStages.length - 1 && (
                <div
                  className={cn(
                    "absolute right-0 top-[calc(50%-1px)] h-1 w-4 -mr-2 z-10",
                    isCompleted ? "bg-[#4d7c0f]" : "bg-[#e5e5e5]",
                  )}
                ></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
