"use client";

import { useMemo, useState } from "react";
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
import { Employee, mockEmployees } from "@/data/sessions";
import EmployeeSearchBar from "@/components/CustomerSearchBar"; 
import EmployeeFiltersPanel from "@/components/EmployeeFiltersPanel";

export default function Employees() {
  const router = useRouter();
  // 🔹 State
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
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
  const currentDate = new Date();

  // 🔹 Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "inactive"
  ).length;

  const avgHourlyRate = useMemo(() => {
    const avg =
      employees.reduce((sum, e) => sum + e.salary, 0) / employees.length;
    return Math.round(avg);
  }, [employees]);

  // 🔹 Search filter
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
  const handleSaveEmployee = (employee: Employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === employee.id);
      if (exists) {
        return prev.map((e) => (e.id === employee.id ? employee : e));
      }
      return [
        ...prev,
        {
          ...employee,
          id: `e${Date.now()}`,
          status: "active",
        },
      ];
    });
    setShowModal(false);
    setEditEmployee(null);
  };

  const handleDelete = (employeeToDelete: Employee) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${employeeToDelete.firstName}"?`
    )
    if (!confirmDelete) return
    setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
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
          title="Avg. Hourly Rate"
          number={avgHourlyRate}
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
          onSort={(field) => handleSort(field as any)}
          onRowClick={(c) => {router.push(`/employees/${c.id}`)}}
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <AddNewEmployee
          onClose={() => {
            setShowModal(false);
            setEditEmployee(null);
          }}
          onSave={handleSaveEmployee}
          initialData={editEmployee}
        />
      )}
    </div>
  );
}
