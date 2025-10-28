// components/KpiCard.tsx
"use client"

import CountUp from "react-countup"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react" // npm i lucide-react

type Unit = "number" | "currency" | "percent"

export type KpiCardProps = {
  title: string
  /** Current KPI value */
  value: number
  /** Previous comparable value (yesterday, last week, etc.) */
  prevValue?: number
  /** For the small caption under the number */
  date?: string
  /** Unit & formatting */
  unit?: Unit
  currency?: string     // e.g. "USD" if unit="currency"
  /** Trend for sparkline (old → new) */
  trend?: number[]
  /** Some KPIs are better when LOWER (e.g., churn). Set false to invert colors. */
  goodIsUp?: boolean
  /** Compact display (1.2k, 3.4M) */
  compact?: boolean
}

export default function KpiCard({
  title,
  value,
  prevValue,
  date,
  unit = "number",
  currency = "USD",
  trend,
  goodIsUp = true,
  compact = true,
}: KpiCardProps) {
  const deltaAbs = prevValue === undefined ? undefined : value - prevValue
  const deltaPct =
    prevValue === undefined || prevValue === 0 ? undefined : (deltaAbs! / prevValue) * 100

  // Direction + color
  const upIsGood = goodIsUp ? deltaAbs! >= 0 : deltaAbs! <= 0
  const dir: "up" | "down" | "flat" =
    deltaPct === undefined ? "flat" : deltaAbs! === 0 ? "flat" : deltaAbs! > 0 ? "up" : "down"

  const badgeClass =
    dir === "flat"
      ? "bg-[var(--color-info)]/10 text-[var(--color-info)]"
      : upIsGood
      ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
      : "bg-[var(--color-error)]/10 text-[var(--color-error)]"

  // Formatters
  const fmt = (n: number) =>
    unit === "currency"
      ? new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
          notation: compact ? "compact" : "standard",
          maximumFractionDigits: 2,
        }).format(n)
      : unit === "percent"
      ? `${n.toFixed(1)}%`
      : new Intl.NumberFormat(undefined, {
          notation: compact ? "compact" : "standard",
          maximumFractionDigits: 2,
        }).format(n)

  const end = value ?? 0

  return (
    <div className="bg-white w-full border border-neutral-100 shadow-sm rounded-2xl p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-[16px] text-brand-800">{title}</h3>

        {/* Delta badge */}
        {deltaPct !== undefined && (
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${badgeClass}`}>
            {dir === "up" ? <ArrowUpRight size={14} /> : dir === "down" ? <ArrowDownRight size={14} /> : <Minus size={14} />}
            {`${(Math.abs(deltaPct)).toFixed(1)}%`}
          </span>
        )}
      </div>

      {/* Main number */}
      <div className="font-heading text-3xl text-brand-800">
        {unit === "currency" ? (
          // CountUp doesn't format currency; we format prefix/suffix ourselves
          <CountUp
            end={end}
            duration={1.2}
            separator=","
            decimals={2}
            prefix={currencySymbol(currency)}
          />
        ) : unit === "percent" ? (
          <CountUp end={end} duration={1.2} separator="," decimals={1} suffix="%" />
        ) : (
          <CountUp end={end} duration={1.2} separator="," />
        )}
      </div>

      {/* Subtext (date / comparison line) */}
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-brand-500">{date}</p>
        {prevValue !== undefined && (
          <p className="font-sans text-xs text-brand-400">
            vs previous: {fmt(prevValue)}
          </p>
        )}
      </div>

      {/* Sparkline */}
      {Array.isArray(trend) && trend.length > 1 && (
        <Sparkline
          data={trend}
          className={`mt-1 ${dir === "flat" ? "text-[var(--color-info)]" : upIsGood ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}
        />
      )}
    </div>
  )
}

/* --- Tiny sparkline (no extra deps) --- */
function Sparkline({ data, className = "", width = 160, height = 36 }: { data: number[]; className?: string; width?: number; height?: number }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const points = data
    .map((v, i) => {
      const x = i * step
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-9 ${className}`} preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
    </svg>
  )
}

function currencySymbol(code: string) {
  // quick map for common currencies; fall back to code + space
  const map: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", VND: "₫", JPY: "¥" }
  return map[code] ?? `${code} `
}
