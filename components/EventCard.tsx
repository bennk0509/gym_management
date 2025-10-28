import { format, isSameDay } from "date-fns"
import React, { useState } from "react"
import { Session, SessionStatus, SessionType } from "@/data/sessions"
import { view } from "framer-motion/client"

interface SessionBoxProps {
  event: Session
  allEvents: Session[]
  rowHeight?: number
  gap?: number
  selectedId?: string | null
  setSelectedId: (id: string | null) => void
  hoveredId?: string | null
  setHoveredId: (id: string | null) => void
  onEdit?: (e: Session) => void
  onDelete?: (e: Session) => void
  SessionHoverCard?: React.ComponentType<any>
  view: "daily" | "weekly" | "monthly"
}



export const SessionBox: React.FC<SessionBoxProps> = ({
  event,
  allEvents,
  rowHeight,
  gap,
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
  onEdit,
  onDelete,
  SessionHoverCard,
  view
}) => {
  // Compute overlapping columns
    const isGridView = view === "daily" || view === "weekly"
    const overlapping = isGridView
    ? allEvents?.filter(
        (other) => !(event.end <= other.start || event.start >= other.end)
        ) ?? []
    : []
        
    const columnCount = isGridView ? overlapping.length : 1
    const columnIndex = isGridView ? overlapping.findIndex((ev) => ev.id === event.id) : 0

    const startHour = event.start.getHours() + event.start.getMinutes() / 60
    const endHour = event.end.getHours() + event.end.getMinutes() / 60
    const top = isGridView ? startHour * (rowHeight ?? 0) : 0
    const height = isGridView ? (endHour - startHour) * (rowHeight ?? 0) : "auto"

  // Hover logic
  const [hoverPos, setHoverPos] = useState<"left" | "right" | "center">("center")

  return (
    <div
        key={event.id}
        className={`${isGridView ? "absolute" : "relative"} `}
        style={
            isGridView
            ? {
                top: `${top}px`,
                height: `${height}px`,
                left: `calc(${(100 / columnCount) * columnIndex}% + ${(gap ?? 0) / 2}px)`,
                width: `calc(${100 / columnCount}% - ${(gap ?? 0)}px)`
                }
            : {}
        }
        onMouseEnter={(ev) => {
            setHoveredId?.(event.id)
            const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect()
            const availableRight = window.innerWidth - rect.right
            const availableLeft = rect.left
            
            if (view === "daily")
            {
                if (columnCount === 1 || (availableRight < 250 && availableLeft < 250)) {
                    setHoverPos("center")
                } else if (availableRight < 250) {
                    setHoverPos("left")
                } else {
                    setHoverPos("right")
                }
            }
            else{
                if(availableRight < 300)
                {
                    setHoverPos("left")
                }
                else{
                    setHoverPos("right")
                }
            }
        }}
        onMouseLeave={() => {
            if (!selectedId) setHoveredId?.(null)
        }}
        onClick={() =>
            setSelectedId?.(selectedId === event.id ? null : event.id)
        }
    >
      {/* Event box */}
      <div
        className={`h-full w-full ${
            event.status === "done"
            ? "bg-[#E8F5E9] text-[#2E7D32]" 
            : event.status === "new"
            ? "bg-[#FFF9E6] text-[#B58900]"      
            : "bg-[#FDEAEA] text-[#C62828]"     
        } border border-white rounded-xl p-2 shadow-md overflow-hidden`}
      >
        <div className="flex items-center flex-row gap-2 truncate max-w-full">
          <h4 className="font-heading text-sm text-brand-800">{event.title}</h4>
        </div>
        <div className="font-sans text-sm text-brand-500">
          {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
        </div>
      </div>

      {/* Hover card */}
      {(hoveredId === event.id || selectedId === event.id) &&
        SessionHoverCard && (
          <SessionHoverCard
            session={event}
            position={hoverPos}
            visible={hoveredId === event.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={() => {setHoveredId(null)}}
          />
        )}
    </div>
  )
}
