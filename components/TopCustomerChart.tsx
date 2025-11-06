"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ActiveCustomersChartProps {
  customerActivity: {
    name: string;
    sessions: number;
    spent: number;
  }[];
}


export default function ActiveCustomersChart({customerActivity}: ActiveCustomersChartProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-brand-primary">
        Most Active Customers
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={customerActivity} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fontSize: 12, fill: "#555" }}
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
          <Bar dataKey="sessions" fill="#ffc107" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
