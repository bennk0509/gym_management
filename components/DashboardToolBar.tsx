"use client"
import { useState } from "react"

type Range = "today" | "week" | "month"

export default function DashboardToolbar({
  initialRange = "today",
  onRangeChange,
  lastUpdated,
  onRefresh,
}: {
  initialRange?: Range
  onRangeChange?: (r: Range) => void
  lastUpdated?: Date
  onRefresh?: () => void
}) {
  const [range, setRange] = useState<Range>(initialRange)
  const shown = lastUpdated ?? new Date()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const r = e.target.value as Range
    setRange(r)
    onRangeChange?.(r)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <label className="text-sm text-brand-600">
          Range:
          <select
            value={range}
            onChange={handleChange}
            className="ml-2 rounded-md border border-neutral-200 px-3 py-1.5 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </label>

        <button
          onClick={() => onRangeChange?.("today")}
          className="hidden sm:inline-flex rounded-md border px-3 py-1.5 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-brand-500">
        <span>Last updated: {shown.toLocaleTimeString()}</span>
        <button
          onClick={onRefresh}
          className="rounded-md border px-3 py-1.5"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
