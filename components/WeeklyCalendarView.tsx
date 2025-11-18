import { useEffect, useState } from "react"
import { startOfWeek, addDays, format, isSameDay } from "date-fns"
import SessionHoverCard from "./SessionHoverCard"
import { Session, CalendarProps } from "@/types/types"
import { SessionBox } from "./EventCard"


export default function WeeklyCalendarView({ date, events = [],onEdit,onDelete, onMarkComplete}: CalendarProps) {
    const startHour = 0
    const endHour = 23
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)
    const [now, setNow] = useState(new Date());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const rowHeight = 64
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60 * 1000)
      return () => clearInterval(timer)
    }, [])
    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const gap = 4
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const top = currentHour * rowHeight + (currentMinutes / 60) * rowHeight
    function assignColumns(events: Session[]) {
      const sorted = [...events].sort((a, b) =>  new Date(a.start).getTime() - new Date(b.start).getTime());
      const columns: { [key: string]: number } = {};
      const clusterEndTimes: number[] = [];

      for (const e of sorted) {
        // Find the first column that’s free (no conflict)
        let col = 0;
        while (clusterEndTimes[col] && clusterEndTimes[col] > new Date(e.start).getTime()) {
          col++;
        }

        columns[e.id] = col;
        clusterEndTimes[col] = new Date(e.end).getTime();
      }

      const totalColumns = Math.max(...Object.values(columns)) + 1;
      return sorted.map(e => ({
        ...e,
        columnIndex: columns[e.id],
        columnCount: totalColumns
      }));
    }
    return (
      <div className="relative w-full rounded-xl shadow-lg bg-white h-screen overflow-scroll pr-6">
        {/* Header row: days */}
        <div className="flex border-b border-neutral-200">
          {/* Empty top-left corner (for time column) */}
          <div className="w-20"></div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className="flex-1 border-l border-neutral-200 text-center py-2 text-sm font-medium text-gray-600"
            >
              <div className="flex justify-center pb-1.5">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xl rounded-full font-bold
                    ${isSameDay(day, new Date()) ? "bg-accent-primary text-brand-primary" : "text-gray-700"}`}
                >
                  {format(day, "d")}
                </div>
              </div>

              <div>{format(day, "EEE")}</div> {/* Mon, Tue... */}
            </div>
          ))}
        </div>
        <div className="flex">
          {/* Time Column */}
          <div className="w-20 border-r border-neutral-200 text-right pr-2 text-xs text-gray-500">
            {hours.map((h) => (
              <div key={h} className="h-16 flex items-start justify-end">
                {h % 12 === 0 ? 12 : h % 12} {h < 12 ? "AM" : "PM"}
              </div>
            ))}
          </div>
          {/* Grid Columns for each day */}
          <div className="flex-1 grid grid-cols-7 relative">
            <div
              className="absolute left-0 right-0 border-t-2 border-red-500 z-50"
              style={{ top: `${top}px` }}
            />
            {weekDays.map((day) => (
            <div key={day.toString()} className="relative border-l border-neutral-200">
              {/* Hour rows */}
              {hours.map((h) => (
                <div
                  key={`${day}-${h}`}
                  className="h-16 border-b border-neutral-200"
                ></div>
              ))}

              {/* Events for this day */}
              {assignColumns(events)
              .filter((e) => isSameDay(e.start, day))
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
                    onMarkComplete={onMarkComplete}
                    view="weekly"
                  />
              ))}
            </div>
          ))}
          </div>
        </div>
      </div>
    )
  }
  