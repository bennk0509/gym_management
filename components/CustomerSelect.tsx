import { useState, useEffect } from "react"
import { mockCustomers, Customer } from "@/data/sessions"

export default function CustomerSelect({
  value,
  onChange,
}: {
  value: Customer | null
  onChange: (c: Customer | null) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // ✅ Keep searchTerm synced with prop value (for edit mode)
  useEffect(() => {
    if (value) {
      setSearchTerm(`${value.firstName} ${value.lastName}`)
    } else {
      setSearchTerm("")
    }
  }, [value])

  const filteredCustomers = mockCustomers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase()
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleSelect = (customer: Customer) => {
    onChange(customer)
    setSearchTerm(`${customer.firstName} ${customer.lastName}`)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Select Customer (optional)"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
      />

      {isOpen && searchTerm && (
        <ul className="absolute top-10 left-0 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg z-10">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((c) => (
              <li
                key={c.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelect(c)}
              >
                {c.firstName} {c.lastName} —{" "}
                <span className="text-gray-500">{c.email}</span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500 text-sm">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}
