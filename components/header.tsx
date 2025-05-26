"use client"

import { Search, Globe, MessageSquare, Sparkles, Bell, HelpCircle, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="h-[64px] border-b border-[#e5e5e5] flex items-center justify-between px-6 bg-white">
      <div className="text-[#5a6a77] font-medium">True Space Design</div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="flex items-center h-9 w-[240px] rounded-md bg-[#f5f5f5] px-3">
            <Search className="h-4 w-4 text-[#5a6a77] mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-sm flex-1 text-[#5a6a77]"
            />
            <div className="flex items-center justify-center h-5 w-5 rounded bg-[#e5e5e5] text-xs text-[#5a6a77]">
              /
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#5a6a77] hover:bg-[#f5f5f5]">
            <Globe className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#5a6a77] hover:bg-[#f5f5f5]">
            <MessageSquare className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#5a6a77] hover:bg-[#f5f5f5]">
            <Sparkles className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#5a6a77] hover:bg-[#f5f5f5]">
            <Bell className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#5a6a77] hover:bg-[#f5f5f5]">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#5a6a77] hover:bg-[#f5f5f5]">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
