import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { Packages, Employee, SessionType} from "@/types/types";
interface AddNewPackageProps {
  onClose: () => void;
  onSave: (pkg: Packages) => void;
  initialData?: Packages | null;
  trainers?: Employee[]; // list of PTs or therapists to pick from
  customerId: string; // passed from parent (customer profile page)
}

export default function AddNewPackage({
  onClose,
  onSave,
  initialData,
  trainers,
  customerId,
}: AddNewPackageProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<SessionType>("gym");
  const [totalSessions, setTotalSessions] = useState<number>(10);
  const [price, setPrice] = useState<number>(0);
  const [trainerId, setTrainerId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setType(initialData.type || "gym");
      setTotalSessions(initialData.totalSessions || 10);
      setPrice(initialData.price || 0);
      setStartDate(initialData.startDate ? new Date(initialData.startDate) : new Date());
      setNotes(initialData.notes || "");
    }
  }, [initialData]);

  useEffect(() => {
    const filled = name.trim() && totalSessions > 0 && price > 0;
    setIsValid(Boolean(filled));
  }, [name, totalSessions, price]);

  const handleSave = () => {
    if (!isValid) return;

    const pkg: Packages = {
      name,
      type,
      totalSessions,
      price,
      trainerId,
      status: "ACTIVE",
      startDate: startDate ? startDate.toISOString() : new Date().toISOString(),
      customerId,
      notes,
    };

    onSave(pkg);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <form
        className="bg-white rounded-2xl shadow-xl w-[600px] flex flex-col p-10 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-brand-primary text-2xl font-semibold">
              {initialData ? "Edit Package" : "Add New Package"}
            </h3>
            <p className="text-sm text-gray-500">
              {initialData ? "Update service package" : "Assign a new package to customer"}
            </p>
          </div>
          <button type="button" onClick={onClose}>
            <MdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Package Name</p>
            <input
              type="text"
              placeholder="Private Gym 10 Sessions"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setHasChanged(true);
              }}
              className="p-2 border rounded-md border-neutral-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Type</p>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as SessionType);
                  setHasChanged(true);
                }}
                className="p-2 border rounded-md border-neutral-300 text-sm"
              >
                <option value="gym">Gym</option>
                <option value="therapy">Therapy</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Total Sessions</p>
              <input
                type="number"
                min={1}
                value={totalSessions}
                onChange={(e) => {
                  setTotalSessions(Number(e.target.value));
                  setHasChanged(true);
                }}
                className="p-2 border rounded-md border-neutral-300 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Assign Trainer / Therapist</p>
            <select
              value={trainerId}
              onChange={(e) => {
                setTrainerId(e.target.value);
                setHasChanged(true);
              }}
              className="p-2 border rounded-md border-neutral-300 text-sm"
            >
              <option value="">No assignment</option>
              {trainers?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Price</p>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                setHasChanged(true);
              }}
              className="p-2 border rounded-md border-neutral-300 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Notes</p>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setHasChanged(true);
              }}
              className="p-2 border rounded-md border-neutral-300 text-sm"
            />
          </div>
        </div>

        <footer className="flex pt-4">
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
            {initialData ? "Update Package" : "Save Package"}
          </button>
        </footer>
      </form>
    </div>
  );
}
