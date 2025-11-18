import { useEffect, useState } from "react"
import {isSameDay } from "date-fns"
import {CalendarProps } from "@/types/types"
import SessionHoverCard from "./SessionHoverCard"
import { SessionBox } from "./EventCard"

export default function DailyCalendarView({ date, events = [],onEdit,onDelete, onMarkComplete }: CalendarProps) {
    const startHour = 0
    const endHour = 23
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)
    const [now, setNow] = useState(new Date());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const rowHeight = 64
    const gap = 4
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60 * 1000)
      return () => clearInterval(timer)
    }, [])

    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const top = currentHour * rowHeight + (currentMinutes / 60) * rowHeight
    return (
      <div className="relative w-full rounded-xl shadow-lg bg-white h-full overflow-y-scroll pr-6 overflow-x-visible">
        <div className="flex ">
          {/* Time Column */}
          <div className="w-15 border-r border-neutral-200 text-right pr-2 text-xs text-gray-500">
            {/* Hours */}
            {hours.map((h) => (
              <div key={h} className="h-16 flex items-start justify-end">
                {h % 12 === 0 ? 12 : h % 12} {h < 12 ? "AM" : "PM"}
              </div>
            ))}
          </div>
          {/* Grid Column */}
          <div className="flex-1 relative">
            <div
              className="absolute left-0 right-0 border-t-2 border-red-500 z-50"
              style={{ top: `${top}px` }}
            />
            {/* Hour grid */}
            {hours.map((h) => (
              <div key={h} className="h-16 border-b border-neutral-200"></div>
            ))}
            {events
            .filter((e) => isSameDay(e.start, date))
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .map((e, idx, allEvents) => (
                <SessionBox
                  key={e.id}
                  event={e}
                  allEvents={allEvents}
                  rowHeight={rowHeight}
                  gap={gap}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  SessionHoverCard={SessionHoverCard}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  view="daily"
                  onMarkComplete={onMarkComplete}
                />

            ))}
          </div>
        </div>
      </div>
    )
  }