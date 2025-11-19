"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface RevenueOverviewProps {
  monthlyRevenue: { month: string; revenue: number }[];
}

export default function RevenueOverview({ monthlyRevenue }: RevenueOverviewProps) {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const currentMonth = monthlyRevenue.at(-2)?.revenue ?? 0;
  const lastMonth = monthlyRevenue.at(-1)?.revenue ?? 0;
  const growth =
  lastMonth === 0
    ? 0
    : ((currentMonth - lastMonth) / lastMonth) * 100;

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
        <p className={`text-sm flex items-center gap-1 mt-1 ${
          growth >= 0 ? "text-green-600" : "text-red-600"
        }`}>
          <ArrowUpRight size={16} />
          {growth.toFixed(1)}% from last month
        </p>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyRevenue}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

            <XAxis
              dataKey="month"
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
              }
            />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "10px",
                border: "1px solid #eee",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]}
              labelStyle={{ fontWeight: "bold", color: "#111" }}
            />

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
