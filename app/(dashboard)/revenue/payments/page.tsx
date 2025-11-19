"use client"

import { useState, useMemo, useEffect } from "react"
import { DollarSign, CreditCard, Clock, RefreshCcw, Banknote } from "lucide-react"
import { MdOutlineRemoveRedEye, MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md"
import { Payment } from "@/types/types"
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader"
import DataTable from "@/components/DataTable"
import Pagination from "@/components/Pagination"
import { apiGet } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import PaymentsFiltersPanel from "@/components/PaymentFiltersPanel"


export default function Payments() {
  // Backend-loaded data
  const [payments, setPayments] = useState<Payment[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [currentPage, setCurrentPage] = useState(1)
  const [month, setMonth] = useState(() => {
    return new Date().toISOString().slice(0, 7);
  });
  const [type, setType] = useState<Payment["paymentFor"] | "all">("all")
  const [method, setMethod] = useState<Payment["method"] | "all">("all")
  const [status, setStatus] = useState<Payment["status"] | "all">("all")

  // ---- Sorting ----
  const [sortField, setSortField] = useState<string>("dateReceived")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPaid: 0,
    totalPending: 0,
    totalRefunded: 0,
  })

  // ---- Loading state ----
  const [loading, setLoading] = useState(false)

  const fetchPayments = async () => {
    setLoading(true)

    try {
      const res = await apiGet(
        `/payments?month=${month}&type=${type}&method=${method}&status=${status}&page=${currentPage}&perPage=10&sort=${sortField}&order=${sortOrder}`
      )
      setPayments(res.data)
      setTotalPages(res.totalPages)
      const statsData = await apiGet("/payments/stats");
      setStats(statsData);
    } catch (err) {
      console.error(err)
      toast.error("Failed to load payments")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [month, type, method, status, currentPage, sortField, sortOrder])

  // useEffect(() => {
  //   apiGet(`/payments/stats?month=${month}`)
  //     .then(res => setStats(res.data))
  //     .catch(() => console.error("Failed to load stats"))
  // }, [month])

  // ----------------- Derived data -----------------
  const currentDate = new Date()

  // const filteredPayments = useMemo(() => {
  //   return mockPayments.filter((p) => {
  //     const matchMonth = p.dateReceived.startsWith(month)
  //     const matchType = type === "all" || p.paymentType === type
  //     const matchMethod = method === "all" || p.method === method
  //     const matchStatus = status === "all" || p.status === status
  //     return matchMonth && matchType && matchMethod && matchStatus
  //   })
  // }, [month, type, method, status])

  // const sortedPayments = useMemo(() => {
  //   const copy = [...filteredPayments]
  //   if (!sortField) return copy
  //   return copy.sort((a, b) => {
  //     const aVal = a[sortField]
  //     const bVal = b[sortField]
  //     if (typeof aVal === "number" && typeof bVal === "number") {
  //       return sortOrder === "asc" ? aVal - bVal : bVal - aVal
  //     }
  //     return sortOrder === "asc"
  //       ? String(aVal).localeCompare(String(bVal))
  //       : String(bVal).localeCompare(String(aVal))
  //   })
  // }, [filteredPayments, sortField, sortOrder])

  // const paginatedPayments = useMemo(() => {
  //   return sortedPayments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  // }, [sortedPayments, currentPage, rowsPerPage])

  // ----------------- Stats Cards -----------------
  const {totalRevenue,totalPaid,totalPending,totalRefunded} = stats
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
        <PaymentsFiltersPanel
          month={month}
          type={type}
          method={method}
          status={status}
          onMonthChange={setMonth}
          onTypeChange={(v) => setType(v as Payment["paymentFor"] | "all")}
          onMethodChange={(v) => setMethod(v as Payment["method"] | "all")}
          onStatusChange={(v) => setStatus(v as Payment["status"] | "all")}
          onReset={resetFilters}
        />
          
        <DataTable
          data={payments}
          sortField={sortField}
          sortOrder={sortOrder}
          loading={loading}
          onSort={(field) => handleSort(field as keyof Payment)}
          columns={[
            { key: "dateReceived", 
              header: "Date", 
              sortable: true,
              render: (p: Payment) => (
                <span>
                  {format(new Date(p.dateReceived), "dd/MM/yyyy")}
                </span>
              )
             },

            {
              key: "paymentFor",
              header: "Type",
              sortable: true,
              render: (p: Payment) => (
                <span className="capitalize">
                  {p.paymentFor ? p.paymentFor.toLowerCase() : "-"}
                </span>
              ),
            },

            {
              key: "amount",
              header: "Amount",
              sortable: true,
              render: (p: Payment) => (
                <span className="font-semibold text-green-700">
                  ${p.amount}
                </span>
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
