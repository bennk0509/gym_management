"use client"

import { useState } from "react"
import { CreditCard, User, CalendarDays, DollarSign, Dumbbell, Clock } from "lucide-react"
import { Session } from "@/types/types"

type PaymentSummaryModalProps = {
  session: Session
  onClose: () => void
  onConfirm: (session: Session, tip: number, method: string, tax: number) => void
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

  const subtotal = session.totalPrice || 0
  const total = subtotal + tip + tax

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
            <p className="text-sm"><span className="font-medium">Date:</span> {new Date(session.date).toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-medium">Time:</span> {session.time}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Tip (VND)</label>
              <input
                type="number"
                value={tip}
                onChange={(e) => setTip(+e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Tax (VND)</label>
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
          </div>

          {/* Money Breakdown */}
          <div className="border-t border-dashed border-gray-300 pt-3 text-sm space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tip</span>
              <span>{tip.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{tax.toLocaleString()} VND</span>
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
            onClick={() => onConfirm(session, tip, method, tax)}
            className="w-full md:w-auto py-2 px-4 rounded-lg bg-[#FFC107] text-[#1E1E1E] font-semibold hover:bg-[#e0a900] transition"
          >
            Confirm & Pay {total.toLocaleString()} VND
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-2">
          Secured by FitWell Encryption • No external sharing
        </p>
      </div>
    </div>
  )
}
