import type { Lead, Column } from "@/hooks/use-kanban-state"

// Mock data - in a real app, this would come from an API
export const INITIAL_COLUMNS: Column[] = [
  {
    id: "new",
    title: "New Leads",
    count: 3,
    leads: [
      {
        id: 1,
        days: 0,
        name: "Tony Stark",
        service: "Garden clean up and leaf removal",
        price: "n/a",
        assignedTo: null,
        lastActivity: "Contacted through website today",
        tags: ["Existing client"],
        activityStatus: "none",
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
        activityStatus: "future",
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
        activityStatus: "none",
      },
    ],
  },
  {
    id: "contacted",
    title: "Contacted",
    count: 2,
    leads: [
      {
        id: 4,
        days: 4,
        name: "Pepper Potts",
        service: "Stone pathway",
        price: "n/a",
        assignedTo: "Alex",
        lastActivity: "Call logged 4 days ago",
        tags: [],
        activityStatus: "today",
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
        activityStatus: "overdue",
      },
    ],
  },
  {
    id: "quote-sent",
    title: "Quote sent",
    count: 2,
    leads: [
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
        activityStatus: "future",
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
        activityStatus: "none",
      },
    ],
  },
  {
    id: "quote-signed",
    title: "Quote signed",
    count: 3,
    leads: [
      {
        id: 8,
        days: 0,
        name: "Natasha Romanoff",
        service: "Leaf removal",
        price: "$3,100.00",
        assignedTo: "Natasha",
        lastActivity: "Quote signed 1 day ago",
        tags: [],
        activityStatus: "today",
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
        activityStatus: "none",
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
        activityStatus: "overdue",
      },
    ],
  },
  {
    id: "job-scheduled",
    title: "Job scheduled",
    count: 2,
    leads: [
      {
        id: 11,
        days: 4,
        name: "Shuri Udaku",
        service: "Lights installation",
        price: "$2,121.11",
        assignedTo: "Alex",
        lastActivity: "Job scheduled yesterday",
        tags: [],
        activityStatus: "future",
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
        activityStatus: "today",
      },
    ],
  },
  {
    id: "won",
    title: "Won leads",
    count: 1,
    leads: [
      {
        id: 13,
        days: 0,
        name: "T'Challa",
        service: "Complete garden redesign",
        price: "$8,500.00",
        assignedTo: "Natasha",
        lastActivity: "Project completed and paid",
        tags: [],
        activityStatus: "none",
      },
    ],
  },
  {
    id: "lost",
    title: "Leads lost",
    count: 1,
    leads: [
      {
        id: 14,
        days: 0,
        name: "Loki Laufeyson",
        service: "Fence installation",
        price: "$2,300.00",
        assignedTo: "Alex",
        lastActivity: "Customer went with competitor",
        tags: [],
        activityStatus: "none",
      },
    ],
  },
]

export class LeadsService {
  // In a real app, these would be API calls
  static async getLeads(): Promise<Column[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return INITIAL_COLUMNS
  }

  static async updateLead(leadId: number, updates: Partial<Lead>): Promise<Lead> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    // In a real app, this would update the lead in the database
    console.log(`Updating lead ${leadId}:`, updates)

    // Return updated lead (mock)
    return { ...updates } as Lead
  }

  static async moveLead(leadId: number, fromStage: string, toStage: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    console.log(`Moving lead ${leadId} from ${fromStage} to ${toStage}`)
  }
}
