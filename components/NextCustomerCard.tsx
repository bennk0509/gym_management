// // components/NextCustomerCard.tsx
// "use client"

// type LastAppointment = {
//   date: string
//   coach: string
//   note?: string
// }

// type Props = {
//   name: string
//   phone: string
//   email: string
//   dob: string          // "YYYY-MM-DD" or "DD/MM/YYYY" (we’ll just show as-is)
//   sex: "MALE" | "FEMALE" | "OTHER" | string
//   age?: number         // optional; if you want auto-calc, see helper below
//   weight?: number | string
//   height?: number | string
//   lastApptDate?: string
//   lastAppointment?: LastAppointment
// }

// export default function NextCustomerCard({
//   name,
//   phone,
//   email,
//   dob,
//   sex,
//   age,
//   weight,
//   height,
//   lastApptDate,
//   lastAppointment,
// }: Props) {
//   return (
//     <section>

//       {/* Identity */}
//       <div className="mt-10 space-y-2">
//         <h3 className="font-heading text-xl text-brand-800">{name}</h3>
//         <p className="font-sans text-base text-brand-800">{phone}</p>
//         <p className="font-sans text-base text-brand-800">{email}</p>
//       </div>

//       {/* Facts grid */}
//       <div className="mt-8 grid grid-cols-3 gap-y-6">
//         <Fact label="DOB" value={dob ?? "-"}/>
//         <Fact label="SEX" value={sex ?? "-"}/>
//         <Fact label="AGE" value={age ?? "-"}/>
//         <Fact label="WEIGHT" value={weight ?? "-"} />
//         <Fact label="HEIGHT" value={height ?? "-"}/>
//         <Fact label="LAST APPT" value={lastApptDate ?? "-"}/>
//       </div>

//       {/* Last appointment panel */}
//       {lastAppointment && (
//         <div className="mt-8 rounded-3xl bg-accent-50 p-6 md:p-8">
//           <h4 className="font-heading text-xl text-brand-800">LAST APPOINTMENT</h4>

//           <div className="mt-6 grid grid-cols-3 gap-6">
//             <Field label="Date:" value={lastAppointment.date} />
//             <Field label="Coach Name:" value={lastAppointment.coach} />
//             <Field label="Note:" value={lastAppointment.note ?? "—"} colSpan />
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }

// /** Small label/value helpers to keep JSX clean */
// function Fact({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div>
//       <div className="font-heading text-center text-sm tracking-wide text-brand-800">{label}</div>
//       <div className="font-sans text-center text-base text-brand-800 mt-1">{value}</div>
//     </div>
//   )
// }

// function Field({
//   label,
//   value,
//   colSpan = false,
// }: {
//   label: string
//   value: string | number
//   colSpan?: boolean
// }) {
//   return (
//     <div className={colSpan ? "col-span-3 md:col-span-3" : ""}>
//       <div className="font-heading text-base text-brand-800">{label}</div>
//       <div className="font-sans text-base text-brand-800 mt-1">{value}</div>
//     </div>
//   )
// }

// components/NextCustomerCard.tsx
"use client"

import { Phone, Mail } from "lucide-react" // npm i lucide-react (optional)
import AppointmentCard from "./AppointmentCard";

type LastAppointment = { date: string; coach: string; note?: string }
type Props = {
  name: string; phone: string; email: string;
  dob: string; sex: "MALE" | "FEMALE" | "OTHER" | string;
  age?: number; weight?: number | string; height?: number | string;
  lastApptDate?: string; lastAppointment?: LastAppointment;
  avatarUrl?: string;
}

export default function NextCustomerCard(props: Props) {
  const {
    name, phone, email, dob, sex, age, weight, height, lastApptDate, lastAppointment, avatarUrl,
  } = props

  const computedAge = age ?? ageFromDOB(dob)
  const initialsText = initials(name)

  return (
    <section className="w-full p-6 md:p-7 t">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-brand-800 text-neutral-text grid place-items-center font-heading">
              {initialsText}
            </div>
          )}

          <div>
            <h2 className="font-heading text-sm leading-tight text-brand-800">{name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-sans text-brand-600">
              <span className="inline-flex items-center gap-1">
                <Phone size={14} /> {phone}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail size={14} /> {email}
              </span>
            </div>
          </div>
        </div>

        <button
          className="hidden md:inline-flex bg-accent-500 hover:bg-accent-600 text-brand-900 text-sm font-medium px-3 py-2 rounded-md"
        >
          Start session
        </button>
      </header>

      {/* Divider */}
      <hr className="my-6 border-neutral-border" />

      {/* Facts grid (semantic dl) */}
      <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-center">
        <Fact label="DOB" value={dob} />
        <Fact label="SEX" value={sex} />
        <Fact label="AGE" value={computedAge ?? "—"} />
        <Fact label="WEIGHT" value={valueOrDash(weight)} />
        <Fact label="HEIGHT" value={valueOrDash(height)} />
        <Fact label="LAST APPT" value={lastApptDate ?? "—"} />
      </dl>
      
      {/* Divider */}
      <hr className="my-6 border-neutral-border" />
      {/* Last appointment */}
      {lastAppointment && (
        // <div className="mt-7 rounded-2xl border border-[#FFE8A6] bg-accent-50 p-5 md:p-6">
        //   <h3 className="font-heading text-lg text-brand-800">LAST APPOINTMENT</h3>
        //   <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        //     <Field label="Date" value={lastAppointment.date} />
        //     <Field label="Coach name" value={lastAppointment.coach} />
        //     <Field label="Note" value={lastAppointment.note ?? "—"} full />
        //   </dl>
        //   <div className="mt-3 text-right">
        //     <a href="/appointments" className="text-sm font-medium text-brand-800 hover:underline">
        //       View history
        //     </a>
        //   </div>
        // </div>
        <div className="w-full">
            <AppointmentCard/>
        </div>
      )}
    </section>
  )
}

/* ——— helpers ——— */
function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="font-heading text-sm uppercase tracking-wider text-brand-800">{label}</dt>
      <dd className="font-sans text-sm text-brand-800 mt-1">{value}</dd>
    </div>
  )
}

function Field({ label, value, full = false }:{
  label: string; value: string | number; full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="font-heading text-sm text-brand-800">{label}</div>
      <div className="font-sans text-base text-brand-800 mt-1">{value}</div>
    </div>
  )
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(p => p[0]?.toUpperCase() ?? "").slice(0,2).join("")
}

function valueOrDash(v?: string | number) {
  return v === undefined || v === null || v === "" ? "—" : v
}

function ageFromDOB(dob: string) {
  const parts = dob.includes("-") ? dob.split("-").map(Number)
                                  : dob.split("/").reverse().map(Number)
  const [y, m, d] = parts
  if (!y || !m || !d) return undefined
  const t = new Date()
  let a = t.getFullYear() - y
  const before = (t.getMonth()+1 < m) || ((t.getMonth()+1 === m) && (t.getDate() < d))
  return before ? a - 1 : a
}
