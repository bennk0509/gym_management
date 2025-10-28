"use client"

import { endOfWeek, startOfWeek, subDays, subMonths, subWeeks, format, addDays, addWeeks, addMonths } from "date-fns";
import next from "next";
import { useMemo, useState } from "react";

type View =  "day" | "week" | "month";

export default function CalendarHeader(
  {initialDate = new Date(),
  initialView = "day",
  onChange}: {
  initialDate?: Date
  initialView?: View
  onChange?: (date: Date, view: View) => void
}) {
  const currentDate = initialDate
  const viewMode = initialView

  const label = useMemo(() => {
    if (viewMode === "day") {
      return format(currentDate, "EEEE, MMMM dd, yyyy")
    }
    if (viewMode === "week") {
      const ws = startOfWeek(currentDate, { weekStartsOn: 1 })
      const we = endOfWeek(currentDate, { weekStartsOn: 1 })
      const sameMonth = format(ws, "MMM") === format(we, "MMM")
      return sameMonth
        ? `${format(ws, "MMM d")}–${format(we, "d, yyyy")}`
        : `${format(ws, "MMM d")} – ${format(we, "MMM d, yyyy")}`
    }
    return format(currentDate, "MMMM yyyy") 
  }, [currentDate, viewMode])

  const goPrev = () => {
    const prev =
      viewMode === "day"
        ? subDays(currentDate, 1)
        : viewMode === "week"
        ? subWeeks(currentDate, 1)
        : subMonths(currentDate, 1)

    onChange?.(prev, viewMode)
  }

  const goToday = () => {
    const today = new Date()
    onChange?.(today, viewMode) 
  }

  const goNext = () => {
      const next =
      viewMode === "day"
        ? addDays(currentDate, 1)
        : viewMode === "week"
        ? addWeeks(currentDate, 1)
        : addMonths(currentDate, 1)
      
      onChange?.(next,viewMode)
      return next;
  }
  


  return (
    <div className="sticky top-0 z-20 w-full border-b border-neutral-100 bg-white/90 backdrop-blur p-4">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: label (placeholder text) */}
        <div className="font-heading text-lg md:text-xl text-brand-800">
          {label}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-3 font-heading">
          {/* Prev / Today / Next */}
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-light"
              aria-label="Previous"
              onClick={goPrev}
            >
              ‹
            </button>
            <button
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-light"
              onClick={goToday}
            >
              Today
            </button>
            <button
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm hover:bg-neutral-light"
              aria-label="Next"
              onClick={goNext}
            >
              ›
            </button>
          </div>

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-md border border-neutral-200">
            <button 
                className={"px-3 py-1.5 text-sm capitalize text-brand-700 " +
                  (viewMode === "day" ? "bg-accent-primary hover:bg-accent-800" : "bg-white hover:bg-neutral-light")
                }
                onClick={() => onChange?.(currentDate,"day")}    
            >
              Day
            </button>
            <button 
                className={"px-3 py-1.5 text-sm capitalize text-brand-700 " +
                  (viewMode === "week" ? "bg-accent-primary hover:bg-accent-800" : "bg-white hover:bg-neutral-light")
                }
                onClick={() => onChange?.(currentDate,"week")}    
            >
              Week
            </button>
            <button 
                className={"px-3 py-1.5 text-sm capitalize text-brand-700 " +
                  (viewMode === "month" ? "bg-accent-primary hover:bg-accent-800" : "bg-white hover:bg-neutral-light")
                }
                onClick={() => onChange?.(currentDate,"month")}    
            >
              Month
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}