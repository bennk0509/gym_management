// "use client"

// import { motion, AnimatePresence } from "framer-motion"
// import { format } from "date-fns"
// import { Session } from "@/data/sessions"
// import { MdEdit, MdDelete, MdClose } from "react-icons/md"

// type Props = {
//   session: Session
//   position?: "left" | "right" | "center"
//   visible: boolean
//   onEdit?: (session: Session) => void
//   onDelete?: (session: Session) => void
// }

// export default function SessionHoverCard({
//   session,
//   position = "right",
//   visible,
//   onEdit,
//   onDelete,
// }: Props) {
//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           key={session.id}
//           initial={{ opacity: 0, scale: 0.95, y: -5 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: -5 }}
//           transition={{ duration: 0.15, ease: "easeOut" }}
//           className={`absolute ${
//             position === "right"
//               ? "top-0 left-full ml-2"
//               : position === "left"
//               ? "top-0 right-full mr-2"
//               : "top-0 mt-2 left-1/2 -translate-x-1/2"
//           } w-72 bg-neutral-light text-black shadow-lg rounded-xl p-4 z-50`}
//         >
//             {/* Header */}
//             <div className="flex flex-row-reverse gap-5 pb-5">
//                 <button>
//                     <MdEdit className="w-5 h-5 text-gray-500"/>
//                 </button>
//                 <button type="button">
//                     <MdDelete className="w-5 h-5 text-gray-500"/>
//                 </button>
//                 <button type="button">
//                     <MdClose className="w-5 h-5 text-gray-500"/>
//                 </button>
//             </div>
//           {/* Title */}
//           <div className="flex items-center justify-between">
//             <h4 className="font-semibold text-brand-800 truncate max-w-[180px]">
//               {session.title}
//             </h4>
//             <span
//               className={`text-xs px-2 py-1 rounded capitalize text-white ${
//                 session.status === "done"
//                   ? "bg-green-500"
//                   : session.status === "new"
//                   ? "bg-yellow-500"
//                   : "bg-red-500"
//               }`}
//             >
//               {session.status}
//             </span>
//           </div>

//           {/* Time */}
//           <p className="text-sm text-gray-600 mt-1">
//             {format(session.start, "EEE, MMM d")} <br />
//             {format(session.start, "HH:mm")} – {format(session.end, "HH:mm")}
//           </p>

//           {/* Customer & Employee */}
//           <p className="text-sm mt-2">
//             <span className="font-medium">Customer:</span>{" "}
//             {session.customer || <span className="italic text-gray-400">No customer</span>}
//           </p>
//           <p className="text-sm">
//             <span className="font-medium">Employee:</span> {session.employee}
//           </p>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 mt-3">
//             <button
//               onClick={() => onEdit?.(session)}
//               className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border border-neutral-200 hover:bg-neutral-100"
//             >
//               <MdEdit /> Edit
//             </button>
//             <button
//               onClick={() => onDelete?.(session)}
//               className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
//             >
//               <MdDelete /> Delete
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Session } from "@/data/sessions"
import { CalendarDays, User, StickyNote, Clock, Dumbbell } from "lucide-react"
import { MdEdit, MdDelete, MdClose } from "react-icons/md"
type Props = {
  session: Session
  position?: "left" | "right" | "center"
  visible: boolean
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onClose: () => void
}

export default function SessionHoverCard({
  session,
  position = "right",
  visible,
  onEdit,
  onDelete,
  onClose
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
                  {format(session.start, "dd/MM/yyyy")} <br />
                  {format(session.start, "HH:mm")} – {format(session.end, "HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <User className="w-4 h-4 text-yellow-600" /> Customer
                </p>
                <p className="font-medium mt-1">{session.customer}</p>
              </div>
            </div>

            {/* Service & Employee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Dumbbell className="w-4 h-4 text-yellow-600" /> Service
                </p>
                <p className="font-medium mt-1">{session.serviceId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <User className="w-4 h-4 text-yellow-600" /> Employee
                </p>
                <p className="font-medium mt-1">{session.employee}</p>
              </div>
            </div>

            {/* Type */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-gray-500 text-xs">Type</p>
                   <p className="font-medium mt-1 capitalize">{session.type}</p>
                </div>
              <div>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                        Total price
                    </p>
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
          <div className="p-4 flex justify-between items-center text-xs">
            <span className="text-gray-500">Ref #{session.id}</span>
            <span className="font-semibold text-yellow-800">
              ${session.totalPrice.toFixed(2)}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

