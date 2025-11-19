import { PaymentFor } from "@/types/types";
import { MdCalendarMonth, MdPayment, MdRefresh } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";

interface PaymentsFiltersPanelProps {
  month: string;
  type: string;
  method: string;
  status: string;
  onMonthChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function PaymentsFiltersPanel({
  month,
  type,
  method,
  status,
  onMonthChange,
  onTypeChange,
  onMethodChange,
  onStatusChange,
  onReset,
}: PaymentsFiltersPanelProps) {
  return (
    <div className="px-4 flex flex-row items-center gap-6 border-t border-gray-200 pt-3">
      
      {/* MONTH */}
      <div className="flex flex-col flex-1 max-w-[200px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Month
        </label>
        <div className="relative">
          <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
      </div>

      {/* TYPE */}
      <div className="flex flex-col flex-1 max-w-[150px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Type
        </label>
        <div className="relative">
          <MdPayment className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All</option>
            <option value="session">Session</option>
            <option value="package">Package</option>
            <option value="membership">Membership</option>
          </select>
          <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* METHOD */}
      <div className="flex flex-col flex-1 max-w-[150px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Method
        </label>
        <div className="relative">
          <MdPayment className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="transfer">Transfer</option>
          </select>
          <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* STATUS */}
      <div className="flex flex-col flex-1 max-w-[150px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Status
        </label>
        <div className="relative">
          <MdPayment className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
          </select>
          <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* RESET BUTTON */}
      <button
        onClick={onReset}
        className="flex flex-row items-center justify-center rounded-lg bg-gray-200 px-2 p-2 ml-auto">
        Refresh
        <MdRefresh size={25}/>
      </button>
    </div>
  );
}
