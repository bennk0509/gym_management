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
  Award,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Card from "@/components/Card";
import DataTable from "@/components/DataTable";
import {EmployeeDetail } from "@/types/types";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { em } from "framer-motion/client";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<EmployeeDetail | null> (null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchCustomer() {
      try {
        setLoading(true);
        const data = await apiGet(`/employees/${id}`);
        console.log(data);
        setEmployee(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading customer...</div>
    );
  }
  if (error || !employee) {
    return (
      <div className="p-10 text-center text-gray-500">
        {error || "Employee not found."}
      </div>
    );
  }

  // ---- PERFORMANCE METRICS ----
  const sessions = employee.sessionHistory
  const payrolls = employee.payrollHistory

  const {totalSessions, completedSessions, cancelledSessions ,totalRevenue} = employee.stats;
  const avgRating = 4.6; // mock rating until feedback data added

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* Header */}
      <DashboardHeader
        title={employee.fullName}
        buttonText="← Back to Employees"
        onButtonClick={() => {
          // const params = new URLSearchParams(window.location.search);
          // console.log(params.get("page"))
          // const page = params.get("page") || 1;
          // console.log(page);
          // router.push(`/customers?page=${page}`);
          router.back();
        }}
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
                {employee.fullName}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card
          title="Total Sessions"
          number={totalSessions}
          icon={<Activity className="text-blue-600" />}
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
        <Card
          title="Completed Sessions"
          number={completedSessions}
          icon={<Award className="text-green-700" />}
          date={new Date().toString()}
        />
        <Card
          title="Canceled Sessions"
          number={cancelledSessions}
          icon={<Activity className="text-red-500" />}
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
          loading={loading}
          columns={[
            { key: "title", header: "Session Title" },
            { key: "type", 
              header: "Type",
              render: (s) => (
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize ${
                  s.type === "gym"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {s.type}
              </span>
            ), },
            {
              key: "date",
              header: "Date",
              render: (s) => new Date(s.date).toLocaleDateString(),
            },
            { key: "customer", 
              header: "Customer ID",
              render: (s) => (
              <span>
                {s.customer.firstName} {s.customer.lastName}
              </span>
            ), },
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
          loading={loading}
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
