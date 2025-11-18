"use client"
import {Session, CalendarProps} from "@/types/types"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
  isSameDay
} from "date-fns"
import { SessionBox } from "./EventCard"
import SessionHoverCard from "./SessionHoverCard"
import { useState } from "react"


export default function MonthlyCalendarView({ date, events = [],onEdit, onDelete, onMarkComplete}: CalendarProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // find first and last visible day in the grid
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  // build grid
  const dayCells: Date[] = []
  let current = gridStart
  while (current <= gridEnd) {
    dayCells.push(current)
    current = addDays(current, 1)
  }

  return (
    <div className="flex flex-col relative w-full h-screen rounded-xl shadow-lg bg-white overflow-scroll pr-6">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-neutral-200">
        {days.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1 w-full">
        {dayCells.map((day, idx) => {
          const dayEvents = events.filter((e) => isSameDay(e.start, day))

          return (
            <div
              key={idx}
              className={`border border-neutral-200 p-2 text-xs ${
                isSameMonth(day, monthStart)
                  ? "bg-white text-gray-700"
                  : "bg-neutral-50 text-neutral-400"
              }`}
            >
              {/* Date circle */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full mb-1
                  ${isSameDay(day, new Date()) ? "bg-brand-primary text-white" : ""}`}
              >
                {format(day, "d")}
              </div>

              {/* Events for this day */}
              {/* <div className="flex flex-col gap-1"> */}
                {dayEvents.map((e,idx,allEvents) => (
                  <SessionBox
                    key={e.id}
                    event={e}
                    allEvents={allEvents}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    SessionHoverCard={SessionHoverCard}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMarkComplete={onMarkComplete}
                    view="monthly"
                  />
                ))}
              {/* </div> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
