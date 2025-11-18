"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Package, ChevronLeft, Wallet, CreditCard, DollarSign, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardHeader from "@/components/DashboardHeader";

export default function BuyPackagePage() {
  const { id } = useParams();
  const router = useRouter();

  const mockPackageTypes = [
    { id: "gym", name: "Gym Package" },
    { id: "therapy", name: "Therapy Package" },
    { id: "combo", name: "Combo Gym + Therapy" },
    { id: "custom", name: "Custom Package (Tự nhập)" },
  ];

  const [packageType, setPackageType] = useState<string | null>(null);
  const [totalSessions, setTotalSessions] = useState("");
  const [pricePerSession, setPricePerSession] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Auto-calculation
  const totalPrice = useMemo(() => {
    const p = Number(pricePerSession);
    const s = Number(totalSessions);
    return p > 0 && s > 0 ? p * s : 0;
  }, [pricePerSession, totalSessions]);

  const isValid =
    packageType &&
    Number(totalSessions) > 0 &&
    Number(pricePerSession) > 0 &&
    paymentMethod;

  const handleConfirm = () => {
    setIsConfirmed(true); // Show summary screen
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("INVOICE / HOÁ ĐƠN", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Customer ID", `${id}`],
        ["Package Type", packageType],
        ["Total Sessions", totalSessions],
        ["Price / Session", `${Number(pricePerSession).toLocaleString()}₫`],
        ["Total Price", `${totalPrice.toLocaleString()}₫`],
        ["Payment Method", paymentMethod],
        ["Notes", notes || "None"],
      ],
    });

    doc.save(`invoice_customer_${id}.pdf`);
  };

  // After confirm: Show Summary + Download Invoice
  if (isConfirmed) {
    return (
      <div className="p-10 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-brand-primary">Purchase Summary</h1>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 space-y-2 text-gray-700">
          <p><b>Package Type:</b> {packageType}</p>
          <p><b>Total Sessions:</b> {totalSessions}</p>
          <p><b>Price / Session:</b> {Number(pricePerSession).toLocaleString()}₫</p>
          <p><b>Total Price:</b> {totalPrice.toLocaleString()}₫</p>
          <p><b>Payment Method:</b> {paymentMethod}</p>
          <p><b>Notes:</b> {notes || "None"}</p>
        </div>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2 rounded-lg hover:bg-brand-primary/90"
        >
          <FileDown size={18} /> Download Invoice (PDF)
        </button>

        <button
          onClick={() => router.push(`/customers/${id}`)}
          className="block text-brand-primary hover:text-brand-primary/70"
        >
          ← Back to Customer
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-8">
        <DashboardHeader
            title={`Sell Package to Customer #${id}`}
            buttonText="← Back to Customer"
            onButtonClick={() => router.push("/customers")}
        />
    {/* Package Type */}
    <div className="bg-white w-full shadow-md rounded-xl p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-brand-primary">Package Information</h2>
        <div className="flex flex-col gap-5 py-3">
            <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm">Package Name</p>
                <div className="flex flex-row gap-5 w-full">
                    <input
                    type="text"
                    placeholder="Last Name"
                    className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
                    />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-5 py-3">
            <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm">Package Type</p>
                <div className="flex flex-row gap-5 w-full">
                    <select
                    className={`appearance-none p-2 border rounded-md border-neutral-300 text-sm text-brand-primary bg-white pr-8`}
                    >
                    <option value="active">Gym</option>
                    <option value="inactive">Theraphy</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

      {/* Sessions & Price */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Total Sessions</label>
          <input
            type="number"
            value={totalSessions}
            onChange={(e) => setTotalSessions(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-primary outline-none"
            placeholder="Ví dụ: 12"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Price per Session (VNĐ)</label>
          <input
            type="number"
            value={pricePerSession}
            onChange={(e) => setPricePerSession(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-primary outline-none"
            placeholder="Ví dụ: 120000"
          />
        </div>

        <div className="sm:col-span-2 text-right text-lg font-semibold text-brand-primary">
          Total: {totalPrice.toLocaleString()}₫
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-brand-primary">Payment Method</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              paymentMethod === "cash" ? "border-brand-primary bg-brand-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Wallet size={18} /> Cash
          </button>

          <button
            onClick={() => setPaymentMethod("bank")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              paymentMethod === "bank" ? "border-brand-primary bg-brand-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <CreditCard size={18} /> Bank Transfer
          </button>

          <button
            onClick={() => setPaymentMethod("momo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              paymentMethod === "momo" ? "border-brand-primary bg-brand-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <DollarSign size={18} /> Momo
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-2">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-primary outline-none"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ví dụ: Thanh toán trước, tặng thêm 1 buổi..."
        />
      </div>

      {/* Confirm */}
      <div className="flex justify-end">
        <button
          disabled={!isValid}
          onClick={handleConfirm}
          className={`px-6 py-2 rounded-md font-semibold text-white ${
            isValid ? "bg-brand-primary hover:bg-brand-primary/90" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm Purchase
        </button>
      </div>
    </div>
  );
}
