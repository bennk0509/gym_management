import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MdClose } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { Customer } from "@/types/types";
interface AddNewCustomerProps {
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialData: Customer | null;
}

export default function AddNewCustomer({
  onClose,
  onSave,
  initialData,
}: AddNewCustomerProps) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [membershipType] = useState<
    "basic" | "premium" | "vip"
  >("basic");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [joinDate, setJoinDate] = useState<Date | null>(new Date());

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
      setNotes(initialData.notes || "");
      setStatus(initialData.status || "active");
      setDate(initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : null);
      setJoinDate(initialData.joinDate ? new Date(initialData.joinDate) : new Date());
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
    TValue extends string
  >(
    setter: React.Dispatch<React.SetStateAction<TValue>>,
    field: string
  ) =>
  (e: React.ChangeEvent<TElement>) => {
    const value = e.target.value as TValue;
    setter(value);
    setHasChanged(true);
    validateField(field, value);
  };

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const requiredFilled =
      firstName.trim() && lastName.trim() && email.trim();
    setIsValid(Boolean(requiredFilled && !hasErrors));
  }, [errors, firstName, lastName, email, joinDate, status]);

  const handleSave = () => {
    if (!isValid) return; // guard

    const newCustomer: Customer = {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: date ? date.toISOString().split("T")[0] : "",
      membershipType,
      joinDate:
        initialData?.joinDate || new Date().toISOString().split("T")[0],
      status,
      notes,
    };

    onSave(newCustomer);
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
              {initialData ? "Edit Customer" : "Add New Customer"}
            </h3>
            <p className=" text-sm p-0 m-0 text-gray-500">{initialData ? "Quickly Edit Customer" : "Quickly Add New Customer"}</p>
          </div>   
          <div className="flex flex-row items-center gap-4">
            <button type="button" onClick={onClose}>
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        {/* Form */}
        <div className="flex flex-col gap-5 py-3">
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
          {/* <div className="flex flex-row gap-10 items-center">
            <MdPeopleAlt className="w-7 h-7 text-gray-500" />
            <div className="flex flex-row gap-10 w-full">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleChange(setLastName, "lastName")}
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
              />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleChange(setFirstName, "firstName")}
                className="p-2 w-full border-b border-neutral-200 text-brand-primary text-sm"
              />
            </div>
          </div> */}
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
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onChange={handleChange(setEmail, "email")}
              className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Date of birth</p>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                placeholderText="Date of birth"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Join Date</p>
              <DatePicker
                selected={joinDate}
                onChange={(d) => setDate(d)}
                placeholderText="Join Date"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
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
              {/* <button
                type="button"
                onClick={() =>
                  setStatus((prev) => (prev === "active" ? "inactive" : "active"))
                }
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  status === "active" ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    status === "active" ? "translate-x-7" : ""
                  }`}
                />
              </button> */}
            </div>
          </div>
          {/* Notes */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Notes</p>
            <textarea
              placeholder="Notes"
              value={notes}
              rows = {5}
              cols = {40}
              onChange={handleChange(setNotes, "notes")}
              className="p-2 w-full border rounded-md border-neutral-300 text-brand-primary text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex pt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={`p-2 w-full rounded-xl font-bold ${
              (isValid && hasChanged)
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
