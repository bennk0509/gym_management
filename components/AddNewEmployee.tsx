import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MdClose } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { Employee } from "@/types/types";

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
  const [hireDate, setHireDate] = useState<Date | null>(new Date());
  const [role, setRole] = useState<
    "therapist" | "trainer" | "masseuse" | "admin"
  >("therapist");
  const [specialization, setSpecialization] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // preload data for edit
  useEffect(() => {
    if (initialData) {
      setLastName(initialData.lastName || "");
      setFirstName(initialData.firstName || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setHireDate(initialData.hireDate ? new Date(initialData.hireDate) : new Date());
      setRole(initialData.role || "therapist");
      setSpecialization(initialData.specialization || "");
      setSalary(initialData.salary || 0);
      setStatus(initialData.status || "active");
    }
  }, [initialData]);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === "firstName") {
      if (!value.trim()) newErrors.firstName = "First name is required";
      else delete newErrors.firstName;
    }

    if (name === "lastName") {
      if (!value.trim()) newErrors.lastName = "Last name is required";
      else delete newErrors.lastName;
    }

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        newErrors.email = "Invalid email format";
      else delete newErrors.email;
    }

    setErrors(newErrors);
  };

  const handleChange =
    <
      TElement extends
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement,
      TValue extends string | number
    >(
      setter: React.Dispatch<React.SetStateAction<TValue>>,
      field: string
    ) =>
    (e: React.ChangeEvent<TElement>) => {
      const value = e.target.value as TValue;
      setter(value);
      setHasChanged(true);
      validateField(field, String(value));
    };

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const requiredFilled = firstName.trim() && lastName.trim() && email.trim();
    setIsValid(Boolean(requiredFilled && !hasErrors));
  }, [errors, firstName, lastName, email, hireDate, role, salary]);

  const handleSave = () => {
    if (!isValid) return;

    const newEmployee: Employee = {
      id: initialData?.id || `e${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      hireDate: hireDate ? hireDate.toISOString().split("T")[0] : "",
      role,
      specialization,
      salary,
      status,
    };
    onSave(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <form
        className="bg-white rounded-2xl shadow-xl w-[600px] flex flex-col p-3 px-10 py-10 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-brand-primary text-2xl font-semibold">
              {initialData ? "Edit Employee" : "Add New Employee"}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? "Quickly Edit Employee" : "Quickly Add New Employee"}
            </p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <button type="button" onClick={onClose}>
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 py-3">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Name</p>
            <div className="flex flex-row gap-5 w-full">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleChange(setLastName, "lastName")}
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleChange(setFirstName, "firstName")}
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
          </div>
          {errors.firstName && (
            <span className="text-red-500 text-xs">{errors.firstName}</span>
          )}
          {errors.lastName && (
            <span className="text-red-500 text-xs">{errors.lastName}</span>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Email</p>
            <input
              type="email"
              placeholder="example@gym.com"
              value={email}
              onChange={handleChange(setEmail, "email")}
              className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}

          {/* Hire Date + Phone */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Hire Date</p>
              <DatePicker
                selected={hireDate}
                onChange={(d) => setHireDate(d)}
                placeholderText="Hire Date"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Phone Number</p>
              <input
                type="tel"
                placeholder="(+84) 82 828 8288"
                value={phone}
                onChange={handleChange(setPhone, "phone")}
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
          </div>

          {/* Role + Specialization */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Role</p>
              <select
                value={role}
                onChange={handleChange(setRole, "role")}
                className="appearance-none p-2 border rounded-md border-neutral-300 text-brand-primary text-sm bg-white"
              >
                <option value="therapist">Therapist</option>
                <option value="trainer">Trainer</option>
                <option value="masseuse">Masseuse</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Specialization</p>
              <input
                type="text"
                placeholder="e.g., Strength Training"
                value={specialization}
                onChange={handleChange(setSpecialization, "specialization")}
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
          </div>

          {/* Salary + Status */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Salary</p>
              <input
                type="number"
                placeholder="Enter Salary"
                value={salary}
                onChange={handleChange(setSalary as any, "salary")}
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Status</p>
              <div className="relative">
                <select
                  value={status}
                  onChange={handleChange(setStatus, "status")}
                  className={`appearance-none p-2 border rounded-md border-neutral-300 text-sm text-brand-primary bg-white pr-8
                    ${status === "active" ? "pl-8" : "pl-8"}
                  `}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                    status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex pt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={`p-2 w-full rounded-xl font-bold ${
              isValid && hasChanged
                ? "bg-accent-primary text-brand-primary"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {initialData ? "Update" : "Save"}
          </button>
        </footer>
      </form>
    </div>
  );
}
