"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Calendar, Circle, Clock, Phone, Mail, MessageSquare, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type ActivityStatus = "none" | "today" | "overdue" | "future"

interface ActivityIndicatorProps {
  leadId: number
  initialStatus?: ActivityStatus
  className?: string
}

export function ActivityIndicator({ leadId, initialStatus = "none", className }: ActivityIndicatorProps) {
  const [status, setStatus] = useState<ActivityStatus>(initialStatus)
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [activityType, setActivityType] = useState<string>("call")
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

  const getStatusIcon = () => {
    switch (status) {
      case "today":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "future":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "none":
      default:
        return <Circle className="h-4 w-4 text-gray-300" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "today":
        return "bg-amber-100 border-amber-200"
      case "overdue":
        return "bg-red-100 border-red-200"
      case "future":
        return "bg-blue-100 border-blue-200"
      case "none":
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    // Calculate position for the popup
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Position the popup above the button
      setPopupPosition({
        top: rect.top + scrollTop - 10,
        left: rect.left - 280 + rect.width,
      })
    }

    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSchedule = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!date) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)

    if (selectedDate.getTime() === today.getTime()) {
      setStatus("today")
    } else if (selectedDate < today) {
      setStatus("overdue")
    } else {
      setStatus("future")
    }

    setIsOpen(false)

    // In a real app, you would save this to your database
    console.log(`Scheduled ${activityType} for lead #${leadId} on ${format(date, "PPP")}`)
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Prevent popup from being dragged
  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      return true
    }

    document.addEventListener("dragstart", handleDragStart)
    return () => {
      document.removeEventListener("dragstart", handleDragStart)
    }
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "h-7 w-7 rounded-full border flex items-center justify-center activity-indicator",
          getStatusColor(),
          className,
        )}
        aria-label="Schedule activity"
      >
        {getStatusIcon()}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }}>
          <div
            ref={popupRef}
            className="activity-popup absolute bg-white rounded-lg shadow-lg w-80 p-4 border border-gray-200"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              pointerEvents: "auto",
              zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="font-medium text-[#0a2942]">Schedule Activity</h3>

              <div className="space-y-2">
                <Label className="block text-sm font-medium text-[#5a6a77]">Activity Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`call-${leadId}`}
                      name={`activityType-${leadId}`}
                      value="call"
                      checked={activityType === "call"}
                      onChange={() => setActivityType("call")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`call-${leadId}`} className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-[#5a6a77]" />
                      Call
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`email-${leadId}`}
                      name={`activityType-${leadId}`}
                      value="email"
                      checked={activityType === "email"}
                      onChange={() => setActivityType("email")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`email-${leadId}`} className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-[#5a6a77]" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`followup-${leadId}`}
                      name={`activityType-${leadId}`}
                      value="followup"
                      checked={activityType === "followup"}
                      onChange={() => setActivityType("followup")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`followup-${leadId}`} className="flex items-center text-sm">
                      <MessageSquare className="h-4 w-4 mr-2 text-[#5a6a77]" />
                      Follow-up
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block text-sm font-medium text-[#5a6a77]">Due Date</Label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md"
                  onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="bg-white border-[#e5e5e5] text-[#5a6a77] hover:bg-[#f5f5f5]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSchedule}
                  disabled={!date}
                  className="bg-[#166534] hover:bg-[#14532d] text-white"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
