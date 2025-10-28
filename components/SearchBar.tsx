import { useState } from "react"
import { Session, mockSessions } from "@/data/sessions"
import SessionCard from "./SessionCard"

export default function SearchBar({ onSelect }: {onSelect?: (session: Session) => void})
{

    const [searchType, setSearchType] = useState("session")
    const [query, setQuery] = useState("")
    const [dateRange, setDateRange] = useState({ start: "", end: "" })
    const [results, setResults] = useState<Session[]>([])
    const handleSearch = () => {
        const filtered = mockSessions.filter((s) => {
        let match = true

        // search type matching
        if (searchType === "session") {
            match = s.title.toLowerCase().includes(query.toLowerCase())
        } else if (searchType === "customer") {
            match = s.customer.toLowerCase().includes(query.toLowerCase())
        } else if (searchType === "employee") {
            match = s.employee.toLowerCase().includes(query.toLowerCase())
        }

        if (dateRange.start && dateRange.end) {
            const sessionDate = new Date(s.date)
            const startDate = new Date(dateRange.start)
            const endDate = new Date(dateRange.end)
            match = match && sessionDate >= startDate && sessionDate <= endDate
        }

        return match
        })
        setResults(filtered)
    }
    const clearSearch = () => {
        setResults([]);
        setSearchType("session");
        setQuery("");
        setDateRange({ start: "", end: "" });
    }
    return(
        <div>
            <h3 className="font-semibold mb-2">Search</h3>
            <div className="flex-col p-4 gap-2">
                <div className="flex flex-col gap-5 mb-3">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Search By</label>
                        <select
                            className="
                                w-full
                                rounded-xl
                                bg-neutral-light
                                shadow-sm
                                transition
                                relative
                                text-sm
                                p-2
                                font-semibold
                            "
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                        <option value="session">Session Name</option>
                        <option value="customer">Customer Name</option>
                        <option value="employee">Employee Name</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium">Keyword</label>
                        <input
                            type="text"
                            className="w-full shadow-md rounded-xl p-2 bg-neutral-light text-sm" 
                            placeholder={`Enter ${searchType === 'session' ? "Session" : searchType === 'customer' ? "Customer" : "Employee"}...`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />   
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            className="w-full shadow-md rounded-xl p-2 bg-neutral-light text-sm"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            className="w-full shadow-md rounded-xl p-2 bg-neutral-light text-sm"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-1">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-accent-primary font-semibold py-2 rounded-xl hover:bg-accent-800 transition mt-5"
                    >
                        Search
                    </button>

                    <button
                        onClick={clearSearch}
                        className= "p-2 rounded-xl hover:underline transition mt-5"
                    >
                        Clear
                    </button>
                </div>
                <div className="mt-4">
                    {results.length === 0 ? (
                        <p className="text-gray-500 text-sm">No results found</p>
                    ) : (
                        <div className="max-h-60 overflow-y-auto grid gap-3">
                        {results.map((r: Session) => (
                            <div key={r.id} onClick={() => onSelect?.(r)} className="cursor-pointer">
                                <SessionCard {...r} />
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            {/* <div>
                <h3 className="text-sm font-semibold mb-2">Search</h3>
                <Autocomplete
                freeSolo
                options={searchOptions}
                getOptionLabel={(option) => option.label || ""}
                renderOption={(props, option) => (
                    <li {...props}>
                    {option.label} <span className="ml-2 text-gray-400 text-xs">({option.type})</span>
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Search sessions" size="small" />
                )}
                onChange={(e, value) => {
                    if (value) {
                    console.log("Selected:", value)
                    // TODO: filter your calendar events here
                    }
                }}
                />
            </div> */}
        </div>
    )
}