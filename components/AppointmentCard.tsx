import { CalendarDays, User, StickyNote, Clock, Dumbbell } from "lucide-react"

export default function AppointmentTicket() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full mt-6">
      {/* Header */}
      <div className="bg-yellow-50 px-5 py-3 flex justify-between items-center">
        <h3 className="font-heading text-sm font-bold text-yellow-900 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-yellow-700" />
          LAST APPOINTMENT
        </h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Completed
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 text-sm">
        {/* Date & Coach */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs flex flex-row items-center gap-1"><Clock className="w-4 h-4 text-yellow-600" /> Date & Time</p>
            <p className="font-medium flex items-center gap-1 mt-1">
               12/08/2025 – 10:30 AM
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs flex flex-row items-center gap-1"><User className="w-4 h-4 text-yellow-600" />Coach</p>
            <p className="font-medium flex items-center gap-1 mt-1">
               Van A
            </p>
          </div>
        </div>

        {/* Service & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs flex flex-row items-center gap-1">
            <Dumbbell className="w-4 h-4 text-yellow-600" />Service</p>
            <p className="font-medium flex items-center gap-1 mt-1">
               Physiotherapy
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Duration</p>
            <p className="font-medium mt-1">45 minutes</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            <StickyNote className="w-4 h-4 text-yellow-600" /> Note
          </p>
          <p className="font-medium mt-1">Gian co chan tinh manh</p>
        </div>
      </div>

      {/* Perforated Divider */}
      <div className="relative">
        <div className="border-t border-dashed border-gray-300"></div>
        <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white border border-gray-300"></div>
        <div className="absolute -right-3 top-0 h-6 w-6 rounded-full bg-white border border-gray-300"></div>
      </div>

      {/* Footer */}
      <div className="p-4 flex justify-between items-center text-xs">
        <span className="text-gray-500">Ref #APT-20250912</span>
        <button className="text-yellow-700 font-medium hover:underline">
          View history →
        </button>
      </div>
    </div>
  )
}
