"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, ChevronDown } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { LeadStageProgress } from "@/components/lead-stage-progress"
import { cn } from "@/lib/utils"

// Mock data for the lead
const mockLeadData = {
  id: 1,
  name: "Tony Stark",
  phone: "250-555-4876",
  email: "tony@starkindustries.com",
  leadSource: "Website",
  companyName: "Stark Industries",
  address: "10880 Malibu Point, New York City, New York, 90265",
  currentStage: "new",
  activity: [
    {
      type: "request",
      message: "sent in a new request",
      link: "request",
      linkText: "request",
      from: "website",
      date: "Apr 05, 2025 3:02PM",
    },
  ],
}

export default function LeadDetailPage() {
  const router = useRouter()
  const params = useParams()
  const leadId = params.id
  const [lead, setLead] = useState(mockLeadData)
  const [activeTab, setActiveTab] = useState("activity")
  const [allStages, setAllStages] = useState([
    { id: "new", title: "New Leads" },
    { id: "contacted", title: "Contacted" },
    { id: "quote-sent", title: "Quote sent" },
    { id: "quote-signed", title: "Quote signed" },
    { id: "job-scheduled", title: "Job scheduled" },
    { id: "won", title: "Won leads" },
    { id: "lost", title: "Leads lost" },
  ])
  const [visibleStageIds, setVisibleStageIds] = useState([
    "new",
    "contacted",
    "quote-sent",
    "quote-signed",
    "job-scheduled",
  ])

  // In a real app, you would fetch the lead data based on the ID
  useEffect(() => {
    // Simulate fetching lead data
    console.log(`Fetching lead data for ID: ${leadId}`)
    // In a real app, you would make an API call here
  }, [leadId])

  const handleBackToLeads = () => {
    router.push("/")
  }

  const tabs = [
    { id: "activity", label: "Activity" },
    { id: "requests", label: "Requests" },
    { id: "quotes", label: "Quotes" },
    { id: "jobs", label: "Jobs" },
    { id: "schedule", label: "Schedule" },
    { id: "invoices", label: "Invoices" },
  ]

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="px-6 py-5">
          {/* Back button and actions */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToLeads}
              className="flex items-center text-[#4d7c0f] font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Leads
            </button>
            <div className="flex gap-2">
              <Button className="bg-[#166534] hover:bg-[#14532d] flex items-center gap-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Mark as Won
              </Button>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Mark as Lost
              </Button>
              <Button variant="outline" className="border-[#e5e5e5] text-[#5a6a77]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 12H12.01M12 6H12.01M12 18H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                More Actions
              </Button>
            </div>
          </div>

          {/* Lead name and badge */}
          <div className="flex items-center mb-6">
            <h1 className="text-[2rem] font-bold text-[#0a2942] mr-3">{lead.name}</h1>
            <span className="px-2 py-1 bg-[#e5e5e5] text-[#5a6a77] text-xs rounded-full">Lead</span>
          </div>

          {/* Lead stage progress */}
          <LeadStageProgress
            allStages={allStages}
            visibleStageIds={visibleStageIds}
            currentStageId={lead.currentStage}
            className="mb-6"
          />

          {/* Two-column layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left column - Consolidated lead details card */}
            <div className="col-span-1 space-y-6">
              {/* Consolidated card with all sections */}
              <div className="bg-white rounded-lg border border-[#e5e5e5]">
                {/* Overview section */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-[#0a2942]">Overview</h2>
                    <button className="text-[#4d7c0f] hover:bg-[#f0f9eb] p-1 rounded flex items-center">
                      <Edit className="h-4 w-4 mr-1" />
                      <span className="text-sm">Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 mb-4">
                    <div className="text-sm text-[#5a6a77]">Phone number</div>
                    <div className="text-sm text-[#0a2942]">{lead.phone}</div>

                    <div className="text-sm text-[#5a6a77]">Email</div>
                    <div className="text-sm text-[#4d7c0f]">{lead.email}</div>

                    <div className="text-sm text-[#5a6a77]">Lead Source</div>
                    <div className="text-sm text-[#0a2942]">{lead.leadSource}</div>

                    <div className="text-sm text-[#5a6a77]">Company name</div>
                    <div className="text-sm text-[#0a2942]">{lead.companyName}</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e5e5]"></div>

                {/* Properties section */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-[#0a2942]">Properties</h2>
                    <button className="text-[#4d7c0f] hover:bg-[#f0f9eb] p-1 rounded flex items-center">
                      <span className="text-sm">+ New property</span>
                    </button>
                  </div>
                  <p className="text-sm text-[#0a2942] mb-4">{lead.address}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e5e5]"></div>

                {/* Tags section */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-[#0a2942]">Tags</h2>
                    <button className="text-[#4d7c0f] hover:bg-[#f0f9eb] p-1 rounded flex items-center">
                      <span className="text-sm">+ New Tag</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7 8h10M7 12h4"
                          stroke="#5a6a77"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#0a2942]">No tags</p>
                      <p className="text-sm text-[#5a6a77]">No tags created for this lead yet</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e5e5]"></div>

                {/* Sales section */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-[#0a2942]">Sales</h2>
                    <button className="text-[#4d7c0f] hover:bg-[#f0f9eb] p-1 rounded flex items-center">
                      <span className="text-sm">+ Assign Sales</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                          stroke="#5a6a77"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#0a2942]">No sales</p>
                      <p className="text-sm text-[#5a6a77]">No sales assigned for this lead yet</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e5e5]"></div>

                {/* Billing history section */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-[#0a2942]">Billing history</h2>
                    <button className="text-[#4d7c0f] border border-[#e5e5e5] rounded px-3 py-1 flex items-center">
                      <span className="text-sm">New</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#5a6a77" strokeWidth="2" />
                        <path d="M2 10h20" stroke="#5a6a77" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#0a2942]">No billing history</p>
                      <p className="text-sm text-[#5a6a77]">This client hasn't been billed yet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal notes/files card */}
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-4">
                <h2 className="font-medium text-[#0a2942] mb-2">Internal notes</h2>
                <p className="text-sm text-[#5a6a77] mb-4">Internal notes will only be seen by your team</p>

                {/* Note input area */}
                <textarea
                  className="w-full border border-[#e5e5e5] rounded-lg p-3 mb-4 text-sm text-[#0a2942] resize-none"
                  placeholder="Note details"
                  rows={3}
                ></textarea>

                {/* File upload area */}
                <div className="border border-dashed border-[#e5e5e5] rounded-lg p-6 flex flex-col items-center justify-center">
                  <button className="mb-2 px-4 py-2 border border-[#e5e5e5] rounded-md text-[#4d7c0f] text-sm">
                    Select Files
                  </button>
                  <p className="text-sm text-[#5a6a77]">Select or drag files here to upload</p>
                </div>
              </div>
            </div>

            {/* Right column - Activity and tabs */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg border border-[#e5e5e5]">
                {/* Tabs */}
                <div className="flex border-b border-[#e5e5e5]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={cn(
                        "px-6 py-4 text-sm font-medium",
                        activeTab === tab.id
                          ? "text-[#0a2942] border-b-2 border-[#0a2942]"
                          : "text-[#5a6a77] hover:text-[#0a2942] hover:bg-[#f8f8f8]",
                      )}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-4">
                  {activeTab === "activity" && (
                    <div>
                      {/* Action buttons */}
                      <div className="flex gap-2 mb-6">
                        <Button variant="outline" className="border-[#e5e5e5] text-[#5a6a77] flex items-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2"
                          >
                            <path
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Send Email
                        </Button>
                        <Button variant="outline" className="border-[#e5e5e5] text-[#5a6a77] flex items-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2"
                          >
                            <path
                              d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Log Call
                        </Button>
                      </div>

                      {/* Activity timeline */}
                      <div className="border-l-2 border-[#e5e5e5] pl-6 ml-3 space-y-6">
                        {lead.activity.map((activity, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-red-100 border-2 border-white">
                              <span className="flex h-full w-full items-center justify-center">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-[#0a2942]">
                                <span className="font-medium">{lead.name}</span> {activity.message}{" "}
                                <a href="#" className="text-[#4d7c0f] hover:underline">
                                  {activity.linkText}
                                </a>{" "}
                                from {activity.from}
                              </p>
                              <p className="text-xs text-[#5a6a77] mt-1">{activity.date}</p>
                              <button className="text-xs text-[#5a6a77] mt-2 hover:text-[#0a2942]">+ Add Note</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "requests" && <div className="p-4">Requests content</div>}
                  {activeTab === "quotes" && <div className="p-4">Quotes content</div>}
                  {activeTab === "jobs" && <div className="p-4">Jobs content</div>}
                  {activeTab === "schedule" && <div className="p-4">Schedule content</div>}
                  {activeTab === "invoices" && <div className="p-4">Invoices content</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
