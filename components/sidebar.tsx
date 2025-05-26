"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Plus,
  Home,
  Calendar,
  Users,
  FileText,
  Quote,
  Briefcase,
  FileIcon as FileInvoice,
  BarChart2,
  UserCheck,
  FileBarChart,
  DollarSign,
  Clock,
  Grid,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Create", icon: Plus, href: "/create" },
    { name: "Home", icon: Home, href: "/" },
    { name: "Schedule", icon: Calendar, href: "/schedule" },
    { name: "Clients", icon: Users, href: "/clients" },
    { name: "Requests", icon: FileText, href: "/requests" },
    { name: "Quotes", icon: Quote, href: "/quotes" },
    { name: "Jobs", icon: Briefcase, href: "/jobs" },
    { name: "Invoices", icon: FileInvoice, href: "/invoices" },
    { name: "Marketing", icon: BarChart2, href: "/marketing", divider: true },
    { name: "Leads", icon: UserCheck, href: "/leads" },
    { name: "Reports", icon: FileBarChart, href: "/reports" },
    { name: "Expenses", icon: DollarSign, href: "/expenses" },
    { name: "Timesheets", icon: Clock, href: "/timesheets" },
    { name: "Apps", icon: Grid, href: "/apps" },
  ]

  return (
    <aside className="w-[172px] bg-[#f5f5f5] border-r border-[#e5e5e5] flex flex-col">
      <div className="p-5">
        <div className="h-10 w-10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="#0A2942" strokeWidth="2" />
            <rect x="6" y="6" width="12" height="12" rx="3" stroke="#0A2942" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map((item, index) => (
          <div key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center h-12 px-5 text-[15px] font-medium",
                pathname === item.href ? "text-[#0a2942] bg-white border-l-4 border-[#0a2942]" : "text-[#5a6a77]",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
            {item.divider && <div className="mx-5 my-2 border-t border-[#e5e5e5]" />}
          </div>
        ))}
      </nav>

      <div className="p-4">
        <button className="flex items-center justify-center w-full">
          <ChevronLeft className="h-5 w-5 text-[#5a6a77]" />
        </button>
      </div>
    </aside>
  )
}
