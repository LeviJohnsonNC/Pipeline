"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { FilterBar } from "@/components/filter-bar"
import { KanbanBoard } from "@/components/kanban-board"
import { ListView } from "@/components/list-view"
import { Button } from "@/components/ui/button"
import { ManageStagesModal } from "@/components/manage-stages-modal"
import { LeadStagesModal } from "@/components/lead-stages-modal"
import { DragDiagnosticEnhanced } from "@/components/drag-diagnostic-enhanced"

export default function LeadsPage() {
  const [view, setView] = useState<"pipeline" | "list">("pipeline")
  const [isManageStagesModalOpen, setIsManageStagesModalOpen] = useState(false)
  const [isLeadStagesModalOpen, setIsLeadStagesModalOpen] = useState(false)
  const [allStages, setAllStages] = useState<{ id: string; title: string }[]>([
    { id: "new", title: "New Leads" },
    { id: "contacted", title: "Contacted" },
    { id: "quote-sent", title: "Quote sent" },
    { id: "quote-signed", title: "Quote signed" },
    { id: "job-scheduled", title: "Job scheduled" },
    { id: "won", title: "Won leads" },
    { id: "lost", title: "Leads lost" },
  ])
  const [visibleStageIds, setVisibleStageIds] = useState<string[]>([
    "new",
    "contacted",
    "quote-sent",
    "quote-signed",
    "job-scheduled",
  ])

  const handleSaveStages = (newStages: { id: string; title: string }[]) => {
    setAllStages(newStages)

    // Update visible stages to include only those that still exist
    setVisibleStageIds((prev) => prev.filter((id) => newStages.some((stage) => stage.id === id)))

    // Update the KanbanBoard component
    if (typeof window !== "undefined" && window.kanbanUpdateStages) {
      window.kanbanUpdateStages(newStages)
    }
  }

  const handleVisibilityChange = (newVisibleStageIds: string[]) => {
    setVisibleStageIds(newVisibleStageIds)
  }

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="px-6 py-5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[2.5rem] font-bold text-[#0a2942]">Leads</h1>
            <Button className="bg-[#166534] hover:bg-[#14532d]">New Lead</Button>
          </div>
          <StatsCards />
          <FilterBar
            view={view}
            onViewChange={setView}
            onManageStages={() => setIsManageStagesModalOpen(true)}
            visibleStageCount={visibleStageIds.length}
            onToggleStagesModal={() => setIsLeadStagesModalOpen(true)}
          />
          {view === "pipeline" ? <KanbanBoard stages={allStages} visibleStageIds={visibleStageIds} /> : <ListView />}
          <DragDiagnosticEnhanced />
        </div>
      </main>

      <ManageStagesModal
        isOpen={isManageStagesModalOpen}
        onClose={() => setIsManageStagesModalOpen(false)}
        stages={allStages}
        onSaveStages={handleSaveStages}
      />

      <LeadStagesModal
        isOpen={isLeadStagesModalOpen}
        onClose={() => setIsLeadStagesModalOpen(false)}
        stages={allStages}
        visibleStages={visibleStageIds}
        onVisibilityChange={handleVisibilityChange}
      />
    </div>
  )
}
