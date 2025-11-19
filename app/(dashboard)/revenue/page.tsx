"use client"

import { useEffect, useState } from "react"
import DashboardHeader from "@/components/DashboardHeader"
import Card from "@/components/Card"
import DataTable from "@/components/DataTable"
import { apiGet } from "@/lib/api"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ExpensePie from "@/components/ExpensePie"
import Skeleton from "@/components/Skeleton"

export default function RevenuePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet("/revenue/dashboard")
        setData(res)
      } catch (err) {
        console.error("Failed to load revenue dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-10 space-y-8 h-screen">
        {/* Summary cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
  
        {/* Charts skeleton */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <Skeleton className="flex-1 h-[300px]" />
          <Skeleton className="w-full lg:w-[360px] h-[300px]" />
        </div>
  
        {/* Tables skeleton */}
        <div className="flex flex-wrap w-full gap-6 h-[600px]">
          <Skeleton className="flex-1" />
          <Skeleton className="flex-1" />
        </div>
      </div>
    );
  }  
  if (!data) return <div className="p-10 text-red-600">Failed to load dashboard</div>

  const { summary, monthlyRevenue, monthlyExpenses, expenseBreakdown, recentPayments, recentOperational } =
    data

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // ------------------ TABLE CONFIG -------------------
  const paymentColumns = [
    {
      key: "dateReceived",
      header: "Date",
      render: (p: any) => <span>{formatDate(p.dateReceived)}</span>,
    },
    { key: "sourceType", header: "Type" },
    { key: "method", header: "Method" },
    {
      key: "amount",
      header: "Amount",
      render: (p: any) => (
        <span className="font-semibold text-green-600">
          ${Number(p.amount).toFixed(2)}
        </span>
      ),
    },
  ];

  const expenseColumns = [
    {
      key: "periodStart",
      header: "Date",
      render: (e: any) => <span>{formatDate(e.periodStart)}</span>,
    },
    { key: "category", header: "Category" },
    {
      key: "amount",
      header: "Amount",
      render: (e: any) => (
        <span className="font-semibold text-red-600">
          -${Number(e.amount).toFixed(2)}
        </span>
      ),
    },
    { key: "notes", header: "Notes" },
  ];
  

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* Header */}
      <DashboardHeader title="Revenue Dashboard" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Revenue"
          number={summary.totalRevenue}
          prefix="$"
          durationSec={1.2}
          date={new Date().toISOString().slice(0, 10)}
        />
        <Card
          title="Payroll"
          number={-summary.totalPayroll}
          durationSec={1.2}
          date={new Date().toISOString().slice(0, 10)}
        />
        <Card
          title="Operational"
          number={-summary.totalOperational}
          durationSec={1.2}
          date={new Date().toISOString().slice(0, 10)}
        />
        <Card
          title="Net Profit"
          number={summary.netProfit}
          durationSec={1.2}
          date={new Date().toISOString().slice(0, 10)}
        />
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* Revenue vs Expenses Chart */}
        <div className="flex-1 bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-300">
          <header className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue vs Expenses</h3>
            <p className="text-xs text-gray-400">Last 12 months</p>
          </header>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue.map((m: { month: string; revenue: number }, i: number) => ({
                month: m.month,
                revenue: m.revenue,
                expenses: monthlyExpenses[i].operational + monthlyExpenses[i].payroll
              }))}>
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
                  formatter={(val, label) => [`$${val.toLocaleString()}`, label]}
                />

                <Bar dataKey="revenue" name="Revenue" fill="#ffc107" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="expenses" name="Expenses" fill="#8884d8" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <div className="w-full lg:w-[360px] bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-300">
          <header className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Expense Breakdown</h3>
          </header>

          <div className="w-full lg:w-[360px]">
            <ExpensePie expenseBreakdown={expenseBreakdown} />
          </div>
        </div>

      </div>


      {/* Tables */}
      <div className="flex flex-wrap w-full gap-6">
        <div className="bg-white flex-1 shadow-md rounded-xl p-4">
          <DataTable
            data={recentPayments}
            columns={paymentColumns}
            loading={loading}
            sortField="amount"
            sortOrder="desc"
            emptyMessage="No payments"
          />
        </div>

        <div className="bg-white flex-1 shadow-md rounded-xl p-4">
          <DataTable
            data={recentOperational}
            columns={expenseColumns}
            loading={loading}
            sortField="amount"
            sortOrder="desc"
            emptyMessage="No expenses"
          />
        </div>
      </div>
    </div>
  )
}
