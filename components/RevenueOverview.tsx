"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { mockSessions } from "@/data/sessions";
import { motion } from "framer-motion";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// --- Helper: group monthly revenue ---
function getMonthlyRevenue() {
  const revenueByMonth: Record<string, number> = {};

  for (const s of mockSessions) {
    if (s.status === "done") {
      const monthIndex = new Date(s.date).getMonth();
      revenueByMonth[MONTHS[monthIndex]] =
        (revenueByMonth[MONTHS[monthIndex]] ?? 0) + s.totalPrice;
    }
  }

  return MONTHS.map((m) => ({
    month: m,
    revenue: Math.round(revenueByMonth[m] ?? 0),
  }));
}

export default function RevenueOverview() {
  const monthly = getMonthlyRevenue();

  // calculate total and growth
  const totalRevenue = monthly.reduce((sum, m) => sum + m.revenue, 0);
  const growth = 5.2; // placeholder for demo

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex-1 bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Monthly Revenue Overview
        </h3>
        <div className="text-xs text-gray-400">Last 12 months</div>
      </header>

      {/* Summary */}
      <div className="mb-4">
        <div className="text-4xl font-bold text-gray-900">
          ${totalRevenue.toLocaleString()}
        </div>
        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
          <ArrowUpRight size={16} /> +{growth}% from last month
        </p>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthly}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis with proper currency formatting */}
            <YAxis
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
              }
            />

            {/* Tooltip */}
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #eee",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]}
            />
            {/* Bar */}
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#ffc107"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
