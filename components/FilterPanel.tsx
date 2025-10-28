import { RiArrowDownSLine } from "react-icons/ri";
import { MdCalendarMonth } from "react-icons/md";
import { FiltersPanelProps } from "@/data/sessions";

export default function FiltersPanel({
  status,
  joinStart,
  joinEnd,
  minSpend,
  onStatusChange,
  onJoinStartChange,
  onJoinEndChange,
  onMinSpendChange
}: FiltersPanelProps) {
  return (
    <div className="px-4 flex flex-row items-center gap-6 border-t border-gray-200 pt-3">
      {/* Status Filter */}
      <div className="flex flex-col flex-1 max-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Status
        </label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Join Date */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase">Join Date</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={joinStart}
              onChange={(e) => onJoinStartChange(e.target.value)}
              className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <span className="text-gray-400 text-sm">–</span>
          <div className="relative flex-1">
            <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={joinEnd}
              onChange={(e) => onJoinEndChange(e.target.value)}
              className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Spending Filter */}
      <div className="flex flex-col flex-1 max-w-[200px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Min Spending
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={minSpend}
            onChange={(e) => onMinSpendChange(Number(e.target.value))}
            className="w-full accent-brand-600 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700 w-[60px]">${minSpend}</span>
        </div>
      </div>
    </div>
  );
}
// {showFilters && (
                //     <div className="px-4 flex flex-row items-center gap-6 border-t border-gray-200 pt-3">
                //         {/* STATUS FILTER */}
                //         <div className="flex flex-col flex-1 max-w-[140px]">
                //             <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                //             Status
                //             </label>
                //             <div className="relative">
                //             <select
                //                 value={status}
                //                 onChange={(e) => setStatus(e.target.value as any)}
                //                 className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full bg-white"
                //             >
                //                 <option value="all">All</option>
                //                 <option value="active">Active</option>
                //                 <option value="inactive">Inactive</option>
                //             </select>
                //             <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                //             </div>
                //         </div>

                //         {/* JOIN DATE RANGE */}
                //         <div className="flex flex-col">
                //             <label className="text-xs font-semibold text-gray-500 mb-1 uppercase">Join Date</label>
                //             <div className="flex items-center gap-2">
                //                 <div className="relative flex-1">
                //                     <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                //                     <input
                //                     type="date"
                //                     value={joinStart}
                //                     onChange={(e) => setJoinStart(e.target.value)}
                //                     className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
                //                     />
                //                 </div>
                //                 <span className="text-gray-400 text-sm">–</span>
                //                 <div className="relative flex-1">
                //                     <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                //                     <input
                //                     type="date"
                //                     value={joinEnd}
                //                     onChange={(e) => setJoinEnd(e.target.value)}
                //                     className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
                //                     />
                //                 </div>
                //             </div>
                //         </div>

                //         {/* SPENDING FILTER */}
                //         <div className="flex flex-col flex-1 max-w-[200px]">
                //             <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                //             Min Spending
                //             </label>
                //             <div className="flex items-center gap-3">
                //             <input
                //                 type="range"
                //                 min="0"
                //                 max="1000"
                //                 step="50"
                //                 value={minSpend}
                //                 onChange={(e) => setMinSpend(Number(e.target.value))}
                //                 className="w-full accent-brand-600 cursor-pointer"
                //             />
                //             <span className="text-sm font-medium text-gray-700 w-[60px]">
                //                 ${minSpend}
                //             </span>
                //             </div>
                //         </div>
                //     </div>
                // )}