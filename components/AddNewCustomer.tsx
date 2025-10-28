import { HiExternalLink, HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdClose, MdDateRange, MdEmail, MdMenuOpen, MdOutlinePeople, MdPeopleAlt, MdPhone } from "react-icons/md";
import CustomerSelect from "./CustomerSelect";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Customer } from "@/data/sessions";

interface AddNewCustomerProps {
  onClose: () => void
  onSave: (customer: Customer) => void
  initialData?: Customer | null
}

export default function AddNewCustomer({
    onClose,
    onSave,
    initialData
}: AddNewCustomerProps){
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [notes, setNotes] = useState("");
    const [membershipType, setMembershipType] = useState<
        "basic" | "premium" | "vip"
    >("basic");
    const [status, setStatus] = useState<"active" | "inactive">("active");

    useEffect(() => {
        if (initialData) {
          setLastName(initialData.lastName || "");
          setFirstName(initialData.firstName || "");
          setEmail(initialData.email || "");
          setPhone(initialData.phone || "");
          setNotes(initialData.notes || "");
          setMembershipType(initialData.membershipType || "basic");
          setStatus(initialData.status || "active");
          setDate(initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : null);
        }
      }, [initialData]);

    const handleSave = () => {
        const newCustomer: Customer = {
          id: initialData?.id || `c${Date.now()}`, // create or reuse ID
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth: date ? date.toISOString().split("T")[0] : "", // convert to YYYY-MM-DD
          membershipType,
          joinDate: initialData?.joinDate || new Date().toISOString().split("T")[0],
          status,
          notes,
        };
    
        onSave(newCustomer);
        onClose(); // close after saving
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form className="bg-white rounded-2xl shadow-xl w-[600px] flex flex-col p-3 px-5 py-5 gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-brand-primary font-heading text-lg font-semibold">
              {initialData ? "Edit Customer" : "New Customer"}
              </h3>
              <div className="flex flex-row items-center gap-4">
                <button type="button">
                  <HiExternalLink className="w-5 h-5 text-gray-500" />
                </button>
                <button type="button" onClick={onClose}>
                  <MdClose className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
    
            {/* Form Fields */}
            <div className="flex flex-col gap-5 py-3">
                {/* NAME */}
                <div className="flex flex-row gap-10 items-center">
                    <MdPeopleAlt className="w-7 h-7 text-gray-500" />
                    <div className="flex flex-row gap-10 w-full">
                        <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
                        />
                        <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
                        />
                    </div>
                </div>
                {/* EMAIL */}
                <div className="flex flex-row items-center gap-10">
                    <MdEmail className="w-7 h-7 text-gray-500" />
                    <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
                    />
                </div>
              {/* Date and Time */}
              <div className="flex flex-row items-center gap-10">
                <div className="flex flex-row items-center gap-10">
                    <MdDateRange className="w-7 h-7 text-gray-500" />
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        placeholderText="Date of birth"
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="
                        p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
                    />
                </div>

                <div className="flex flex-row items-center gap-10">
                    <MdPhone className="w-7 h-7 text-gray-500" />
                    <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(+84) 82 828 8288"
                    className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
                    />
                </div>
              </div>

              <div className="flex flex-row items-center gap-10">
                <HiOutlineMenuAlt2 className="w-7 h-7 text-gray-500" />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes"
                  className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
                />
              </div>
            </div>
    
            {/* Footer */}
            <footer className="flex pt-5">
              <button
                type="button"
                onClick={handleSave}
                className="bg-accent-primary text-brand-primary p-2 w-full rounded-xl font-bold"
              >
                {initialData ? "Update" : "Save"}
              </button>
            </footer>
          </form>
        </div>
      )
}