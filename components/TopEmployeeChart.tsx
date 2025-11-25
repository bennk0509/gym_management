"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


interface TopEmployeesPerformanceProps {
  topEmployees: {
    name: string;
    revenue: number;
    sessions: number; 
  }[];
}

export default function TopEmployeesPerformanceChart({topEmployees}: TopEmployeesPerformanceProps) {

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-primary">
          Top Employees Performance
        </h3>
        <span className="text-sm text-gray-400">Revenue vs Sessions</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={topEmployees}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{
              fill: "#555",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-45}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "10px",
              border: "1px solid #eee",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            formatter={(value: any, name: string) => {
              if (name === "revenue") {
                return [`$${value.toLocaleString()}`, "Revenue"];
              }
              if (name === "sessions") {
                return [`${value}`, "Sessions"];
              }
              return [value, name];
            }}
            labelStyle={{ fontWeight: "bold", color: "#111" }}
          />

          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            fill="#ffc107"
            barSize={22}
            radius={[4, 4, 0, 0]}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sessions"
            name="Sessions"
            stroke="#1e1e1e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#1e1e1e" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
