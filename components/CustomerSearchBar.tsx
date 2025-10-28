import { Search } from "lucide-react";
import { CustomerSearchBarProps } from "@/data/sessions";
import { MdOutlineSettingsInputComponent, MdRefresh } from "react-icons/md";


export default function CustomerSearchBar({
  query,
  onChange,
  onToggleFilters,
  onRefresh,
  showFilters
}: CustomerSearchBarProps) {
  return (
    <div className="flex flex-row justify-between px-4 pt-4 pb-3">
      <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[300px]">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search name, email, phone..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div className="flex flex-row gap-4">
        <button
          onClick={onToggleFilters}
          className="flex flex-row items-center justify-center rounded-lg bg-gray-200 px-2 gap-2"
        >
            Filter
            <MdOutlineSettingsInputComponent size={25}/>
        </button>
        <button
          onClick={onRefresh}
          className="flex flex-row items-center justify-center rounded-lg bg-gray-200 px-2">
          Refresh
          <MdRefresh size={25}/>
        </button>
      </div>
    </div>
  );
}
