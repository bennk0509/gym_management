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
import { mockSessions, mockCustomers } from "@/data/sessions";

export default function ActiveCustomersChart() {
  const customerActivity = mockCustomers
    .filter((c) => c.status === "active")
    .map((c) => {
    const custSessions = mockSessions.filter(
        (s) =>
            s.customer.trim().toLowerCase() ===
            `${c.firstName} ${c.lastName}`.trim().toLowerCase() &&
            s.status === "done"
        );
      const totalSpent = custSessions.reduce((sum, s) => sum + s.totalPrice, 0);
      
      return {
        name: `${c.firstName} ${c.lastName}`,
        sessions: custSessions.length,
        spent: totalSpent,
      };
    })
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);

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
            formatter={(val: number, key: string) =>
              key === "sessions" ? [`${val} sessions`] : [`$${val}`]
            }
          />
          <Bar dataKey="sessions" fill="#ffc107" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
