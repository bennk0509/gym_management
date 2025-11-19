"use client"

import { useState, useMemo, useEffect } from "react"
import { DollarSign, FileText, BarChart2, RefreshCcw } from "lucide-react"
import { MdOutlineRemoveRedEye, MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md"

import { OperationalCost, CostCategory } from "@/types/types"
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader"
import DataTable from "@/components/DataTable"
import Pagination from "@/components/Pagination"
import AddNewOperationalCost from "@/components/AddNewOperationCost"

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api"
import OperationalCostFiltersPanel from "@/components/OperationalCostFiltersPanel"
import Skeleton from "@/components/Skeleton"

// ========================= Helpers =========================
const formatPeriod = (o: OperationalCost) => {
  const d = new Date(o.periodStart)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default function OperationalCostsPage() {
  const [costs, setCosts] = useState<OperationalCost[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const [sortField, setSortField] = useState<keyof OperationalCost | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [month, setMonth] = useState(() => {
    return new Date().toISOString().slice(0, 7);
  });
  const [category, setCategory] = useState<CostCategory | "all">("all")

  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<OperationalCost | null>(null)

  const currentDate = new Date()

  // ========================= Fetch Data =========================
  useEffect(() => {
    const loadData = async () => {
      const data = await apiGet("/operational-costs")
      setCosts(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // ========================= Filters =========================
  const filteredCosts = useMemo(() => {
    return costs.filter((c) => {
      const costMonth = formatPeriod(c)
      const matchMonth = month === "" || costMonth === month
      const matchCategory = category === "all" || c.category === category
      return matchMonth && matchCategory
    })
  }, [costs, month, category])

  // ========================= Sorting =========================
  const sortedCosts = useMemo(() => {
    const copy = [...filteredCosts]
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
  }, [filteredCosts, sortField, sortOrder])

  // ========================= Pagination =========================
  const totalPages = Math.ceil(sortedCosts.length / rowsPerPage)
  const paginatedCosts = useMemo(() => {
    return sortedCosts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  }, [sortedCosts, currentPage])

  // ========================= Stats =========================
  const totalCost = filteredCosts.reduce((sum, c) => sum + c.amount, 0)
  const totalItems = filteredCosts.length
  const avgCost = totalItems ? Math.round(totalCost / totalItems) : 0

  // ========================= Sorting Handler =========================
  const handleSort = (field: keyof OperationalCost) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  // ========================= CRUD Actions =========================
  const resetFilters = () => {
    setMonth("")
    setCategory("all")
    setSortField(null)
    setCurrentPage(1)
  }

  const handleDelete = async (item: OperationalCost) => {
    if (!confirm(`Delete cost item: ${item.category}?`)) return

    await apiDelete(`/operational-costs/${item.id}`)

    setCosts((prev) => prev.filter((c) => c.id !== item.id))
  }

  const handleSaveCost = async (data: any) => {
    let saved
  
    const payload = {
      category: data.category,
      amount: Number(data.amount),
      notes: data.notes || null,
      periodStart: data.periodStart,  // already ISO
      periodEnd: data.periodEnd,      // already ISO
    }
    console.log(payload);
    if (data.id) {
      saved = await apiPatch(`/operational-costs/${data.id}`, payload)
    } else {
      saved = await apiPost(`/operational-costs`, payload)
    }
  
    // Update list
    setCosts((prev) => {
      const exists = prev.find((c) => c.id === saved.id)
      if (exists) return prev.map((c) => (c.id === saved.id ? saved : c))
      return [...prev, saved]
    })
  
    setShowModal(false)
    setEditItem(null)
  }
  

  const handleEdit = (item: OperationalCost) => {
    const period = formatPeriod(item)
    setEditItem({ ...item, month: period } as any)
    setShowModal(true)
  }

  // ========================= LOADING STATE =========================
  if (loading) {
    return (
      <div className="p-10 space-y-8">
  
        {/* Header */}
        <Skeleton className="h-10 w-60" />
  
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
  
        {/* Filters + Table */}
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }
  

  // ========================= RENDER =========================
  return (
    <div className="p-10 space-y-8 h-screen">
      <DashboardHeader
        title="Operational Costs"
        buttonText="+ Add Cost"
        onButtonClick={() => {
          setEditItem(null)
          setShowModal(true)
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Total Monthly Cost"
          number={totalCost}
          prefix="$"
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<DollarSign className="text-red-600" />}
        />
        <Card
          title="Total Entries"
          number={totalItems}
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<FileText className="text-blue-600" />}
        />
        <Card
          title="Average Cost"
          number={avgCost}
          prefix="$"
          durationSec={1.6}
          date={currentDate.toString()}
          icon={<BarChart2 className="text-purple-600" />}
        />
      </div>

      {/* Filters + Table */}
      <div className="bg-white w-full border border-gray-200 shadow-md rounded-xl flex flex-col gap-2">
        {/* <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-3">
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
              <label className="text-sm font-medium text-gray-600 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CostCategory | "all")}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="RENT">Rent</option>
                <option value="UTILITIES">Utilities</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALARY">Salary</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 transition"
          >
            <RefreshCcw size={16} /> Reset
          </button>
        </div> */}

        <OperationalCostFiltersPanel
            month={month}
            category={category}
            onMonthChange={setMonth}
            onCategoryChange={(v) => setCategory(v)}
            onReset={resetFilters}
          />

        {/* Data Table */}
        <DataTable
          data={paginatedCosts}
          sortField={sortField}
          sortOrder={sortOrder}
          loading={loading}
          onSort={(field) => handleSort(field as keyof OperationalCost)}
          columns={[
            {
              key: "periodStart",
              header: "Period",
              sortable: true,
              render: (c: OperationalCost) => <span>{formatPeriod(c)}</span>,
            },
            {
              key: "category",
              header: "Category",
              sortable: true,
              render: (c: OperationalCost) => (
                <span className="capitalize text-brand-primary font-semibold">
                  {c.category}
                </span>
              ),
            },
            {
              key: "amount",
              header: "Amount",
              sortable: true,
              render: (c: OperationalCost) => (
                <span className="font-semibold text-red-700">${c.amount}</span>
              ),
            },
            {
              key: "notes",
              header: "Notes",
              render: (c: OperationalCost) => c.notes || "-",
            },
            {
              key: "actions",
              header: "Actions",
              render: (item: OperationalCost) => (
                <div className="flex gap-3">
                  <button
                    className="text-gray-400 hover:text-blue-500"
                    title="Edit"
                    onClick={() => handleEdit(item)}
                  >
                    <MdOutlineModeEdit size={20} />
                  </button>

                  <button
                    className="text-gray-400 hover:text-red-500"
                    title="Delete"
                    onClick={() => handleDelete(item)}
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

      {/* Modal */}
      {showModal && (
        <AddNewOperationalCost
          onClose={() => setShowModal(false)}
          onSave={handleSaveCost}
          initialData={editItem}
        />
      )}
    </div>
  )
}
