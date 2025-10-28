// import { Session } from "@/data/sessions"

// export default function SessionCard({ title, customer, time, status }: Session) {
//     const badge =
//       status === "new"   ? "bg-warning text-brand-primary" :
//       status === "done"  ? "bg-sucess text-brand-primary" :
//                            "bg-error text-brand-primary"
  
//     return (
//       <div className="bg-white border border-neutral-border rounded-xl p-4 flex flex-col gap-2">
//         <div className="flex items-center justify-between">
//           <h4 className="font-heading text-sm text-brand-800 truncate max-w-[150px]">{title}</h4>
//           <span className={`text-xs px-2 py-1 rounded ${badge} capitalize`}>
//             {status}
//           </span>
//         </div>
//         <p className="font-sans text-sm text-brand-600">{customer}</p>
//         <p className="font-sans text-sm text-brand-500">{time}</p>
//       </div>
//     )
//   }

import { Session } from "@/data/sessions"

export default function SessionCard(props: Session) {
  const { title, customer, employee, time, status, type } = props
  const badge =
    status === "new"
      ? "bg-warning text-brand-primary"
      : status === "done"
      ? "bg-sucess text-brand-primary"
      : "bg-error text-brand-primary"

  return (
    <div className="bg-white border border-neutral-border rounded-xl p-4 flex flex-col gap-2">
      {/* Title + Status */}
      <div className="flex items-center justify-between">
        <h4 className="font-heading text-sm text-brand-800 truncate max-w-[150px]">
          {title}
        </h4>
        <span className={`text-xs px-2 py-1 rounded ${badge} capitalize`}>
          {status}
        </span>
      </div>

      {/* Customer + Employee */}
      <p className="font-sans text-sm text-brand-600">Customer: {customer}</p>
      <p className="font-sans text-sm text-brand-600">Employee: {employee}</p>

      {/* Time + Type */}
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-brand-500">{time}</p>
        {/* <span className={`text-xs px-2 py-1 rounded ${typeBadge} capitalize`}>
          {type}
        </span> */}
      </div>
    </div>
  )
}
