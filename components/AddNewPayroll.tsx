"use client";

import { useEffect, useMemo, useState } from "react";
import { Payroll, Employee, mockEmployees } from "@/data/sessions";

type Props = {
  onClose: () => void;
  onSave: (p: Payroll) => void;
  initialData?: Payroll | null;
  defaultPeriod?: string; // e.g., "2025-10"
};

export default function AddNewPayroll({
  onClose,
  onSave,
  initialData,
  defaultPeriod,
}: Props) {
  const [employees] = useState<Employee[]>(mockEmployees);

  // form state
  const [employeeId, setEmployeeId] = useState(initialData?.employeeId || "");
  const [period, setPeriod] = useState(
    initialData?.period || defaultPeriod || new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === employeeId) || null,
    [employeeId, employees]
  );

  const [baseSalary, setBaseSalary] = useState<number>(
    initialData?.baseSalary ?? (selectedEmployee?.salary ?? 0)
  );
  const [bonuses, setBonuses] = useState<number>(initialData?.bonuses ?? 0);
  const [deductions, setDeductions] = useState<number>(initialData?.deductions ?? 0);
  const [status, setStatus] = useState<Payroll["status"]>(initialData?.status ?? "pending");
  const [paidDate, setPaidDate] = useState<string>(initialData?.paidDate ?? "");

  // when employee changes → prefill base salary
  useEffect(() => {
    if (!initialData && selectedEmployee) {
      setBaseSalary(selectedEmployee.salary);
    }
  }, [selectedEmployee, initialData]);

  const netSalary = useMemo(
    () => Math.max(0, Math.round((baseSalary + (bonuses || 0) - (deductions || 0)) * 100) / 100),
    [baseSalary, bonuses, deductions]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!employeeId) e.employeeId = "Please choose an employee.";
    if (!period) e.period = "Please choose a period (YYYY-MM).";
    if (baseSalary <= 0) e.baseSalary = "Base salary must be > 0.";
    if (bonuses < 0) e.bonuses = "Bonuses cannot be negative.";
    if (deductions < 0) e.deductions = "Deductions cannot be negative.";
    if (status === "paid" && !paidDate) e.paidDate = "Paid date required when status is Paid.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload: Payroll = {
      id: initialData?.id || `payroll-${Date.now()}`,
      employeeId,
      period,
      baseSalary: Number(baseSalary),
      bonuses: Number(bonuses) || 0,
      deductions: Number(deductions) || 0,
      netSalary,
      status,
      paidDate: status === "paid" ? paidDate : undefined,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            {initialData ? "Edit Payroll" : "Add New Payroll"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {/* Employee */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} — {e.role}
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="mt-1 text-xs text-red-600">{errors.employeeId}</p>}
          </div>

          {/* Period */}
          <div>
            <label className="text-sm font-medium text-gray-700">Period</label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.period && <p className="mt-1 text-xs text-red-600">{errors.period}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Payroll["status"])}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Base */}
          <div>
            <label className="text-sm font-medium text-gray-700">Base Salary</label>
            <input
              type="number"
              min={0}
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.baseSalary && <p className="mt-1 text-xs text-red-600">{errors.baseSalary}</p>}
          </div>

          {/* Bonus */}
          <div>
            <label className="text-sm font-medium text-gray-700">Bonuses</label>
            <input
              type="number"
              min={0}
              value={bonuses}
              onChange={(e) => setBonuses(Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.bonuses && <p className="mt-1 text-xs text-red-600">{errors.bonuses}</p>}
          </div>

          {/* Deduction */}
          <div>
            <label className="text-sm font-medium text-gray-700">Deductions</label>
            <input
              type="number"
              min={0}
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.deductions && <p className="mt-1 text-xs text-red-600">{errors.deductions}</p>}
          </div>

          {/* Net + Paid date */}
          <div>
            <label className="text-sm font-medium text-gray-700">Net Salary</label>
            <div className="mt-1 w-full rounded-md border bg-gray-50 px-3 py-2 text-sm font-semibold">
              ${netSalary.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Paid Date (if Paid)</label>
            <input
              type="date"
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              disabled={status !== "paid"}
            />
            {errors.paidDate && <p className="mt-1 text-xs text-red-600">{errors.paidDate}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-5 py-4">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            {initialData ? "Save Changes" : "Create Payroll"}
          </button>
        </div>
      </div>
    </div>
  );
}
