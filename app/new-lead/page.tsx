"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createNewLead } from "../actions"

export default function NewLeadPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    await createNewLead(formData)
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      <main className="flex-1 p-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
            Back to Leads
          </Button>
          <h1 className="text-3xl font-bold text-[#0a2942]">New Lead</h1>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#5a6a77] mb-1">
                Client Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-[#5a6a77] mb-1">
                Service
              </label>
              <select
                id="service"
                name="service"
                required
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md"
              >
                <option value="">Select a service</option>
                <option value="Garden clean up">Garden clean up</option>
                <option value="Leaf removal">Leaf removal</option>
                <option value="Landscape design">Landscape design</option>
                <option value="Fence installation">Fence installation</option>
                <option value="Stone pathway">Stone pathway</option>
                <option value="Lights installation">Lights installation</option>
                <option value="Pool Deck Redesign">Pool Deck Redesign</option>
                <option value="Balcony design">Balcony design</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#5a6a77] mb-1">
                Estimated Price (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-[#5a6a77] sm:text-sm">$</span>
                </div>
                <input
                  id="price"
                  name="price"
                  type="text"
                  className="w-full pl-7 px-3 py-2 border border-[#e5e5e5] rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-[#5a6a77] mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-[#166534] hover:bg-[#14532d]">
                {isSubmitting ? "Creating..." : "Create Lead"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
