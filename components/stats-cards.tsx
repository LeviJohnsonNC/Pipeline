import { HelpCircle } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total leads",
      value: "20",
      tooltip: "Total number of leads in your pipeline",
    },
    {
      title: "Open leads",
      value: "12",
      tooltip: "Number of leads that are still open",
    },
    {
      title: "Conversion rate",
      value: "30%",
      tooltip: "Percentage of leads that convert to customers",
    },
    {
      title: "Revenue from won leads",
      value: "$10,240.23",
      tooltip: "Total revenue generated from converted leads",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-[#e5e5e5] p-4">
          <div className="flex items-center mb-2">
            <h3 className="text-[#5a6a77] font-medium text-base">{stat.title}</h3>
            <button className="ml-1 text-[#5a6a77]">
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="text-[#0a2942] font-bold text-4xl">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}
