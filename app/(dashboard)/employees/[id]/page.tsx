"use client";

import { useParams, useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Activity,
  Star,
  Users,
  Award,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Card from "@/components/Card";
import DataTable from "@/components/DataTable";
import {
  mockEmployees,
  mockSessions,
  mockPayrolls,
  mockCustomers,
} from "@/data/sessions";
import { Session, Payroll } from "@/data/sessions";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const employee = mockEmployees.find((e) => e.id === id);
  const sessions = mockSessions.filter((s) => s.employee === employee?.firstName + " " + employee?.lastName);
  const payrolls = mockPayrolls.filter((p) => p.employeeId === id);

  if (!employee) {
    return (
      <div className="p-10 text-center text-gray-500">Employee not found.</div>
    );
  }

  // ---- PERFORMANCE METRICS ----
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === "done").length;
  const canceledSessions = sessions.filter((s) => s.status === "cancel").length;
  const totalRevenue = sessions.reduce((sum, s) => sum + s.totalPrice, 0);
  const avgRevenuePerSession =
    totalSessions > 0 ? Math.round(totalRevenue / totalSessions) : 0;

  const activeCustomers = new Set(
    sessions.filter((s) => s.status === "done").map((s) => s.customer)
  ).size;

  const avgRating = 4.6; // mock rating until feedback data added

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* Header */}
      <DashboardHeader
        title={`${employee.firstName} ${employee.lastName}`}
        buttonText="← Back to Employees"
        onButtonClick={() => router.push("/employees")}
      />

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-100 text-brand-700 rounded-full p-4">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-brand-primary">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-gray-500 capitalize">{employee.role}</p>
            </div>
          </div>

          <div className="space-y-1 text-gray-700">
            <p className="flex items-center gap-2">
              <Mail size={18} className="text-gray-400" /> {employee.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-gray-400" /> {employee.phone}
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" /> Hired on{" "}
              {new Date(employee.hireDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* PERFORMANCE STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Sessions"
          number={totalSessions}
          icon={<Activity className="text-blue-600" />}
          date={new Date().toString()}
        />
        <Card
          title="Active Customers"
          number={activeCustomers}
          icon={<Users className="text-green-600" />}
          date={new Date().toString()}
        />
        <Card
          title="Total Revenue"
          prefix="$"
          number={totalRevenue}
          icon={<DollarSign className="text-brand-700" />}
          date={new Date().toString()}
        />
        <Card
          title="Average Rating"
          number={avgRating}
          icon={<Star className="text-yellow-500" />}
          date={new Date().toString()}
        />
      </div>

      {/* ADDITIONAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Completed Sessions"
          number={completedSessions}
          icon={<Award className="text-green-700" />}
          date={new Date().toString()}
        />
        <Card
          title="Canceled Sessions"
          number={canceledSessions}
          icon={<Activity className="text-red-500" />}
          date={new Date().toString()}
        />
        <Card
          title="Avg. Revenue per Session"
          prefix="$"
          number={avgRevenuePerSession}
          icon={<DollarSign className="text-brand-700" />}
          date={new Date().toString()}
        />
      </div>

      {/* SESSION HISTORY */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-left text-brand-primary">
          Session History
        </h3>
        <DataTable
          data={sessions}
          columns={[
            { key: "title", header: "Session Title" },
            { key: "type", header: "Type" },
            {
              key: "date",
              header: "Date",
              render: (s) => new Date(s.date).toLocaleDateString(),
            },
            { key: "customer", header: "Customer ID" },
            {
              key: "status",
              header: "Status",
              render: (s) => (
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                    s.status === "done"
                      ? "bg-green-100 text-green-700"
                      : s.status === "cancel"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {s.status}
                </span>
              ),
            },
            {
              key: "totalPrice",
              header: "Earnings ($)",
              render: (s) => `$${s.totalPrice}`,
            },
          ]}
        />
      </div>

      {/* PAYROLL HISTORY */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-left text-brand-primary">
          Payroll History
        </h3>
        <DataTable
          data={payrolls}
          columns={[
            { key: "period", header: "Period (YYYY-MM)" },
            {
              key: "baseSalary",
              header: "Base Salary ($)",
              render: (p) => `$${p.baseSalary}`,
            },
            {
              key: "bonuses",
              header: "Bonuses ($)",
              render: (p) => `$${p.bonuses || 0}`,
            },
            {
              key: "deductions",
              header: "Deductions ($)",
              render: (p) => `$${p.deductions || 0}`,
            },
            {
              key: "netSalary",
              header: "Net Salary ($)",
              render: (p) => `$${p.netSalary}`,
            },
            {
              key: "status",
              header: "Status",
              render: (p) => (
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
          ]}
        />
      </div>
    </div>
  );
}
