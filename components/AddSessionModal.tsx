import { useEffect, useState } from "react"
import { Customer, Employee, Session, Service, Packages } from "@/types/types"
import {
  MdDateRange,
  MdPeopleAlt,
  MdOutlinePeople,
  MdMenuOpen,
  MdClose,
} from "react-icons/md"
import { LuPackage } from "react-icons/lu";
import { HiOutlineMenuAlt2 } from "react-icons/hi"
import CustomerSelect from "./CustomerSelect"
import AddNewCustomer from "./AddNewCustomer";
import { apiGet, apiPost } from "@/lib/api";
interface AddSessionModalProps {
  onClose: () => void
  onSave: (session: Session) => void
  onCustomerSearch: (term: string) => void
  initialData?: Session | null
  customers?: Customer[]
  employees?: Employee[],
  services?: Service[],

}

export default function AddSessionModal({
  onClose,
  onSave,
  onCustomerSearch,
  initialData,
  customers = [],
  employees = [],
  services = [],
}: AddSessionModalProps) {

  const isEdit = !!initialData;

  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [serviceID, setServiceID] = useState("")
  const [employeeId, setEmployeeId] = useState("")       // FIX
  const [title, setTitle] = useState("")
  const [customerId, setCustomerId] = useState("")       // FIX
  const [customerPackage, setCustomerPackage] = useState("")
  const selectedService = services.find((s) => s.id === serviceID)
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerPackages, setCustomerPackages] = useState<Packages[]>([]);

  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null
  console.log("Selected Customer:", selectedCustomer);

  useEffect(() => {
    if (!customerId) return setCustomerPackages([]);

    (async () => {
      const res = await apiGet(`/packages/customer/${customerId}`);
      console.log(res);
      setCustomerPackages(res);
    })();
  }, [customerId]);
  useEffect(() => {
    if (initialData) {
      // Prefill for EDIT mode
      setDate(initialData.start.split("T")[0])
      setStartTime(initialData.start.slice(11, 16))
      setEndTime(initialData.end.slice(11, 16))
      setServiceID(initialData.serviceId.toString())
      setEmployeeId(initialData.employee?.id ?? "")
      setCustomerId(initialData.customer?.id ?? "")
      setTitle(initialData.title)
    } else {
      // NEW SESSION DEFAULTS
      const now = new Date()
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

      const formattedDate = now.toISOString().split("T")[0]
      const minutes = now.getMinutes()
      const roundedMinutes = minutes < 30 ? 30 : 0
      const roundedHours = minutes < 30 ? now.getHours() : now.getHours() + 1

      const start = new Date(now)
      start.setHours(roundedHours, roundedMinutes, 0, 0)
      const end = new Date(start.getTime() + 60 * 60 * 1000)

      setDate(formattedDate)
      setStartTime(`${pad(start.getHours())}:${pad(start.getMinutes())}`)
      setEndTime(`${pad(end.getHours())}:${pad(end.getMinutes())}`)
      setServiceID("")
      setEmployeeId("")
      setCustomerId("")
    }
  }, [initialData])

  const handleSave = () => {
    if (!serviceID || !customerId || !employeeId) {
      alert("Please fill all required fields.")
      return
    }

    // const session: Session = {
    //   id: initialData?.id ?? crypto.randomUUID(),
    //   title: title || "New Session",
    //   status: initialData?.status ?? "new",
    //   type: "gym", // or derive from service selection
    //   start: new Date(`${date}T${startTime}`).toISOString(),
    //   end: new Date(`${date}T${endTime}`).toISOString(),
    //   totalPrice: 30, // set from service lookup later
    //   serviceId: serviceID,
    //   customerId,
    //   employeeId,
    //   customer: null,
    //   employee: null,
    //   createdAt: initialData?.createdAt ?? new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // }

    // onSave(session)
    // onClose()
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
                        ${employeeId === '' ? 'text-neutral-400'  : 'text-brand-primary' }`}
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
            >
            <option value="" disabled className="text-neutral-400">Select Employee</option>
            {employees.map((s) => (
                <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.role})
                </option>
            ))}
            </select>
          </div>

          {/* Customer */}
          <div className="flex flex-row items-center gap-10">
            <MdOutlinePeople className="w-7 h-7 text-gray-500" />
            <CustomerSelect
              customers={customers}
              value={selectedCustomer}
              onChange={(c) => setCustomerId(c?.id ?? "")}
              onSearch={onCustomerSearch}
              onCreateCustomer={() => setShowAddCustomerModal(true)}
            />
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
              {customerPackages.map((p) => (
                  <option key={p.id} value={p.id}>
                  {p.name} - {p.remaining} sessions left
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
                {services.map((s) => (
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

      {showAddCustomerModal && (
        <AddNewCustomer
          initialData={null}
          onClose={() => setShowAddCustomerModal(false)}
          onSave={async (data:Customer) => {
            const createdCustomer = await apiPost('/customers', data); // Replace with actual created customer
            setCustomerId(createdCustomer.id);
            onCustomerSearch(createdCustomer.firstName);
            setShowAddCustomerModal(false);
          }}
        />
      )}
    </div>
  )
}
