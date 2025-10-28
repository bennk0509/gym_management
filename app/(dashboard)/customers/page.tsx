"use client"

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react"
import { RiArrowDownSLine, RiExpandUpDownLine } from "react-icons/ri";
import { Customer, mockCustomers, mockSessions } from "@/data/sessions"
import { Users, Activity, DollarSign, UserMinus, Search } from "lucide-react"
import { MdCalendarMonth, MdFilterAlt, MdOutlineDeleteForever, MdOutlineModeEdit, MdOutlineRemoveRedEye, MdOutlineSettingsInputComponent, MdRefresh } from "react-icons/md";
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader";
import CustomerSearchBar from "@/components/CustomerSearchBar";
import FiltersPanel from "@/components/FilterPanel";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import AddNewCustomer from "@/components/AddNewCustomer";

export default function Customers() {
    const router = useRouter();
    const [query, setQuery]             = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage                   = 10
    const totalPages                    = Math.ceil(mockCustomers.length / rowsPerPage)
    const [sortField, setSortField]     = useState<"name" | "status" | "total" | null>(null)
    const [sortOrder, setSortOrder]     = useState<"asc" | "desc">("asc")
    const [status, setStatus]           = useState<"all" | "active" | "inactive">("all")
    const currentDate                   = new Date()
    const [showFilters, setShowFilters] = useState(false)
    const [joinStart, setJoinStart] = useState("")
    const [joinEnd, setJoinEnd] = useState("")
    const [minSpend, setMinSpend] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [editCustomer, setEditCustomer] = useState<Customer|null>(null)
    const [customers, setCustomer] = useState<Customer[]>(mockCustomers);

    // Calculate dashboard stats
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === "active").length
    const inactiveCustomers = customers.filter(c => c.status === "inactive").length

    const avgSpent = useMemo(() => {
        const totals = customers.map((c) => {
          const fullName = `${c.firstName} ${c.lastName}`;
          const sessions = mockSessions.filter((s) => s.customer === fullName);
          return sessions
            .filter((s) => s.status !== "cancel")
            .reduce((sum, s) => sum + s.totalPrice, 0);
        });
        return totals.length
          ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
          : 0;
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
          const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
          const matchQuery =
            fullName.includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query);
    
          const matchStatus = status === "all" || customer.status === status;
    
          const joinDate = new Date(customer.joinDate || new Date());
          const matchJoinStart = !joinStart || joinDate >= new Date(joinStart);
          const matchJoinEnd = !joinEnd || joinDate <= new Date(joinEnd);
    
          const totalSpent = mockSessions
            .filter(
              (s) =>
                s.customer === `${customer.firstName} ${customer.lastName}` &&
                s.status !== "cancel"
            )
            .reduce((sum, s) => sum + s.totalPrice, 0);
    
          const matchSpend = totalSpent >= minSpend;
    
          return matchQuery && matchStatus && matchJoinStart && matchJoinEnd && matchSpend;
        });
      }, [customers, query, status, joinStart, joinEnd, minSpend]);
      
    const handleSort = (field: "name" | "status" | "total") => {
        if (sortField === field) {
            // same field → toggle asc/desc
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            // new field → reset to ascending
            setSortField(field)
            setSortOrder("asc")
        }
    }
    const sortedCustomers = useMemo(() => {
        const customersCopy = [...filteredCustomers]
      
        return customersCopy.sort((a, b) => {
          const fullA = `${a.firstName} ${a.lastName}`.toLowerCase()
          const fullB = `${b.firstName} ${b.lastName}`.toLowerCase()
      
          if (sortField === "name") {
            return sortOrder === "asc"
              ? fullA.localeCompare(fullB)
              : fullB.localeCompare(fullA)
          }
      
          if (sortField === "status") {
            return sortOrder === "asc"
              ? a.status.localeCompare(b.status)
              : b.status.localeCompare(a.status)
          }
      
          if (sortField === "total") {
            const totalA = mockSessions
              .filter(
                (s) => s.customer === `${a.firstName} ${a.lastName}` && s.status !== "cancel"
              )
              .reduce((sum, s) => sum + s.totalPrice, 0)
            const totalB = mockSessions
              .filter(
                (s) => s.customer === `${b.firstName} ${b.lastName}` && s.status !== "cancel"
              )
              .reduce((sum, s) => sum + s.totalPrice, 0)
            return sortOrder === "asc" ? totalA - totalB : totalB - totalA
          }
      
          return 0
        })
    }, [filteredCustomers, sortField, sortOrder])

    const paginatedCustomers = useMemo(() => {
        return sortedCustomers.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        )
    }, [sortedCustomers, currentPage, rowsPerPage])
    const resetEverything = () =>
    {
        setCurrentPage(1)
        setSortField(null)
        setJoinStart("")
        setJoinEnd("")
        setMinSpend(0)
        setQuery("")
        setStatus("all")
    }

    const handleClose = () => {
        setEditCustomer(null)
        setShowModal(false)
    }
    const handleSaveCustomer = (customer: Customer) => {
        setCustomer((prev) => {
          const exists = prev.some((c) => c.id === customer.id);
      
          if (exists) {
            // 🔹 Edit mode: replace existing customer
            return prev.map((c) => (c.id === customer.id ? customer : c));
          }
      
          // 🔹 New customer mode: generate new record
          const newCustomer: Customer = {
            ...customer,
            id: `c${Date.now()}`, // unique ID
            joinDate: new Date().toISOString().split("T")[0], // today's date
            status: "active",
          };
      
          return [...prev, newCustomer];
        });
      
        // ✅ Close modal afterward
        setEditCustomer(null);
        setShowModal(false);
    };

    const handleEdit = (customer: Customer) => {
        setEditCustomer(customer);
        setShowModal(true);
    };

    const handleDeleteCustomer = (customerToDelete: Customer) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${customerToDelete.firstName}"?`
        )
        if (!confirmDelete) return
        setCustomer((prev) => prev.filter((c) => c.id !== customerToDelete.id));
    }

    return (
        <div className="p-10 space-y-8 h-screen">
            {/* Header */}
            <DashboardHeader
                title="Customer Dashboard"
                buttonText="+ Add Customer"
                onButtonClick={() => {setShowModal(true)}}
            />
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                    title = "Total Customer"
                    number = {totalCustomers}
                    date = {currentDate.toString()}
                    durationSec={1.6} 
                    icon = {<Users className="text-blue-600" />}
                />
                <Card
                    title = "Active Customers"
                    number = {activeCustomers}
                    date = {currentDate.toString()}
                    durationSec={1.6} 
                    icon = {<Activity className="text-green-600" />}
                />
                <Card
                    title = "Inactive Customers"
                    number = {inactiveCustomers}
                    date = {currentDate.toString()}
                    durationSec={1.6} 
                    icon = {<UserMinus className="text-red-600" />}
                />
                <Card
                    title = "Avg. Spending"
                    number = {avgSpent}
                    date = {currentDate.toString()}
                    durationSec={1.6} 
                    prefix="$"
                    icon = {<DollarSign className="text-brand-700" />}
                />
            </div>
            <div className="bg-white w-full border border-gray-200  shadow-md rounded-xl text-center flex flex-col gap-2">
                {/* Filter and Search Bar */}
                <CustomerSearchBar
                    query={query}
                    onChange={setQuery}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onRefresh={resetEverything}
                    showFilters={showFilters}
                />
                {showFilters && (
                    <FiltersPanel
                        status={status}
                        joinStart={joinStart}
                        joinEnd={joinEnd}
                        minSpend={minSpend}
                        onStatusChange={setStatus}
                        onJoinStartChange={setJoinStart}
                        onJoinEndChange={setJoinEnd}
                        onMinSpendChange={setMinSpend}
                    />
                )}
                <DataTable
                    data={paginatedCustomers}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={(field) => handleSort(field as any)}
                    onRowClick={(row) => router.push(`/customers/${row.id}`)}
                    columns={[
                        {
                        key: "name",
                        header: "Customer Name",
                        sortable: true,
                        render: (c) => (
                            <span className="text-brand-primary font-semibold">
                            {c.firstName} {c.lastName}
                            </span>
                        ),
                        },
                        { key: "email", header: "Email" },
                        { key: "phone", header: "Phone" },
                        { key: "dateOfBirth", header: "DOB" },
                        {
                        key: "status",
                        header: "Status",
                        sortable: true,
                        render: (c) => (
                            <span
                            className={`text-xs px-2 py-1 rounded-full capitalize text-brand-primary ${
                                c.status === "active" ? "bg-sucess" : "bg-error"
                            }`}
                            >
                            {c.status}
                            </span>
                        ),
                        },
                        {
                        key: "totalSpent",
                        header: "Total Spent",
                        sortable: true,
                        render: (c) => {
                            const fullName = `${c.firstName} ${c.lastName}`
                            const sessions = mockSessions.filter((s) => s.customer === fullName)
                            const total = sessions
                            .filter((s) => s.status !== "cancel")
                            .reduce((sum, s) => sum + s.totalPrice, 0)
                            return `$${total}`
                        },
                        },
                        {
                        key: "actions",
                        header: "Actions",
                        render: (c) => (
                            <div className="flex gap-3">
                            <button
                                className="text-gray-400 hover:text-brand-600 transition-colors"
                                title="View"
                                onClick={() => router.push(`/employees/${c.id}`)}
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
                                onClick={() => handleDeleteCustomer(c)}
                            >
                                <MdOutlineDeleteForever size={20} />
                            </button>
                            </div>
                        ),
                        },
                    ]}
                />
                {/* Pagination Controls */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            {showModal && <AddNewCustomer
                onClose={handleClose}
                onSave={handleSaveCustomer}
                initialData={editCustomer} 
            />}
        </div>
        
    )
}
