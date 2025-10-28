import { useState } from "react"
import { SessionStatus } from "@/data/sessions"

type FilterBarProps = {
  selectedFilters: SessionStatus[] | "all"
  onChange: (filters: SessionStatus[] | "all") => void
}

export default function FilterBar({ selectedFilters, onChange }: FilterBarProps) {
  const toggleFilter = (status: SessionStatus) => {
    if (selectedFilters === "all") {
      onChange([status])
      return
    }
    if (selectedFilters.includes(status)) {
      const newFilters = selectedFilters.filter((f) => f !== status)
      onChange(newFilters.length > 0 ? newFilters : "all")
    } else {
      onChange([...selectedFilters, status])
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Filter</h3>
      <div className="flex flex-col p-4 gap-1">
        <label className="flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters !== "all" && selectedFilters.includes("new")}
            onChange={() => toggleFilter("new")}
          />
          <span className="text-xs px-2 py-1 rounded capitalize bg-warning text-brand-primary">New</span>
        </label>
        <label className="flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters !== "all" && selectedFilters.includes("done")}
            onChange={() => toggleFilter("done")}
          />
          <span className="text-xs px-2 py-1 rounded capitalize bg-sucess text-brand-primary">Done</span>
        </label>
        <label className="flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters !== "all" && selectedFilters.includes("cancel")}
            onChange={() => toggleFilter("cancel")}
          />
          <span className="text-xs px-2 py-1 rounded capitalize bg-error text-brand-primary">Cancel</span>
        </label>
        <label className="flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters === "all"}
            onChange={() => onChange("all")}
          />
          <span className="text-xs px-2 py-1 rounded capitalize text-brand-primary">All</span>
        </label>
      </div>
    </div>
  )
}
