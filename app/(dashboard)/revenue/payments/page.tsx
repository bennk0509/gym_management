"use client"

import { useState, useMemo } from "react"
import { RiExpandUpDownLine } from "react-icons/ri"
import { DollarSign, CreditCard, Clock, RefreshCcw, Banknote } from "lucide-react"
import { MdOutlineRemoveRedEye, MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md"
import { Payment, mockPayments } from "@/data/sessions"
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader"
import DataTable from "@/components/DataTable"
import Pagination from "@/components/Pagination"

export default function Payments() {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const totalPages = Math.ceil(mockPayments.length / rowsPerPage)
  const [sortField, setSortField] = useState<keyof Payment | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [month, setMonth] = useState("2025-10")
  const [type, setType] = useState<Payment["paymentType"] | "all">("all")
  const [method, setMethod] = useState<Payment["method"] | "all">("all")
  const [status, setStatus] = useState<Payment["status"] | "all">("all")

  // ----------------- Derived data -----------------
  const currentDate = new Date()

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((p) => {
      const matchMonth = p.dateReceived.startsWith(month)
      const matchType = type === "all" || p.paymentType === type
      const matchMethod = method === "all" || p.method === method
      const matchStatus = status === "all" || p.status === status
      return matchMonth && matchType && matchMethod && matchStatus
    })
  }, [month, type, method, status])

  const sortedPayments = useMemo(() => {
    const copy = [...filteredPayments]
    if (!sortField) return copy
    return copy.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [filteredPayments, sortField, sortOrder])

  const paginatedPayments = useMemo(() => {
    return sortedPayments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  }, [sortedPayments, currentPage, rowsPerPage])

  // ----------------- Stats Cards -----------------
  const totalRevenue = useMemo(
    () => mockPayments.reduce((sum, p) => sum + p.amount, 0),
    []
  )
  const totalPaid = mockPayments.filter((p) => p.status === "paid").length
  const totalPending = mockPayments.filter((p) => p.status === "pending").length
  const totalRefunded = mockPayments.filter((p) => p.status === "refunded").length

  // ----------------- Handlers -----------------
  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const resetFilters = () => {
    setMonth("2025-10")
    setType("all")
    setMethod("all")
    setStatus("all")
  }

  const handleDelete = (p: Payment) => {
    const confirmDelete = window.confirm(`Delete payment ${p.id}?`)
    if (!confirmDelete) return
    alert("Deleted mock payment (frontend only)")
  }

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* ---------- Header ---------- */}
      <DashboardHeader
        title="Payments Dashboard"
        buttonText="+ Add Manual Payment"
        onButtonClick={() => alert("Open payment modal")}
      />

      {/* ---------- Summary Cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Revenue"
          number={totalRevenue}
          prefix="$"
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<DollarSign className="text-green-600" />}
        />
        <Card
          title="Paid Payments"
          number={totalPaid}
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<CreditCard className="text-blue-600" />}
        />
        <Card
          title="Pending Payments"
          number={totalPending}
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<Clock className="text-yellow-600" />}
        />
        <Card
          title="Refunded"
          number={totalRefunded}
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<Banknote className="text-red-600" />}
        />
      </div>

      {/* ---------- Filters + Table ---------- */}
      <div className="bg-white w-full border border-gray-200 shadow-md rounded-xl flex flex-col gap-2">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-3">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="session">Session</option>
                <option value="package">Package</option>
                <option value="membership">Membership</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 transition"
          >
            <RefreshCcw size={16} /> Reset
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          data={paginatedPayments}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(field) => handleSort(field as keyof Payment)}
          columns={[
            { key: "dateReceived", header: "Date", sortable: true },
            {
              key: "paymentType",
              header: "Type",
              sortable: true,
              render: (p: Payment) => (
                <span className="capitalize">{p.paymentType}</span>
              ),
            },
            {
              key: "amount",
              header: "Amount",
              sortable: true,
              render: (p: Payment) => (
                <span className="font-semibold text-green-700">${p.amount}</span>
              ),
            },
            { key: "method", header: "Method", sortable: true },
            {
              key: "status",
              header: "Status",
              sortable: true,
              render: (p: Payment) => (
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                    p.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : p.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : p.status === "refunded"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.status}
                </span>
              ),
            },
            {
              key: "notes",
              header: "Notes",
              render: (p: Payment) => p.notes || "-",
            },
            {
              key: "actions",
              header: "Actions",
              render: (p: Payment) => (
                <div className="flex gap-3">
                  <button
                    className="text-gray-400 hover:text-brand-600 transition-colors"
                    title="View"
                    onClick={() => console.log("View payment", p)}
                  >
                    <MdOutlineRemoveRedEye size={20} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit"
                    onClick={() => alert("Edit payment")}
                  >
                    <MdOutlineModeEdit size={20} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                    onClick={() => handleDelete(p)}
                  >
                    <MdOutlineDeleteForever size={20} />
                  </button>
                </div>
              ),
            },
          ]}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
