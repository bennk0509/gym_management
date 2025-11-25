"use client"

import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { OperationalCost, CostCategory } from "@/types/types"
import "react-datepicker/dist/react-datepicker.css";

interface AddOperationalCostProps {
  onClose: () => void
  onSave: (data: any) => void
  initialData?: OperationalCost | null
}

export default function AddNewOperationalCost({
  onClose,
  onSave,
  initialData,
}: AddOperationalCostProps) {

  const safeDate = (value: string | Date | null) => {
    const d = value instanceof Date ? value : new Date(value ?? "");
    return isNaN(d.getTime()) ? null : d;
  };
  const today = new Date();

  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [periodStart, setPeriodStart] = useState(
    initialData?.periodStart
      ? initialData.periodStart.split("T")[0]
      : today.toISOString().split("T")[0]
  );

  const [periodEnd, setPeriodEnd] = useState(
    initialData?.periodEnd
      ? initialData.periodEnd.split("T")[0]
      : lastDay.toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<CostCategory>(
    initialData?.category || "RENT"
  )
  const [amount, setAmount] = useState(initialData?.amount || 0)
  const [notes, setNotes] = useState(initialData?.notes || "")

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isValid, setIsValid] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)

  

  // Validation
  const validateField = (name: string, value: string | number) => {
    const newErrors = { ...errors }

    if (name === "amount") {
      if (!value || Number(value) <= 0) newErrors.amount = "Amount must be greater than 0"
      else delete newErrors.amount
    }

    if (name === "period") {
      if (!value) newErrors.period = "Period is required"
      else delete newErrors.period
    }

    setErrors(newErrors)
  }

  const handleChange =
    <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      setter: any,
      field: string
    ) =>
    (e: React.ChangeEvent<T>) => {
      const value = e.target.value
      setter(value)
      setHasChanged(true)
      validateField(field, value)
    }

    const validate = () => {
      const newErrors: any = {};
  
      if (!amount || Number(amount) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
      if (!periodStart) newErrors.periodStart = "Required";
      if (!periodEnd) newErrors.periodEnd = "Required";
      if (periodStart && periodEnd && periodStart > periodEnd) {
        newErrors.periodEnd = "End date must be after start date";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    useEffect(() => {
      setIsValid(validate());
    }, [periodStart, periodEnd, amount]);

    const handleSave = () => {
      const start = safeDate(periodStart);
      const end = safeDate(periodEnd);
    
      if (!start || !end) {
        setErrors({ period: "Please select valid dates." });
        return;
      }
    
      if (end < start) {
        setErrors({ period: "End date must be after start date." });
        return;
      }
      
      const dataToSave = {
        id: initialData?.id ?? undefined, // undefined when creating
        category,
        amount: amount,
        notes: notes?.trim() || null,
        periodStart: start.toISOString(),
        periodEnd: end.toISOString(),
      };
    
      onSave(dataToSave);
    };
    

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <form
        className="bg-white rounded-2xl shadow-xl w-[600px] flex flex-col p-3 px-10 py-10 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-brand-primary text-2xl font-semibold">
              {initialData ? "Edit Operational Cost" : "Add Operational Cost"}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? "Quickly Edit Cost" : "Quickly Add New Cost"}
            </p>
          </div>
          <button type="button" onClick={onClose}>
            <MdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-5 py-3">
          {/* PERIOD */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Period</p>
            <div className="flex flex-row gap-2 items-center justify-center">
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="shadow-md bg-neutral-light border border-neutral-100 text-sm p-2 rounded appearance-none"
              />
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="shadow-md bg-neutral-light border border-neutral-100 text-sm p-2 rounded appearance-none"
              />
              </div>
            
            {errors.period && (
              <span className="text-red-500 text-xs">{errors.period}</span>
            )}
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Category</p>
            <select
              value={category}
              onChange={handleChange(setCategory, "category")}
              className="appearance-none p-2 w-full border rounded-md border-neutral-300 text-sm text-brand-primary bg-white"
            >
              <option value="RENT">Rent</option>
              <option value="UTILITIES">Utilities</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="MARKETING">Marketing</option>
              <option value="SALARY">Salary</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* AMOUNT */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Amount</p>
            <input
              type="number"
              placeholder="Enter Cost Amount"
              value={amount}
              onChange={(e) => {
                const value = Number(e.target.value)
                setAmount(value)
                setHasChanged(true)
                validateField("amount", value)
              }}              
              className="p-2 w-full border rounded-md border-neutral-300 text-sm text-brand-primary"
            />
            {errors.amount && (
              <span className="text-red-500 text-xs">{errors.amount}</span>
            )}
          </div>

          {/* NOTES */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Notes</p>
            <textarea
              placeholder="Ex: AC Repair, New mats, Marketing Ads..."
              value={notes}
              onChange={handleChange(setNotes, "notes")}
              rows={3}
              className="p-2 w-full border rounded-md border-neutral-300 text-sm text-brand-primary"
            />
          </div>
        </div>

        {/* FOOTER */}
        <footer className="flex pt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={`p-2 w-full rounded-xl font-bold ${
              isValid && hasChanged
                ? "bg-accent-primary text-brand-primary"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {initialData ? "Update" : "Save"}
          </button>
        </footer>
      </form>
    </div>
  )
}
