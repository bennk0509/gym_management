import { useEffect, useState } from "react"
import {
  Session,
  mockServices,
  Service,
  mockEmployees,
  mockCustomers,
  Customer,
} from "@/data/sessions"
import {
  MdDateRange,
  MdPeopleAlt,
  MdOutlinePeople,
  MdMenuOpen,
  MdClose,
} from "react-icons/md"
import { LuPackage } from "react-icons/lu";
import { HiOutlineMenuAlt2, HiExternalLink } from "react-icons/hi"
import CustomerSelect from "./CustomerSelect"

interface AddSessionModalProps {
  onClose: () => void
  onSave: (session: Session) => void
  initialData?: Session | null
}

export default function AddSessionModal({
  onClose,
  onSave,
  initialData,
}: AddSessionModalProps) {
  const isEdit = !!initialData 

  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [serviceID, setServiceID] = useState("")
  const [employee, setEmployee] = useState("")
  const [title, setTitle] = useState("")
  const [customerPackage, setCustomerPackage] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null)

  const selectedService: Service | undefined = mockServices.find(
    (s) => s.id === serviceID
  )
  useEffect(() => {
  if (initialData) {
    // prefill when editing
    setDate(initialData.start.toISOString().split("T")[0])
    setStartTime(initialData.start.toTimeString().slice(0, 5))
    setEndTime(initialData.end.toTimeString().slice(0, 5))
    setServiceID(initialData.serviceId)
    setEmployee(
        mockEmployees.find(
        e => `${e.firstName} ${e.lastName}` === initialData.employee
        )?.id || ""
    )
    setTitle(initialData.title)
    setCustomer(
        mockCustomers.find(
        c => `${c.firstName} ${c.lastName}` === initialData.customer
        ) || null
    )
  } else {
    // new session defaults
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const minutes = now.getMinutes()
    const roundedMinutes = minutes < 30 ? 30 : 0
    const roundedHours = minutes < 30 ? now.getHours() : now.getHours() + 1
    const pad = (n: number) => (n < 10 ? "0" + n : n)

    const start = new Date(now)
    start.setHours(roundedHours, roundedMinutes, 0, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    setDate(formattedDate)
    setStartTime(`${pad(start.getHours())}:${pad(start.getMinutes())}`)
    setEndTime(`${pad(end.getHours())}:${pad(end.getMinutes())}`)
    setServiceID("")
    setEmployee("")
    setCustomer(null)
  }
}, [initialData])


  const handleSave = () => {
    if (!serviceID) {
      alert("Please select a service before saving.")
      return
    }

    const service = selectedService!
    const session: Session = {
      id: initialData?.id ?? crypto.randomUUID(),
      title: title || "New Session",
      customer: customer ? customer.id : "",
      employee: employee || "",
      date,
      time: startTime,
      status: initialData?.status ?? "new",
      type: service.type,
      start: new Date(`${date}T${startTime}`),
      end: new Date(`${date}T${endTime}`),
      serviceId: service.id,
      totalPrice: service.price,
    }

    onSave(session)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form className="bg-white rounded-2xl shadow-xl w-[540px] flex flex-col p-3 px-5 py-5 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder={ isEdit ? `Edit Session Title` : `Add Session Title` }
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="p-2 w-full border-b border-neutral-200 pb-0 text-brand-primary font-heading"
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <button type="button" onClick={onClose}>
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Title */}
        {/* <div>
          <input
            type="text"
            placeholder="Add Session Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="p-2 w-full border-b border-neutral-200 pb-0 text-brand-primary font-heading"
          />
        </div> */}

        {/* Form Fields */}
        <div className="flex flex-col gap-5 py-3">
          {/* Date and Time */}
          <div className="flex flex-row items-center gap-10">
            <MdDateRange className="w-7 h-7 text-gray-500" />
            <div className="flex flex-row gap-2 items-center justify-center">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="shadow-md bg-neutral-light border border-neutral-100 text-sm p-2 rounded appearance-none"
              />

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="shadow-md bg-neutral-light text-sm p-2 rounded appearance-none"
              />

              <span className="text-gray-600">–</span>

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="shadow-md bg-neutral-light text-sm p-2 rounded appearance-none"
              />
            </div>
          </div>

          {/* Employee */}
          <div className="flex flex-row items-center gap-10">
            <MdPeopleAlt className="w-7 h-7 text-gray-500" />
            <select
            className={`p-2 w-full border-b border-neutral-200 text-sm appearance-none
                        ${employee === '' ? 'text-neutral-400'  : 'text-brand-primary' }`}
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            >
            <option value="" disabled className="text-neutral-400">Select Employee</option>
            {mockEmployees.map((s) => (
                <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.role})
                </option>
            ))}
            </select>
          </div>

          {/* Customer */}
          <div className="flex flex-row items-center gap-10">
            <MdOutlinePeople className="w-7 h-7 text-gray-500" />
            <CustomerSelect value={customer} onChange={setCustomer} />
          </div>

          {/* Package */}
          <div className="flex flex-row items-center gap-10">
            <LuPackage className="w-7 h-7 text-gray-500"/>
            <select
              className={`p-2 w-full border-b border-neutral-200 text-sm appearance-none
                          ${customerPackage === '' ? 'text-neutral-400'  : 'text-brand-primary' }`}
              value={customerPackage}
              onChange={(e) => setCustomerPackage(e.target.value)}
              >
              <option value="" disabled className="text-neutral-400">Select Package</option>
              {mockEmployees.map((s) => (
                  <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.role})
                  </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div className="flex flex-row items-start justify-center gap-10">
            <MdMenuOpen className="w-7 h-7 text-gray-500" />
            <div className="w-full items-start">
              <select
                className={`p-2 w-full border-b border-neutral-200 text-sm appearance-none
                  ${serviceID === '' ? 'text-neutral-400' : 'text-brand-primary'}
                `}
                value={serviceID}
                onChange={(e) => setServiceID(e.target.value)}
              >
                <option value="" disabled className="text-neutral-400">Select Service</option>
                {mockServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {selectedService && (
                <div className="mt-3 w-full rounded-xl p-4">
                  <div className="flex flex-row items-center justify-between">
                    <h4 className="font-heading text-sm font-semibold text-brand-800">
                      {selectedService.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full capitalize">
                      {selectedService.type}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600 italic">
                    {selectedService.description}
                  </p>

                  <div className="mt-3 flex flex-row items-center justify-between text-sm text-brand-700">
                    <span>{selectedService.price} VND</span>
                    <span>{selectedService.durationMinutes} min</span>
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* Description */}
          <div className="flex flex-row items-center gap-10">
            <HiOutlineMenuAlt2 className="w-7 h-7 text-gray-500" />
            <input
              type="text"
              placeholder="Description"
              className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex pt-5">
          <button
            type="button"
            className="bg-accent-primary text-brand-primary p-2 w-full rounded-xl font-bold"
            onClick={handleSave}
          >
            {isEdit ? "Save Changes" : "Create Session"}
          </button>
        </footer>
      </form>
    </div>
  )
}
