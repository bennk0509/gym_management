"use client"

import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Session } from "@/types/types"
import { CalendarDays, User, Clock, Dumbbell } from "lucide-react"
import { MdEdit, MdDelete, MdClose } from "react-icons/md"
type Props = {
  session: Session
  position?: "left" | "right" | "center"
  visible: boolean
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onClose: () => void
  onMarkComplete: (session: Session) => void
}

export default function SessionHoverCard({
  session,
  position = "right",
  visible,
  onEdit,
  onDelete,
  onClose,
  onMarkComplete
}: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`absolute ${
            position === "right"
              ? "top-0 left-full ml-2"
              : position === "left"
              ? "top-0 right-full mr-2"
              : "top-0 mt-2 left-1/2 -translate-x-1/2"
          } w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50`}
        >
            {/* <div className="flex flex-row-reverse gap-5 p-2"> 
                <button> 
                    <MdEdit className="w-5 h-5 text-gray-500"/> 
                </button> 
                <button type="button"> 
                    <MdDelete className="w-5 h-5 text-gray-500"/> 
                </button> 
                <button type="button"> 
                    <MdClose className="w-5 h-5 text-gray-500"/> 
                    </button> 
            </div> */}
          {/* Header */}
          <div className={`${session.type === "gym" ? "bg-[#FFDAB9]/50" : "bg-[#BEE3DB]/50"} px-5 py-3 flex flex-row justify-between items-center`}>
            <h3 className="font-heading text-sm font-bold text-yellow-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-yellow-700" />
              {session.title}
            </h3>
            <div className="flex flex-row-reverse gap-5">
                <button type="button" onClick={() => onEdit(session)}> 
                    <MdEdit className="w-5 h-5 text-gray-500"/> 
                </button> 
                <button type="button" onClick={() => onDelete(session)}> 
                    <MdDelete 
                    className="w-5 h-5 text-gray-500"/> 
                </button> 
                <button type="button" onClick={onClose}> 
                    <MdClose className="w-5 h-5 text-gray-500"/> 
                </button> 
            </div>
            {/* <span
              className={`text-xs px-2 py-1 rounded-full capitalize text-brand-primary ${
                session.status === "done"
                        ? "bg-sucess"
                        : session.status === "new"
                        ? "bg-warning"
                        : "bg-error"
              }`}
            >
              {session.status}
            </span> */}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-4 text-sm">

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-4 h-4 text-yellow-600" /> Date & Time
                </p>
                <p className="font-medium mt-1">
                  {format(new Date(session.start), "dd/MM/yyyy")} <br />
                  {format(new Date(session.start), "HH:mm")} – {format(new Date(session.end), "HH:mm")}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <User className="w-4 h-4 text-yellow-600" /> Customer
                </p>
                <p className="font-medium mt-1">
                  {session.customer?.firstName} {session.customer?.lastName}
                </p>
              </div>
            </div>

            {/* Service & Employee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Dumbbell className="w-4 h-4 text-yellow-600" /> Service
                </p>
                <p className="font-medium mt-1">
                  {session.serviceId ? `${session.service.name}` : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <User className="w-4 h-4 text-yellow-600" /> Employee
                </p>
                <p className="font-medium mt-1">
                  {session.employee?.firstName} {session.employee?.lastName}
                </p>
              </div>
            </div>

            {/* Type & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Type</p>
                <p className="font-medium mt-1 capitalize">{session.type}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Price</p>
                <p className="font-medium mt-1">{session.totalPrice} VND</p>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative">
            <div className="border-t border-dashed border-gray-300"></div>
            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white border border-gray-300"></div>
            <div className="absolute -right-3 top-0 h-6 w-6 rounded-full bg-white border border-gray-300"></div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => onMarkComplete?.(session)}
              className={`px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-all ${
                session.status === "done"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed":
                session.status == 'cancel' 
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-[#FFC107] text-[#1E1E1E] hover:bg-[#e0a900]"
              }`}
              disabled={session.status === "done"}
            >
              {session.status === "done" ? "Completed": session.status == 'cancel'? "Cancelled" : "Mark as Complete"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

