import { MdCalendarMonth, MdCategory, MdRefresh } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";
import { CostCategory } from "@/types/types";

interface OperationalCostFiltersPanelProps {
  month: string;
  category: CostCategory | "all";
  onMonthChange: (value: string) => void;
  onCategoryChange: (value: CostCategory | "all") => void;
  onReset: () => void;
}

export default function OperationalCostFiltersPanel({
  month,
  category,
  onMonthChange,
  onCategoryChange,
  onReset,
}: OperationalCostFiltersPanelProps) {
  return (
    <div className="px-4 flex flex-row items-center gap-6 border-t border-gray-200 pt-3">

      {/* MONTH FILTER */}
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
            className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex flex-col flex-1 max-w-[200px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Category
        </label>
        <div className="relative">
          <MdCategory className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as CostCategory | "all")
            }
            className="appearance-none border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All</option>
            <option value="RENT">Rent</option>
            <option value="UTILITIES">Utilities</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="MARKETING">Marketing</option>
            <option value="SALARY">Salary</option>
            <option value="OTHER">Other</option>
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
