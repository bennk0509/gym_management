import { RiArrowDownSLine } from "react-icons/ri";
import { MdCalendarMonth, MdWork } from "react-icons/md";

interface EmployeeFiltersPanelProps {
  status: "all" | "active" | "inactive";
  hireStart: string;
  hireEnd: string;
  role: string;
  onStatusChange: (value: "all" | "active" | "inactive") => void;
  onHireStartChange: (value: string) => void;
  onHireEndChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export default function EmployeeFiltersPanel({
  status,
  hireStart,
  hireEnd,
  role,
  onStatusChange,
  onHireStartChange,
  onHireEndChange,
  onRoleChange,
}: EmployeeFiltersPanelProps) {
  return (
    <div className="px-4 flex flex-row items-center gap-6 border-t border-gray-200 pt-3">
      {/* STATUS */}
      <div className="flex flex-col flex-1 max-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Status
        </label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as "all" | "active" | "inactive")
            }
            className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* HIRE DATE RANGE */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase">
          Hire Date
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={hireStart}
              onChange={(e) => onHireStartChange(e.target.value)}
              className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <span className="text-gray-400 text-sm">–</span>
          <div className="relative flex-1">
            <MdCalendarMonth className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={hireEnd}
              onChange={(e) => onHireEndChange(e.target.value)}
              className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* ROLE FILTER */}
      <div className="flex flex-col flex-1 max-w-[200px]">
        <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Role
        </label>
        <div className="relative">
          <MdWork className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="">All Roles</option>
            <option value="trainer">Trainer</option>
            <option value="therapist">Therapist</option>
            <option value="masseuse">Masseuse</option>
            <option value="admin">Admin</option>
          </select>
          <RiArrowDownSLine className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
