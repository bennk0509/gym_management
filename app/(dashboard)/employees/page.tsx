"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Activity, DollarSign, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  MdOutlineDeleteForever,
  MdOutlineModeEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import Card from "@/components/Card";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import AddNewEmployee from "@/components/AddNewEmployee";
import EmployeeSearchBar from "@/components/CustomerSearchBar"; 
import EmployeeFiltersPanel from "@/components/EmployeeFiltersPanel";
import { useDebounce } from "use-debounce";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { stat } from "fs";
import { Employee } from "@/types/types";
import { toast } from "sonner";

export default function Employees() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [hireStart, setHireStart] = useState("");
  const [hireEnd, setHireEnd] = useState(""); 
  const [role, setRole] = useState("");
  const [sortField, setSortField] = useState<"name" | "status" | "rate" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    avgSalary: 0,
  })
  async function loadEmployees() {
    try {
      setLoading(true);
      const queryObj: Record<string, string> = {};

      if (status && status !== "all") queryObj.status = status;
      if (query) queryObj.search = query;
      if (hireStart) queryObj.hireStart = hireStart;
      if (hireEnd) queryObj.hireEnd = hireEnd;
      if (role) queryObj.role = role;

      const queryParams = new URLSearchParams(queryObj).toString();
      const data = await apiGet(`/employees${queryParams ? `?${queryParams}` : ""}`);
      setEmployees(data);

      const statsData = await apiGet(`/employees/stats`);
      console.log(statsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadEmployees();
  }, [status, query, hireStart, hireEnd, role]);

  const {totalEmployees, activeEmployees, inactiveEmployees, avgSalary} = stats;


  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchQuery =
        fullName.includes(query.toLowerCase()) ||
        e.email.toLowerCase().includes(query.toLowerCase()) ||
        e.phone.includes(query);
      const matchStatus = status === "all" || e.status === status;
      const hireDate = new Date(e.hireDate);
      const matchHireStart = !hireStart || hireDate >= new Date(hireStart);
      const matchHireEnd = !hireEnd || hireDate <= new Date(hireEnd);
      const matchRole = !role || e.role === role;
      return matchQuery && matchStatus && matchHireStart && matchHireEnd && matchRole;
    });
  }, [employees, query, status, hireStart, hireEnd, role]);

  const handleSort = (field: "name" | "status" | "rate") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = useMemo(() => {
    const copy = [...filteredEmployees];
    return copy.sort((a, b) => {
      const fullA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const fullB = `${b.firstName} ${b.lastName}`.toLowerCase();

      if (sortField === "name") {
        return sortOrder === "asc"
          ? fullA.localeCompare(fullB)
          : fullB.localeCompare(fullA);
      }
      if (sortField === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortField === "rate") {
        return sortOrder === "asc"
          ? a.salary - b.salary
          : b.salary - a.salary;
      }
      return 0;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage);
  const paginatedEmployees = useMemo(() => {
    return sortedEmployees.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [sortedEmployees, currentPage]);

  const resetEverything = () => {
    setQuery("");
    setStatus("all");
    setHireStart("");
    setHireEnd("");
    setRole("");
    setSortField(null);
    setCurrentPage(1);
  };

  // 🔹 Handlers
  const handleSaveEmployee = async (employee: Employee) => {
    const confirmSave = window.confirm(
      `Are you sure you want to ${editEmployee ? "update" : "add"} this customer?`
    );
    console.log(employee)
    console.log(typeof employee.salary);
    if (!confirmSave) return;
    try{
      if (editEmployee) {
        await apiPut(`/employees/${editEmployee.id}`, employee);
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editEmployee.id ? { ...e, ...employee } : e
          )
        );
      } else {
        const tempId = `temp-${Date.now()}`;
        setEmployees(prev => [
          ...prev,
          { ...employee, id: tempId, status: "active", isSaving: true },
        ]);

        try {
          const savedEmployee = await apiPost(`/employees`, employee);

          // Replace temp record with real one
          setEmployees(prev =>
            prev.map(e =>
              e.id === tempId ? savedEmployee : e
            )
          );
        } catch (err) {
          setEmployees(prev => prev.filter(e => e.id !== tempId));
          throw err; // rethrow so outer catch handles toast
        }
      }

      // loadEmployees();
      toast(`Employee ${editEmployee ? "updated" : "added"} successfully.`);
    }
    catch (error: any) {
      const message = error?.message || "An unexpected error occurred while deleting the customer.";

            console.error("Delete failed:", error);
            toast.error(message);
    } finally {
      setShowModal(false);
      setEditEmployee(null);
    }
  };

  const handleClose = () => {
      setEditEmployee(null)
      setShowModal(false)
  }

  const handleDelete = async (employeeToDelete: Employee) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${employeeToDelete.firstName}"?`
    )
    if (!confirmDelete) return
    try {
        await apiDelete(`/employees/${employeeToDelete.id}`);
        setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
        toast.success("Employee deleted successfully");
    } catch (err: any) {
        const message = err?.message || "An unexpected error occurred while deleting the customer.";

        console.error("Delete failed:", err);
        toast.error(message);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
    setShowModal(true);
  };

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* Header */}
      <DashboardHeader
        title="Employee Dashboard"
        buttonText="+ Add Employee"
        onButtonClick={() => {
          setEditEmployee(null);
          setShowModal(true);
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Employees"
          number={totalEmployees}
          date = {new Date().toString()}
          icon={<Users className="text-blue-600" />}
          durationSec={1.2}
        />
        <Card
          title="Active"
          number={activeEmployees}
          date = {new Date().toString()}
          icon={<Activity className="text-green-600" />}
          durationSec={1.2}
        />
        <Card
          title="Inactive"
          number={inactiveEmployees}
          date = {new Date().toString()}
          icon={<UserMinus className="text-red-600" />}
          durationSec={1.2}
        />
        <Card
          title="Avg. Salary"
          number={avgSalary}
          date = {new Date().toString()}
          prefix="$"
          icon={<DollarSign className="text-brand-700" />}
          durationSec={1.2}
        />
      </div>
      <div className="bg-white w-full border border-gray-200  shadow-md rounded-xl text-center flex flex-col gap-2">
        <EmployeeSearchBar
          query={query}
          onChange={setQuery}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={resetEverything}
          showFilters={showFilters}
        />
        {showFilters && (
              <EmployeeFiltersPanel
              status={status}
              hireStart={hireStart}
              hireEnd={hireEnd}
              role={role}
              onStatusChange={setStatus}
              onHireStartChange={setHireStart}
              onHireEndChange={setHireEnd}
              onRoleChange={setRole}
            />
          )}
        {/* Data Table */}
        <DataTable
          data={paginatedEmployees}
          sortField={sortField}
          sortOrder={sortOrder}
          loading={loading}
          onSort={(field) => handleSort(field as any)}
          // onRowClick={(c) => {router.push(`/employees/${c.id}`)}}
          columns={[
            {
              key: "name",
              header: "Employee Name",
              sortable: true,
              render: (e) => (
                <span className="text-brand-primary font-semibold">
                  {e.firstName} {e.lastName}
                </span>
              ),
            },
            { key: "email", header: "Email" },
            { key: "phone", header: "Phone" },
            { key: "role", header: "Role" },
            { key: "specialization", header: "Specialization" },
            {
              key: "salary",
              header: "Salary",
              sortable: true,
              render: (e) => `$${e.salary}`,
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              render: (e) => (
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                    e.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {e.status}
                </span>
              ),
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
                      onClick={(e) =>
                      {
                          e.stopPropagation();
                          handleEdit(c)
                      } }
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <AddNewEmployee
          onClose={handleClose}
          onSave={handleSaveEmployee}
          initialData={editEmployee}
        />
      )}
    </div>
  );
}
