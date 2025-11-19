"use client"

import { useEffect, useState } from "react"
import { CreditCard, User, CalendarDays, DollarSign, Dumbbell, Clock } from "lucide-react"
import { Session } from "@/types/types"
import { format } from "date-fns"

type PaymentSummaryModalProps = {
  session: Session
  onClose: () => void
  onConfirm: (session: Session, tip: number, method: string, tax: number, amountPaid: number) => void
}

export default function PaymentSummaryModal({
  session,
  onClose,
  onConfirm,
}: PaymentSummaryModalProps) {
  const [amountPaid, setAmountPaid] = useState(session.totalPrice || 0);
  const [tip, setTip] = useState(0)
  const [tax, setTax] = useState(0)
  const [method, setMethod] = useState("cash")
  const [tipPercent, setTipPercent] = useState(0);     // stores 5,10,15
  const [customTipMode, setCustomTipMode] = useState(false);  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = amountPaid + tip + tax
  useEffect(() => {
    if (!customTipMode) {
      setTip((amountPaid * tipPercent) / 100);
    }
    const total = amountPaid + tip + tax
  }, [amountPaid, tipPercent, customTipMode]);
  const validatePayment = () => {
    if (amountPaid <= 0) return "Amount paid must be greater than 0.";
    if (tip < 0) return "Tip cannot be negative.";
    if (tax < 0) return "Tax cannot be negative.";
    if (total <= 0) return "Total must be greater than 0.";
    return "";
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-3">
          <CreditCard className="w-6 h-6 text-yellow-600" />
          <h1 className="text-xl font-semibold text-gray-800">Payment Summary</h1>
        </div>

        {/* Session + Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Session Details */}
          <div className="rounded-xl border border-gray-200 bg-neutral-50 p-4 space-y-1">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-yellow-600" /> Session Details
            </h2>
            <p className="text-sm"><span className="font-medium">Title:</span> {session.title}</p>
            <p className="text-sm"><span className="font-medium">Service:</span> {session.service.name}</p>
            <p className="text-sm"><span className="font-medium">Date:</span> {format(new Date(session.start), "dd/MM/yyyy")}</p>
            <p className="text-sm"><span className="font-medium">Time:</span> {format(new Date(session.start), "HH:mm")} – {format(new Date(session.end), "HH:mm")}</p>
            <p className="text-sm"><span className="font-medium">Trainer:</span> {session.employee.lastName} {session.employee.firstName}</p>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-gray-200 bg-neutral-50 p-4 space-y-1">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-yellow-600" /> Customer Info
            </h2>
            <p className="text-sm"><span className="font-medium">Name:</span> {session.customer.lastName} {session.customer.firstName}</p>
            <p className="text-sm"><span className="font-medium">Phone:</span> {session.customer.phone}</p>
            <p className="text-sm"><span className="font-medium">Email:</span> {session.customer.email}</p>
            <p className="text-sm"><span className="font-medium">Notes:</span> {session.customer.notes ? session.customer.notes : "-"}</p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="rounded-xl border border-gray-200 bg-neutral-50 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-600" /> Payment Breakdown
          </h2>
          <div className="w-full">
            <label className="text-xs font-medium text-gray-500">Amount Paid (VND)</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(+e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          {/* TIP SECTION */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500">Tip</label>

            {/* Tip options */}
            <div className="flex gap-2">
              {[
                { label: "5%", value: 5 },
                { label: "10%", value: 10 },
                { label: "15%", value: 15 },
                { label: "Custom", value: -1 },
              ].map((item) => {
                const isSelected =
                  item.value === -1 ? customTipMode : tipPercent === item.value;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.value === -1) {
                        setCustomTipMode(true);
                        setTip(0);
                        setTipPercent(0);
                      } else {
                        setCustomTipMode(false);
                        setTipPercent(item.value);
                        setTip((amountPaid * item.value) / 100);
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg border text-sm transition 
                      ${isSelected 
                        ? "bg-[#FFC107] text-black border-[#FFC107]" 
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Manual tip input (enabled only when Custom is selected) */}
            <input
              type="number"
              placeholder="Enter tip amount (VND)"
              value={customTipMode ? tip : ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTip(value);
              }}
              disabled={!customTipMode}
              className={`w-full border rounded-md p-2 text-sm mt-2 transition
                ${customTipMode 
                  ? "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500" 
                  : "bg-gray-100 border-gray-200 text-gray-400"
                }
              `}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Tax (%)</label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(+e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {/* Money Breakdown */}
          <div className="border-t border-dashed border-gray-300 pt-3 text-sm space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{amountPaid.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tip</span>
              <span>{tip.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{((amountPaid * tax) / 100).toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 mt-1">
              <span>Total</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full md:w-auto py-2 px-4 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(session, tip, method, ((amountPaid * tax) / 100), amountPaid)}
            className="w-full md:w-auto py-2 px-4 rounded-lg bg-[#FFC107] text-[#1E1E1E] font-semibold hover:bg-[#e0a900] transition"
          >
            Confirm & Pay {total.toLocaleString()} VND
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-2">
          Secured • No external sharing
        </p>
      </div>
    </div>
  )
}
