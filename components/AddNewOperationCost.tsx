"use client"

import { useState } from "react"
import { OperationalCost } from "@/data/sessions"
import { X } from "lucide-react"

interface AddNewOperationalCostModalProps {
  onClose: () => void
  onSave: (data: OperationalCost) => void
  initialData?: OperationalCost | null
}

export default function AddNewOperationalCostModal({ onClose, onSave, initialData }: AddNewOperationalCostModalProps) {
  const [period, setPeriod] = useState(initialData?.period || new Date().toISOString().slice(0, 7))
  const [category, setCategory] = useState<OperationalCost["category"]>(initialData?.category || "rent")
  const [amount, setAmount] = useState(initialData?.amount || 0)
  const [notes, setNotes] = useState(initialData?.notes || "")

  const handleSubmit = () => {
    if (!period || amount <= 0) {
      alert("Please enter valid period and amount.")
      return
    }

    const newCost: OperationalCost = {
      id: initialData?.id || `oc-${Date.now()}`,
      category,
      amount,
      period,
      notes
    }

    onSave(newCost)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-brand-primary">Add Operational Cost</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Period (YYYY-MM)</label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="rent">Rent</option>
              <option value="utilities">Utilities</option>
              <option value="equipment">Equipment</option>
              <option value="marketing">Marketing</option>
              <option value="maintenance">Maintenance</option>
              <option value="insurance">Insurance</option>
              <option value="supplies">Supplies</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Ex: Internet bill, AC maintenance..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition"
          >
            Save Cost
          </button>
        </div>
      </div>
    </div>
  )
}
