"use client"

import { useState, useMemo } from "react"
import { DollarSign, FileText, BarChart2, RefreshCcw } from "lucide-react"
import { MdOutlineRemoveRedEye, MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md"
import { OperationalCost, mockOperationalCosts } from "@/data/sessions"
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader"
import DataTable from "@/components/DataTable"
import Pagination from "@/components/Pagination"
import AddNewOperationalCost from "@/components/AddNewOperationCost"

export default function OperationalCostsPage() {
  // State
  const [costs, setCosts] = useState<OperationalCost[]>(mockOperationalCosts)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const totalPages = Math.ceil(costs.length / rowsPerPage)

  const [sortField, setSortField] = useState<keyof OperationalCost | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [month, setMonth] = useState("2025-10")
  const [category, setCategory] = useState<OperationalCost["category"] | "all">("all")

  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<OperationalCost | null>(null)

  const currentDate = new Date()

  // ============= FILTER =============
  const filteredCosts = useMemo(() => {
    return costs.filter((c) => {
      const matchMonth = c.period === month
      const matchCategory = category === "all" || c.category === category
      return matchMonth && matchCategory
    })
  }, [costs, month, category])

  // ============= SORT =============
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

  const paginatedCosts = useMemo(() => {
    return sortedCosts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  }, [sortedCosts, currentPage, rowsPerPage])

  // ============= STATS =============
  const totalCost = filteredCosts.reduce((sum, c) => sum + c.amount, 0)
  const totalItems = filteredCosts.length
  const avgCost = totalItems ? Math.round(totalCost / totalItems) : 0

  // ============= SORT HANDLER =============
  const handleSort = (field: keyof OperationalCost) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  // ============= ACTIONS =============
  const resetFilters = () => {
    setMonth("2025-10")
    setCategory("all")
    setSortField(null)
    setCurrentPage(1)
  }

  const handleDelete = (item: OperationalCost) => {
    const confirmDelete = window.confirm(`Delete cost item: ${item.category}?`)
    if (!confirmDelete) return
    setCosts((prev) => prev.filter((c) => c.id !== item.id))
  }

  const handleSaveCost = (data: OperationalCost) => {
    setCosts((prev) => {
      const exists = prev.find((c) => c.id === data.id)
      if (exists) {
        return prev.map((c) => (c.id === data.id ? data : c))
      } else {
        return [...prev, data]
      }
    })
    setShowModal(false)
    setEditItem(null)
  }

  const handleEdit = (c: OperationalCost) => {
    setEditItem(c)
    setShowModal(true)
  }

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* ---------- Header ---------- */}
      <DashboardHeader
        title="Operational Costs"
        buttonText="+ Add Cost"
        onButtonClick={() => {
          setEditItem(null)
          setShowModal(true)
        }}
      />

      {/* ---------- Summary Cards ---------- */}
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
              <label className="text-sm font-medium text-gray-600 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="rent">Rent</option>
                <option value="utilities">Utilities</option>
                <option value="equipment">Equipment</option>
                <option value="marketing">Marketing</option>
                <option value="maintenance">Maintenance</option>
                <option value="insurance">Insurance</option>
                <option value="supplies">Supplies</option>
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
          data={paginatedCosts}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(field) => handleSort(field as keyof OperationalCost)}
          columns={[
            {
              key: "period",
              header: "Period",
              sortable: true,
              render: (c: OperationalCost) => <span>{c.period}</span>,
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
              render: (c: OperationalCost) => (
                <div className="flex gap-3">
                  <button
                    className="text-gray-400 hover:text-brand-600 transition-colors"
                    title="View"
                    onClick={() => console.log("View cost", c)}
                  >
                    <MdOutlineRemoveRedEye size={20} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit"
                    onClick={() => handleEdit(c)}
                  >
                    <MdOutlineModeEdit size={20} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                    onClick={() => handleDelete(c)}
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

      {/* ---------- Modal ---------- */}
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
