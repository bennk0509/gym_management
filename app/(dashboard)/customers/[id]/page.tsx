"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Phone, Mail, Calendar, DollarSign, Activity } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Card from "@/components/Card";
import DataTable from "@/components/DataTable";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api";
import { CustomerDetail, Packages } from "@/types/types";
import AddNewPackage from "@/components/AddNewPackage";
import { Employee } from "@/data/sessions";
import { MdOutlineDeleteForever, MdOutlineRemoveRedEye } from "react-icons/md";


export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [trainers, setTrainers] = useState<Employee[]> ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditPackageModal, setShowEditPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Packages | null>(null);
  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      const [customerData, trainersData] = await Promise.all([
        apiGet(`/customers/${id}`),
        apiGet(`/employees/`)
      ]);

      setCustomer(customerData);
      setTrainers(trainersData);

    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  if (id) fetchData();
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
  function handleEditPackage(pkg) {
    setEditingPackage(pkg);
    setShowEditPackageModal(true);
  }

  async function handleDeletePackage(id) {
    const confirmDelete = confirm("Are you sure you want to delete this package?");
    if (!confirmDelete) return;

    try {
      await apiDelete(`/packages/${id}`);

      setCustomer(prev =>
        prev
          ? {
              ...prev,
              packages: prev.packages.filter(p => p.id !== id),
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to delete package", err);
    }
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
          buttonText="Back to Customers"
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
      {/* Packages */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-brand-primary">Packages</h3>

          <button
            onClick={() => setShowEditPackageModal(true)}
            className="px-3 py-1.5 rounded-md bg-accent-primary text-brand-primary font-bold text-sm hover:bg-accent-primary/80"
          >
            Sell Package
          </button>
        </div>

        {customer.packages.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No packages purchased yet.</p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-max">
              {customer.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="
                    w-72 shrink-0 
                    bg-white 
                    shadow-md 
                    rounded-xl 
                    p-5 
                    flex flex-col 
                    gap-4 
                    border 
                    border-gray-100
                    hover:shadow-lg 
                    hover:-translate-y-1 
                    transition-all 
                    duration-200
                  "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-brand-primary text-lg">{pkg.name}</h4>

                    {/* Status Badge */}
                    <span
                      className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${
                          pkg.status === "USED"
                            ? "bg-red-100 text-red-600"
                            : pkg.status === "EXPRIRED"
                            ? "bg-gray-200 text-gray-600"
                            : pkg.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Total Sessions:</span>{" "}
                      {pkg.totalSessions}
                    </p>

                   <p
                      className={`font-medium ${
                        (pkg.remaining ?? 0) > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      Remaining: {pkg.remaining ?? 0}
                    </p>

                    <p className="text-xs text-gray-400">
                      Purchased: {new Date(pkg.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-4 pt-2 border-t border-gray-100">
                    <button
                      className="text-gray-400 hover:text-brand-primary transition-colors"
                      title="View"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <MdOutlineRemoveRedEye size={20} />
                    </button>


                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <MdOutlineDeleteForever size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
      {showEditPackageModal && (
        <AddNewPackage
          onClose={() => {
            setShowEditPackageModal(false);
            setEditingPackage(null);
          }}
          initialData={editingPackage}
          customerId={customer.id}
          trainers={trainers}
          onSave={async (pkgInput) => {
            try {
              if (editingPackage) {
                const updated = await apiPatch(`/packages/${editingPackage.id}`, pkgInput);
                setCustomer(prev =>
                  prev
                    ? {
                        ...prev,
                        packages: prev.packages.map(p =>
                          p.id === updated.id ? updated : p
                        ),
                      }
                    : prev
                );
              } else {
                // CREATE
                const created = await apiPost("/packages", pkgInput);
                setCustomer(prev =>
                  prev
                    ? {
                        ...prev,
                        packages: [...prev.packages, created],
                      }
                    : prev
                );
              }
              setShowEditPackageModal(false);
              setEditingPackage(null);
            } catch (err) {
              console.error("Error saving package", err);
            }
          }}
        />
      )}

    </div>
  );
}
