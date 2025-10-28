// components/SessionsTodayPanel.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import SessionCard from "@/components/SessionCard"
import { Session } from "@/data/sessions"

type Props = {
  sessions: Session[]
  seeAllHref?: string // default "/sessions"
  title?: string
}

export default function SessionsTodayPanel({ sessions, seeAllHref = "/sessions", title = "Sessions Today" }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)

  const checkOverflow = () => {
    const el = scrollRef.current
    if (!el) return
    setHasOverflow(el.scrollHeight > el.clientHeight + 2) // small tolerance
  }

  useEffect(() => {
    checkOverflow()
    const onResize = () => checkOverflow()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [sessions])

  return (
    <section className="relative">
      {/* Scroll area – internal scroll keeps /main full-screen */}
      <div
        ref={scrollRef}
        className="max-h-[60vh] overflow-y-auto pr-1"
        onScroll={checkOverflow}
      >
        {/* responsive card grid */}
        <div className="flex flex-col gap-2 text-sm">
          {sessions.map((s) => (
            <SessionCard key={s.id} {...s} />
          ))}
        </div>
      </div>

      {/* Pinned 'See all' appears only if overflow */}
      {hasOverflow && (
        <a
          href={seeAllHref}
          className="absolute bottom-0 left-0 inline-flex items-center gap-2 text-sm font-medium
                     text-brand-800 hover:underline bg-neutral-light px-3 py-1.5 rounded-md"
          aria-label="See all sessions"
        >
          See all
        </a>
      )}
    </section>
  )
}
