"use client"

export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { Users, Activity, DollarSign, UserMinus } from "lucide-react"
import { MdOutlineDeleteForever, MdOutlineModeEdit, MdOutlineRemoveRedEye} from "react-icons/md";
import Card from "@/components/Card"
import DashboardHeader from "@/components/DashboardHeader";
import CustomerSearchBar from "@/components/CustomerSearchBar";
import FiltersPanel from "@/components/FilterPanel";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import AddNewCustomer from "@/components/AddNewCustomer";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import {Customer} from "@/types/types";
import {useDebounce} from "use-debounce"
import { toast } from "sonner";

export default function Customers() {
    const router = useRouter();
    const [query, setQuery]             = useState("")
    const rowsPerPage                   = 10
    const [sortField, setSortField] = useState<string>("joinDate");
    const [sortOrder, setSortOrder]     = useState<"asc" | "desc">("asc")
    const [status, setStatus]           = useState<"all" | "active" | "inactive">("all")
    const currentDate                   = new Date()
    const [showFilters, setShowFilters] = useState(false)
    const [joinStart, setJoinStart] = useState("")
    const [joinEnd, setJoinEnd] = useState("")
    const [minSpend, setMinSpend] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [editCustomer, setEditCustomer] = useState<Customer|null>(null)
    const [debouncedMinSpend] = useDebounce(minSpend, 500);
    const [debouncedQuery] = useDebounce(query, 400);
    const [currentPage, setCurrentPage] = useState(1);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        page: 1,
    });
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        avgSpending: 0,
    });
    const [loading, setLoading] = useState(true);
    async function fetchData() {
        try {
          setLoading(true);
          const queryObj: Record<string, string> = {};

          if (status && status !== "all") queryObj.status = status;
          if (query) queryObj.search = debouncedQuery;
          if (joinStart) queryObj.joinStart = joinStart;
          if (joinEnd) queryObj.joinEnd = joinEnd;
          if (minSpend) queryObj.minSpend = debouncedMinSpend.toString();

          queryObj.page = currentPage.toString();
          queryObj.take = rowsPerPage.toString();
          queryObj.sort = sortField || "joinDate";
          queryObj.order = sortOrder;

          const queryParams = new URLSearchParams(queryObj);
  
          const customerData = await apiGet(`/customers?${queryParams.toString()}`);
  
          setCustomers(customerData.data);
          setPagination(customerData.pagination);
  
          const statsData = await apiGet(`/customers/stats`);
          setStats(statsData);
        } catch (err) {
          console.error("Failed to load customers:", err);
        } finally {
          setLoading(false);
        }
    }
    useEffect(() => {
        console.log(customers);
    
        fetchData();
      }, [status, debouncedQuery, joinStart, joinEnd, debouncedMinSpend, currentPage, sortField, sortOrder]);
    

    const { totalCustomers, activeCustomers, inactiveCustomers, avgSpending } =stats;
    const resetEverything = () =>
    {
        setCurrentPage(1)
        setSortField("")
        setJoinStart("")
        setJoinEnd("")
        setMinSpend(0)
        setQuery("")
        setStatus("all")
    }
    const handlePageChange = (page: number) => {
        if (page < 1 || page > pagination.totalPages) return;
        setCurrentPage(page);
        router.push(`/customers?page=${page}`, { scroll: false });
    };

    const handleClose = () => {
        setEditCustomer(null)
        setShowModal(false)
    }
    const handleSaveCustomer = async (customer: Customer) => {
        const confirmSave = window.confirm(
          `Are you sure you want to ${editCustomer ? "update" : "add"} this customer?`
        );
        if (!confirmSave) return;
        try {
          if (editCustomer) {
            // PUT request for update
            await apiPut(
              `/customers/${editCustomer.id}`,
              customer
            );
            await fetchData();
          } else {
            // POST request for new customer
            await apiPost(`/customers`, customer);
            await fetchData();
          }
          toast(`Customer ${editCustomer ? "updated" : "added"} successfully.`);
        } catch (err: any) {
            const message = err?.message || "An unexpected error occurred while deleting the customer.";

            console.error("Delete failed:", err);
            toast.error(message);
        } finally {
          setShowModal(false);
          setEditCustomer(null);
        }
    };


    const handleEdit = (customer: Customer) => {
        setEditCustomer(customer);
        setShowModal(true);
    };

    const handleDeleteCustomer = async (customerToDelete: Customer) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${customerToDelete.firstName}"?`
        );
        if (!confirmDelete) return;
        
        try {
            await apiDelete(`/customers/${customerToDelete.id}`);
            await fetchData();
            setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
            toast.success("Customer deleted successfully");
        } catch (err: any) {
            const message = err?.message || "An unexpected error occurred while deleting the customer.";

            console.error("Delete failed:", err);
            toast.error(message);
        }
    };
    const handleSort = (field: string) => {
        if (sortField === field) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortField(field);
          setSortOrder("asc");
        }
      };

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
                    number = {avgSpending}
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
                    data={customers.map((c, i) => ({
                        ...c,
                        id: c.id ?? `temp-${i}`, // fallback ID
                    }))}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={(field) => handleSort(field as any)}
                    // onRowClick={(row) => router.push(`/customers/${row.id}`)}
                    loading = {loading}
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
                        { key: "dateOfBirth",
                            header: "DOB",
                            render: (c) => {
                              if (!c.dateOfBirth) return "—";
                              const date = new Date(c.dateOfBirth);
                              return date.toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              });
                            }, 
                        },
                        {
                        key: "status",
                        header: "Status",
                        sortable: true,
                        render: (c) => (
                            <span
                            className={`text-xs px-2 py-1 rounded-full capitalize text-brand-primary ${
                                c.status === "active" ? "bg-sucess text-green-100" : "bg-error text-red-100"
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
                        render: (c) => `$${c.totalSpent || 0}`,
                        },
                        {
                        key: "actions",
                        header: "Actions",
                        render: (c) => (
                            <div className="flex gap-3">
                                <button
                                    className="text-gray-400 hover:text-brand-600 transition-colors"
                                    title="View"
                                    onClick={() => router.push(`/customers/${c.id}?page=${currentPage}`)}
                                >
                                    <MdOutlineRemoveRedEye size={20} />
                                </button>
                                <button
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                    title="Edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(c)}}
                                >
                                    <MdOutlineModeEdit size={20} />
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                    onClick={(e) =>
                                        {
                                            e.stopPropagation();
                                            handleDeleteCustomer(c)
                                        } }
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
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
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
