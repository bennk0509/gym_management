"use client"
import { Service } from "@/types/types"

interface TopServiceChartProps {
  topServices: (Service & { percent: number })[]
}

export default function TopServiceChart({ topServices }: TopServiceChartProps) {
  return (
    <div className="bg-white w-lg shadow-md rounded-xl p-4 flex flex-col gap-2">
      <h4 className="text-lg font-semibold mb-4">Top Services</h4>
      <ul className="space-y-6">
        {topServices.map((s, i) => (
          <li key={i} className="text-sm">
            <div className="flex justify-between mb-1">
              <h3 className="font-heading text-sm text-brand-800">{s.name}</h3>
              <span>{s.percent}%</span>
            </div>
            <div className="w-full bg-brand-primary/10 h-2 rounded-full">
              <div
                className="h-2 bg-accent-primary rounded-full"
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
