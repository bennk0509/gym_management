"use client"

import { useState, useMemo } from "react"
import { RiExpandUpDownLine } from "react-icons/ri"
import { DollarSign, Wallet, Clock, BarChart2 } from "lucide-react"
import { MdOutlineRemoveRedEye, MdOutlineDeleteForever, MdOutlineModeEdit } from "react-icons/md"
import { Payroll, mockPayrolls, mockEmployees } from "@/data/sessions"
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader"
import DataTable from "@/components/DataTable"
import Pagination from "@/components/Pagination"
import AddNewPayroll from "@/components/AddNewPayroll"

export default function Payrolls() {
    const [payrolls, setPayrolls] = useState<Payroll[]>(mockPayrolls)
    // Pagination and sorting 
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 10
    const totalPages = Math.ceil(payrolls.length / rowsPerPage)
    const [sortField, setSortField] = useState<keyof Payroll | null>(null)
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    // Filters
    const [month, setMonth] = useState("2025-10")
    const [status, setStatus] = useState<Payroll["status"] | "all">("all")
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState<Payroll | null>(null)

    // Derived stats
    const currentDate = new Date()

    const filteredPayrolls = useMemo(() => {
        return payrolls.filter((p) => {
        const matchMonth = p.period === month
        const matchStatus = status === "all" || p.status === status
        return matchMonth && matchStatus
        })
    }, [month, status])

    const sortedPayrolls = useMemo(() => {
        const copy = [...filteredPayrolls]
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
    }, [filteredPayrolls, sortField, sortOrder])

    const paginatedPayrolls = useMemo(() => {
        return sortedPayrolls.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
        )
    }, [sortedPayrolls, currentPage, rowsPerPage])

    // Stats summary
    const totalPayroll = useMemo(
        () => payrolls.reduce((sum, p) => sum + p.netSalary, 0),
        []
    )
    const totalPaid = payrolls.filter((p) => p.status === "paid").length
    const totalPending = payrolls.filter((p) => p.status === "pending").length
    const avgSalary = Math.round(
        payrolls.reduce((sum, p) => sum + p.baseSalary, 0) / payrolls.length
    )
    const totalBonuses = payrolls.reduce((sum, p) => sum + (p.bonuses || 0), 0)

    // Sorting handler
    const handleSort = (field: keyof Payroll) => {
        if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
        setSortField(field)
        setSortOrder("asc")
        }
    }

    const resetFilters = () => {
        setMonth("2025-10")
        setStatus("all")
    }

    const handleDelete = (p: Payroll) => {
        const confirmDelete = window.confirm(`Delete payroll for ${p.employeeId}?`)
        if (!confirmDelete) return
        alert("Mock delete — frontend only")
    }
    const handleEdit = (p: Payroll) => {
        setEditItem(p)
        setShowModal(true)
      }

    const findEmployeeName = (id: string) => {
        const emp = mockEmployees.find((e) => e.id === id)
        return emp ? `${emp.firstName} ${emp.lastName}` : "Unknown"
    }

    return (
        <div className="p-10 space-y-8 h-screen">
        {/* ---------- Header ---------- */}
        <DashboardHeader
            title="Payroll Dashboard"
            buttonText="+ Add Payroll Record"
            onButtonClick={() => {setShowModal(true)}}
        />

        {/* ---------- Summary Cards ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
            title="Total Payroll Cost"
            number={totalPayroll}
            prefix="$"
            durationSec={1.6}
            date={currentDate.toString()}
            icon={<DollarSign className="text-green-600" />}
            />
            <Card
            title="Paid Payrolls"
            number={totalPaid}
            durationSec={1.6}
            date={currentDate.toString()}
            icon={<Wallet className="text-blue-600" />}
            />
            <Card
            title="Pending Payrolls"
            number={totalPending}
            durationSec={1.6}
            date={currentDate.toString()}
            icon={<Clock className="text-yellow-600" />}
            />
            <Card
            title="Total Bonuses"
            number={totalBonuses}
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
                <label className="text-sm font-medium text-gray-600 block">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="all">All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                </select>
                </div>
            </div>
            <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 transition"
            >
                Reset
            </button>
            </div>

            {/* Data Table */}
            <DataTable
            data={paginatedPayrolls}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field) => handleSort(field as keyof Payroll)}
            columns={[
                {
                key: "employeeId",
                header: "Employee",
                sortable: true,
                render: (p: Payroll) => (
                    <span className="text-brand-primary font-semibold">
                    {findEmployeeName(p.employeeId)}
                    </span>
                ),
                },
                {
                key: "period",
                header: "Period",
                sortable: true,
                render: (p: Payroll) => <span>{p.period}</span>,
                },
                {
                key: "baseSalary",
                header: "Base Salary",
                sortable: true,
                render: (p: Payroll) => <span>${p.baseSalary}</span>,
                },
                {
                key: "bonuses",
                header: "Bonuses",
                sortable: true,
                render: (p: Payroll) => <span>${p.bonuses || 0}</span>,
                },
                {
                key: "deductions",
                header: "Deductions",
                sortable: true,
                render: (p: Payroll) => <span>${p.deductions || 0}</span>,
                },
                {
                key: "netSalary",
                header: "Net Salary",
                sortable: true,
                render: (p: Payroll) => (
                    <span className="font-semibold text-green-700">${p.netSalary}</span>
                ),
                },
                {
                key: "status",
                header: "Status",
                sortable: true,
                render: (p: Payroll) => (
                    <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                        p.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                    >
                    {p.status}
                    </span>
                ),
                },
                {
                key: "paidDate",
                header: "Paid Date",
                render: (p: Payroll) => p.paidDate || "-",
                },
                {
                key: "actions",
                header: "Actions",
                render: (p: Payroll) => (
                    <div className="flex gap-3">
                    <button
                        className="text-gray-400 hover:text-brand-600 transition-colors"
                        title="View"
                        onClick={() => console.log("View payroll", p)}
                    >
                        <MdOutlineRemoveRedEye size={20} />
                    </button>
                    <button
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit"
                        onClick={() => handleEdit(p)}
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
        {showModal &&
            <AddNewPayroll
                    onClose={() => setShowModal(false)}
                    onSave={(newPayroll) => {
                        setPayrolls((prev) => [...prev, newPayroll])
                        setShowModal(false)
                    }}
                    initialData={editItem}
                />}
        </div>
  )
}
