"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { ActivityIndicator } from "./activity-indicator"
import { cn } from "@/lib/utils"

export function ListView() {
  const router = useRouter()
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Combine all leads from the kanban board into a single array
  const leads = [
    {
      id: 1,
      days: 0,
      name: "Tony Stark",
      service: "Garden clean up and leaf removal",
      price: "n/a",
      assignedTo: null,
      lastActivity: "Contacted through website today",
      tags: ["Existing client"],
      activityStatus: "none" as const,
      stage: "New Leads",
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
      activityStatus: "future" as const,
      stage: "New Leads",
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
      activityStatus: "none" as const,
      stage: "New Leads",
    },
    {
      id: 4,
      days: 4,
      name: "Pepper Potts",
      service: "Stone pathway",
      price: "n/a",
      assignedTo: "Alex",
      lastActivity: "Call logged 4 days ago",
      tags: [],
      activityStatus: "today" as const,
      stage: "Contacted",
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
      activityStatus: "overdue" as const,
      stage: "Contacted",
    },
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
      activityStatus: "future" as const,
      stage: "Quote sent",
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
      activityStatus: "none" as const,
      stage: "Quote sent",
    },
    {
      id: 8,
      days: 0,
      name: "Natasha Romanoff",
      service: "Leaf removal",
      price: "$3,100.00",
      assignedTo: "Natasha",
      lastActivity: "Quote signed 1 day ago",
      tags: [],
      activityStatus: "today" as const,
      stage: "Quote signed",
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
      activityStatus: "none" as const,
      stage: "Quote signed",
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
      activityStatus: "overdue" as const,
      stage: "Quote signed",
    },
    {
      id: 11,
      days: 4,
      name: "Shuri Udaku",
      service: "Lights installation",
      price: "$2,121.11",
      assignedTo: "Alex",
      lastActivity: "Job scheduled yesterday",
      tags: [],
      activityStatus: "future" as const,
      stage: "Job scheduled",
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
      activityStatus: "today" as const,
      stage: "Job scheduled",
    },
    {
      id: 13,
      days: 0,
      name: "T'Challa",
      service: "Complete garden redesign",
      price: "$8,500.00",
      assignedTo: "Natasha",
      lastActivity: "Project completed and paid",
      tags: [],
      activityStatus: "none" as const,
      stage: "Won leads",
    },
    {
      id: 14,
      days: 0,
      name: "Loki Laufeyson",
      service: "Fence installation",
      price: "$2,300.00",
      assignedTo: "Alex",
      lastActivity: "Customer went with competitor",
      tags: [],
      activityStatus: "none" as const,
      stage: "Leads lost",
    },
  ]

  // Sort leads based on current sort field and direction
  const sortedLeads = [...leads].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a]
    let bValue = b[sortField as keyof typeof b]

    // Handle special cases for sorting
    if (sortField === "price") {
      aValue = a.price === "n/a" ? "0" : a.price.replace(/[^0-9.]/g, "")
      bValue = b.price === "n/a" ? "0" : b.price.replace(/[^0-9.]/g, "")
      aValue = Number.parseFloat(aValue as string) || 0
      bValue = Number.parseFloat(bValue as string) || 0
    }

    if (aValue === bValue) return 0

    const result = aValue < bValue ? -1 : 1
    return sortDirection === "asc" ? result : -result
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const handleRowClick = (leadId: number) => {
    router.push(`/lead/${leadId}`)
  }

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e5e5e5]">
            <th className="px-4 py-3 text-left">
              <button
                className="flex items-center text-sm font-medium text-[#5a6a77]"
                onClick={() => handleSort("name")}
              >
                Name {getSortIcon("name")}
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                className="flex items-center text-sm font-medium text-[#5a6a77]"
                onClick={() => handleSort("service")}
              >
                Service {getSortIcon("service")}
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                className="flex items-center text-sm font-medium text-[#5a6a77]"
                onClick={() => handleSort("price")}
              >
                Price {getSortIcon("price")}
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                className="flex items-center text-sm font-medium text-[#5a6a77]"
                onClick={() => handleSort("assignedTo")}
              >
                Assigned To {getSortIcon("assignedTo")}
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                className="flex items-center text-sm font-medium text-[#5a6a77]"
                onClick={() => handleSort("stage")}
              >
                Stage {getSortIcon("stage")}
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                className="flex items-center text-sm font-medium text-[#5a6a77]"
                onClick={() => handleSort("days")}
              >
                Days {getSortIcon("days")}
              </button>
            </th>
            <th className="px-4 py-3 text-center">Activity</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-[#e5e5e5] hover:bg-[#f8f8f8] cursor-pointer"
              onClick={() => handleRowClick(lead.id)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="font-medium text-[#0a2942]">{lead.name}</span>
                  {lead.tags && lead.tags.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#fef9c3] text-[#854d0e] text-xs rounded">{lead.tags[0]}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-[#5a6a77]">{lead.service}</td>
              <td className="px-4 py-3 text-sm text-[#5a6a77]">{lead.price}</td>
              <td className="px-4 py-3">
                {lead.assignedTo ? (
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-[#e5e5e5] flex items-center justify-center text-xs text-[#5a6a77] mr-2">
                      {lead.assignedTo === "Alex" ? "A" : "N"}
                    </div>
                    <span className="text-sm text-[#5a6a77]">{lead.assignedTo}</span>
                  </div>
                ) : (
                  <button
                    className="flex items-center text-sm text-[#5a6a77]"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent row click when clicking the assign button
                    }}
                  >
                    <div className="h-6 w-6 rounded-full border border-dashed border-[#5a6a77] flex items-center justify-center mr-2">
                      <Plus className="h-3 w-3" />
                    </div>
                    Assign
                  </button>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    lead.stage === "Quote sent" ? "bg-[#fef2f2] text-[#b91c1c]" : "bg-[#f5f5f5] text-[#5a6a77]",
                  )}
                >
                  {lead.stage}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-[#5a6a77]">{lead.days}d</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <ActivityIndicator
                    leadId={lead.id}
                    initialStatus={lead.activityStatus}
                    className="pointer-events-auto"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
