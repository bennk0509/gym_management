"use client"

import { useMemo, useState, useEffect } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, Title)

type CustomerToday = { new: number; done: number; cancel: number }
type Props = { data: CustomerToday; title?: string }

const COLORS = {
  amber500: "#FFC107",
  green500: "#10B981",
  red500: "#EF4444",
  brandDark: "#1E1E1E",
}

export default function CustomerTodayChart({ data, title = "Customers Today" }: Props) {
  const total = data.new + data.done + data.cancel

  // what to show in the middle
  const [center, setCenter] = useState<{ label: string; value: number }>({
    label: "Total",
    value: total,
  })

  // keep total in sync when data changes
  useEffect(() => setCenter((c) => (c.label === "Total" ? { label: "Total", value: total } : c)), [total])

  const doughnutData = useMemo(
    () => ({
      datasets: [
        {
          data: [data.new, data.done, data.cancel],
          backgroundColor: [COLORS.amber500, COLORS.green500, COLORS.red500],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
      labels: ["New", "Done", "Cancel"],
    }),
    [data]
  )
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false, // key: let the container control size
    cutout: "70%",
  }), [])

  // plugin that draws center text (closes over React state)
  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart: any) {
      const { ctx, chartArea } = chart
      if (!chartArea) return
      const x = (chartArea.left + chartArea.right) / 2
      const y = (chartArea.top + chartArea.bottom) / 2

      ctx.save()
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // label (top)
      ctx.fillStyle = "rgba(17,17,17,0.7)"
      ctx.font = "600 14px Poppins, ui-sans-serif, system-ui"
      ctx.fillText(center.label, x, y - 10)

      // value (bottom/big)
      ctx.fillStyle = COLORS.brandDark
      ctx.font = "700 26px Inter, ui-sans-serif, system-ui"
      ctx.fillText(center.value.toLocaleString(), x, y + 14)

      ctx.restore()
    },
  }
  return (
    <div className="items-center h-full w-full">
      <Doughnut data={doughnutData} options={options} plugins={[centerTextPlugin]}/>
      <p className="sr-only">
        {title}: total {total}. New {data.new}, Done {data.done}, Cancel {data.cancel}.
      </p>
    </div>
  )
}
