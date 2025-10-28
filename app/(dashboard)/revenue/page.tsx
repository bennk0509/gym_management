"use client"

import Card from "@/components/Card";
import { mockFinancialReports,mockPayments, mockOperationalCosts, mockPayrolls, Payment, Expense, mockExpenses } from "@/data/sessions";
import DashboardHeader from "@/components/DashboardHeader";
import { useState } from "react";
import { BarChart } from "@/components/BarChart";
import { PieChart } from "@/components/PieChart";
import DataTable from "@/components/DataTable";


export default function Revenue(){
    const monthlyData = mockFinancialReports.map((r) => ({
        month: r.month,
        revenue: r.totalRevenue,
        expense:
          r.totalRefunds +
          r.totalPayroll +
          r.totalOperationalCost +
          r.totalPromotionalDiscounts,
      }));
    const labels = monthlyData.map((item) => item.month);
    const data = {
    labels,
    datasets: [
        {
          label: 'Revenue',
          data: monthlyData.map((r) => r.revenue),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Expense',
          data: monthlyData.map((r) => r.expense),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Revenue vs Expenses",
            font: { size: 18 },
            color: "#000000"
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
    };
    const totals = mockFinancialReports.reduce(
        (acc, cur) => ({
          totalRevenue: acc.totalRevenue + cur.totalRevenue,
          totalRefunds: acc.totalRefunds + cur.totalRefunds,
          totalPayroll: acc.totalPayroll + cur.totalPayroll,
          totalOperationalCost: acc.totalOperationalCost + cur.totalOperationalCost,
          totalPromotionalDiscounts: acc.totalPromotionalDiscounts + cur.totalPromotionalDiscounts,
        }),
        { totalRevenue: 0, totalRefunds: 0, totalPayroll: 0, totalOperationalCost: 0, totalPromotionalDiscounts: 0 }
    );
    const expenseData = {
        labels: ["Refunds", "Payroll", "Operational", "Promotional Discounts"],
        datasets: [
          {
            label: "Expense Breakdown",
            data: [
              totals.totalRefunds,
              totals.totalPayroll,
              totals.totalOperationalCost,
              totals.totalPromotionalDiscounts,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
    
    const expenseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        display: true,
        position: "top" as const,
        },
        title: {
        display: true,
        text: "Expense Breakdown",
        font: { size: 18 },
        color: "#000000"
        },
    },
    };
    const topPayments = mockPayments
        .filter((p) => p.status === "paid")
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
    const paymentColumns = [
        { key: "dateReceived", header: "Date", sortable: true },
        { key: "paymentType", header: "Type" },
        { key: "method", header: "Method" },
        {
          key: "amount",
          header: "Amount",
          sortable: true,
          render: (p: Payment) => (
            <span className="font-semibold text-green-600">
              ${p.amount.toFixed(2)}
            </span>
          ),
        },
      ];
    const topExpenses = mockExpenses.sort((a, b) => b.amount - a.amount).slice(0, 5);
    const expenseColumns = [
        { key: "date", header: "Date" },
        { key: "sourceType", header: "Category" },
        {
          key: "amount",
          header: "Amount",
          render: (e: Expense) => (
            <span className="font-semibold text-red-600">
              -${e.amount.toFixed(2)}
            </span>
          ),
        },
        { key: "notes", header: "Notes" },
      ];
    return(
        <div className="p-10 space-y-8 h-screen">
            {/* Header */}
            <DashboardHeader
                title="Revenue"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                title="Revenue"
                number={totals.totalRevenue}
                prefix="$"
                date={new Date().toLocaleDateString()}
                durationSec={1.2}
                />
                <Card
                title="Payroll"
                number={-totals.totalPayroll}
                date={new Date().toLocaleDateString()}
                durationSec={1.2}
                />

                <Card
                title="Operational"
                number={-totals.totalOperationalCost}
                date={new Date().toLocaleDateString()}
                durationSec={1.2}
                />

                <Card
                title="Net Profit"
                number={totals.totalRevenue - totals.totalPayroll - totals.totalOperationalCost}
                date={new Date().toLocaleDateString()}
                durationSec={1.2}
                />
            </div>

            <div className="flex flex-wrap gap-6 w-full justify-center">
                <div className="bg-neutral-light h-[500px] flex-[2] min-w-[300px] shadow-md rounded-xl p-4 text-center">
                    <BarChart options={options} data={data} />
                </div>

                <div className="bg-neutral-light h-[500px] flex-[1] min-w-[250px] shadow-md rounded-xl p-4 text-center">
                    <PieChart options={expenseOptions} data={expenseData} />
                </div>
            </div>

            <div className="flex flex-wrap w-full gap-6">
                <div className="bg-neutral-light flex-1 shadow-md rounded-xl p-4 text-center">

                    <DataTable
                            data={topPayments}
                            columns={paymentColumns}
                            sortField="amount"
                            sortOrder="desc"
                            emptyMessage="No payments found"
                        />
                </div>
                <div className="bg-neutral-light flex-1 shadow-md rounded-xl p-4 text-center">
                    <DataTable
                            data={topExpenses}
                            columns={expenseColumns}
                            sortField="amount"
                            sortOrder="desc"
                            emptyMessage="No expenses found"
                    />
                </div>
            </div>
        </div>
    )
}