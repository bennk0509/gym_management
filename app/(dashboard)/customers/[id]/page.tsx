"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, User, Phone, Mail, Calendar, DollarSign, Activity } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Card from "@/components/Card";
import DataTable from "@/components/DataTable";
import { apiGet } from "@/lib/api";
import { CustomerDetail } from "@/types/types";


export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchCustomer() {
      try {
        setLoading(true);
        const data = await apiGet(`/customers/${id}`);
        setCustomer(data);
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
  if (error || !customer) {
    return (
      <div className="p-10 text-center text-gray-500">
        {error || "Customer not found."}
      </div>
    );
  }

  const totalSessions = customer.stats.totalSessions;
  const completedSessions = customer.stats.completedSessions;
  const totalSpent = customer.stats.totalSpent;
  const lastPaymentDate = customer.stats.lastPayment
    ? new Date(customer.stats.lastPayment.date).toLocaleDateString()
    : "N/A";

  return (
    <div className="p-10 space-y-8 h-screen">
      {/* Header */}
      <DashboardHeader
          title={`${customer.fullName}`}
          buttonText="← Back to Customers"
          onButtonClick={() => router.push("/customers")}
        />

      {/* Customer Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-100 text-brand-700 rounded-full p-4">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-brand-primary">
                {customer.fullName}
              </h2>
              <p className="text-gray-500 capitalize">{customer.dob
                  ? new Date(customer.dob).toLocaleDateString()
                  : "No DOB"}</p>
            </div>
          </div>

          <div className="space-y-1 text-gray-700">
            <p className="flex items-center gap-2">
              <Mail size={18} className="text-gray-400" /> {customer.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-gray-400" /> {customer.phone}
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" /> Joined{" "}
              {customer.joinDate
                ? new Date(customer.joinDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Sessions"
          number={totalSessions}
          icon={<Activity className="text-blue-600" />}
          date={new Date().toString()}
        />
        <Card
          title="Completed Sessions"
          number={completedSessions}
          icon={<Calendar className="text-green-600" />}
          date={new Date().toString()}
        />
        <Card
          title="Total Spent"
          prefix="$"
          number={totalSpent}
          icon={<DollarSign className="text-brand-700" />}
          date={new Date().toString()}
        />
        <Card
          title="Last Payment"
          number={0}
          icon={<Calendar className="text-gray-400" />}
          date={lastPaymentDate}
        />
      </div>

      {/* Session History */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-left text-brand-primary">
          Session History
        </h3>
        <DataTable
          data={customer.sessionHistory}
          loading = {loading}
          columns={[
            { key: "title", header: "Session Title" },
            { key: "type", header: "Type", render: (s) => s.type.toUpperCase() },
            {
              key: "date",
              header: "Date",
              render: (s) => new Date(s.date).toLocaleDateString(),
            },
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
            { key: "totalPrice", header: "Total ($)" },
          ]}
        />
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-left text-brand-primary">
          Payment History
        </h3>
        <DataTable
          data={customer.paymentHistory}
          loading = {loading}
          columns={[
            { key: "paymentType", header: "Type" },
            {
              key: "amount",
              header: "Amount ($)",
              render: (p) => `$${p.amount}`,
            },
            {
              key: "method",
              header: "Method",
              render: (p) => p.method.toUpperCase(),
            },
            {
              key: "status",
              header: "Status",
              render: (p) => (
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                    p.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : p.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.status}
                </span>
              ),
            },
            {
              key: "dateReceived",
              header: "Date",
              render: (p) => new Date(p.dateReceived).toLocaleDateString(),
            },
          ]}
        />
      </div>
    </div>
  );
}
