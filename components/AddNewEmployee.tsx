import { HiExternalLink, HiOutlineMenuAlt2 } from "react-icons/hi";
import {
  MdClose,
  MdDateRange,
  MdEmail,
  MdPeopleAlt,
  MdPhone,
  MdWork,
  MdAttachMoney,
  MdPercent,
} from "react-icons/md";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Employee } from "@/data/sessions";

interface AddNewEmployeeProps {
  onClose: () => void;
  onSave: (employee: Employee) => void;
  initialData?: Employee | null;
}

export default function AddNewEmployee({
  onClose,
  onSave,
  initialData,
}: AddNewEmployeeProps) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hireDate, setHireDate] = useState<Date | null>(null);
  const [role, setRole] = useState<"therapist" | "trainer" | "masseuse" | "admin">("therapist");
  const [specialization, setSpecialization] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      setLastName(initialData.lastName || "");
      setFirstName(initialData.firstName || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setHireDate(initialData.hireDate ? new Date(initialData.hireDate) : null);
      setRole(initialData.role || "therapist");
      setSpecialization(initialData.specialization || "");
      setSalary(initialData.salary || 0);
      setStatus(initialData.status || "active");
    }
  }, [initialData]);

  // Save handler
  const handleSave = () => {
    const newEmployee: Employee = {
      id: initialData?.id || `e${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      role,
      specialization,
      hireDate: hireDate ? hireDate.toISOString().split("T")[0] : "",
      status,
      salary,
    };

    onSave(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="bg-white rounded-2xl shadow-xl w-[600px] flex flex-col p-5 gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-brand-primary font-heading text-lg font-semibold">
            {initialData ? "Edit Employee" : "New Employee"}
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
          {/* Name */}
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-row items-center gap-10">
            <MdEmail className="w-7 h-7 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gym.com"
              className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
            />
          </div>

          {/* Hire Date + Phone */}
          <div className="flex flex-row items-center gap-10">
            <div className="flex flex-row items-center gap-10 w-full">
              <MdDateRange className="w-7 h-7 text-gray-500" />
              <DatePicker
                selected={hireDate}
                onChange={(d) => setHireDate(d)}
                placeholderText="Hire Date"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
              />
            </div>

            <div className="flex flex-row items-center gap-10 w-full">
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

          {/* Role + Specialization */}
          <div className="flex flex-row items-center gap-10">
            <MdWork className="w-7 h-7 text-gray-500" />
            <div className="flex flex-row gap-10 w-full">
            <select
                value={role}
                onChange={(e) =>
                    setRole(e.target.value as "therapist" | "trainer" | "masseuse" | "admin")
                }
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm bg-transparent focus:outline-none"
                >
                <option value="">Select Role</option>
                <option value="trainer">Trainer</option>
                <option value="therapist">Therapist</option>
                <option value="masseuse">Masseuse</option>
                <option value="admin">Admin</option>
            </select>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Specialization (e.g., Strength Training)"
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
              />
            </div>
          </div>

          {/* Hourly Rate + Commission */}
          <div className="flex flex-row items-center gap-10">
            <MdAttachMoney className="w-7 h-7 text-gray-500" />
            <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                placeholder="Hourly Rate"
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
            />
          </div>

          {/* Status */}
            <div className="flex flex-row items-center gap-10">
            <label className="text-gray-500 text-sm w-28">Status</label>
            <div className="relative w-full">
                <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                className={`appearance-none w-full border-b border-neutral-200 text-sm focus:outline-none bg-transparent pl-8 pr-8 py-2
                    ${
                    status === "active"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                </select>

                {/* Colored Dot */}
                <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                    status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
                />
            </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="flex pt-5">
          <button
            type="submit"
            className="bg-accent-primary text-brand-primary p-2 w-full rounded-xl font-bold hover:opacity-90 transition"
          >
            {initialData ? "Update" : "Save"}
          </button>
        </footer>
      </form>
    </div>
  );
}
