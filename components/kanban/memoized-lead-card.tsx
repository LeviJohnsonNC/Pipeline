"use client"

import React from "react"
import { LeadCard } from "../lead-card"
import type { Lead } from "@/types/kanban"

interface MemoizedLeadCardProps {
  lead: Lead
  dragHandleProps?: any
  isDragging?: boolean
}

// Memoize the lead card to prevent unnecessary re-renders
export const MemoizedLeadCard = React.memo(
  function MemoizedLeadCard({ lead, dragHandleProps, isDragging }: MemoizedLeadCardProps) {
    return <LeadCard lead={lead} dragHandleProps={dragHandleProps} isDragging={isDragging} />
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return (
      prevProps.lead.id === nextProps.lead.id &&
      prevProps.lead.name === nextProps.lead.name &&
      prevProps.lead.service === nextProps.lead.service &&
      prevProps.lead.price === nextProps.lead.price &&
      prevProps.lead.assignedTo === nextProps.lead.assignedTo &&
      prevProps.lead.lastActivity === nextProps.lead.lastActivity &&
      prevProps.lead.days === nextProps.lead.days &&
      prevProps.lead.highlight === nextProps.lead.highlight &&
      prevProps.lead.activityStatus === nextProps.lead.activityStatus &&
      prevProps.isDragging === nextProps.isDragging &&
      JSON.stringify(prevProps.lead.tags) === JSON.stringify(nextProps.lead.tags)
    )
  },
)
