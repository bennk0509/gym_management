"use client"
import CalendarHeader from "@/components/CalendarHeader"
import DailyCalendarView from "@/components/DailyCalendarView"
import WeeklyCalendarView from "@/components/WeeklyCalendarView"
import MonthlyCalendarView from "@/components/MonthlyCalendarView"
import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"

import { Customer, Employee, Service, Session, SessionStatus } from "@/types/types"
import AddSessionModal from "@/components/AddSessionModal"
import PaymentSummaryModal from "@/components/AddPaymentModal"
import { apiDelete, apiGet, apiPatch } from "@/lib/api"
import { toast } from "sonner"
type View = "day" | "week" | "month"

export default function Sessions() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<View>("week")
    const [filters, setFilters] = useState<SessionStatus[] | "all">("all")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [paymentSession, setPaymentSession] = useState<Session | null>(null)
    const [showPayment, setShowPayment] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [editSession, setEditSession] = useState<Session | null>(null)
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    useEffect(() => {
        if (customerSearchTerm.length < 1) return setCustomers([])

        const timeout = setTimeout(async () => {
            const res = await apiGet(`/customers?search=${customerSearchTerm}&take=10`)
            setCustomers(res.data)
        }, 250)

        return () => clearTimeout(timeout)
    }, [customerSearchTerm])

    useEffect(() => {
        async function fetchData() {
            const [sessionsData, employeesData, servicesData] = await Promise.all([
                apiGet("/sessions"),
                apiGet("/employees"),
                apiGet("/services"),
            ])
            setSessions(sessionsData);
            setEmployees(employeesData);
            setServices(servicesData);
        }
        fetchData()
    }, [])


    const filteredSessions = sessions.filter((s) =>
        filters === "all" ? true : filters.includes(s.status)
    )
    const handleSaveSession = (updatedSession: Session) => {
        if (editSession) {
          setSessions((prev) =>
            prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
          );
          toast.success("Session updated successfully!");
          setEditSession(null);
        } else {
          setSessions((prev) => [...prev, updatedSession]);
          toast.success("Session created successfully!");
        }
      
        setShowModal(false);
      };
      
    const handleStartEdit = (session: Session) => {
        console.log(session);
        setEditSession(session)
        setShowModal(true)
    }

    const handleDeleteSession = (sessionToDelete: Session) => {
        const ok = window.confirm(
            `Are you sure you want to delete the session "${sessionToDelete.title}"?`
        )
    
        if (!ok) return
        toast.promise(
            apiDelete(`/sessions/${sessionToDelete.id}`),
            {
              loading: "Deleting...",
              success: "Session deleted.",
              error: "Failed to delete session.",
            }
          )
        
        setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id))
    }
    const handleClose = () => {
        setEditSession(null)
        setShowModal(false)
        setShowPayment(false);
    }
    const handleOpenPayment = async (session: Session) => {
        if (session.packageId) {
            const updated = await apiPatch(`/sessions/${session.id}/complete`, {});   
            setSessions((prev) =>
                prev.map((s) => (s.id === session.id ? updated : s))
            );
            toast.success("Session marked as complete (package used)");
        } else {
            setPaymentSession(session);
            setShowPayment(true);
        }
    };  
    // const handleConfirmPayment = async (sessions, tip, method, tax) => {
    //     try {
    //     const updated = await apiPatch(`/sessions/${session.id}/complete`, {
    //         amount: session.totalPrice, // or amountPaid nếu bạn cho nhập custom price
    //         tip,
    //         tax,
    //         method,
    //     });

    //     // Update Sessions in UI
    //     setSessions((prev) =>
    //         prev.map((s) => (s.id === session.id ? updated : s))
    //     );

    //     toast.success("Payment successful! Session marked as complete.");
    // } catch (error: any) {
    //     toast.error(error?.response?.data?.message || "Payment failed");
    // }

    // setShowPayment(false);
    // setPaymentSession(null);
    // }  
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <aside className = {`fixed md:static
                                    top-0 left-0
                                    h-screen md:h-auto
                                    min-w-64 max-w-72
                                    p-4 flex flex-col gap-10
                                    bg-white md:shadow-none
                                    transform transition-transform duration-300
                                    shadow-md border border-gray-200
                                    z-40 rounded-xl
                                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`
                }>
                    <div className="font-heading text-lg md:text-xl text-brand-800">
                        SESSIONS
                    </div>
                    <button className = "bg-accent-primary py-4 px-3 rounded-2xl border border-neutral-200 font-extrabold"
                            onClick={() => {setShowModal(true)}}>
                        Add New Session
                    </button>
                    <SearchBar
                        onSelect = {(session)=>{
                            setCurrentDate(session.start)
                            setViewMode("day")
                        }}/>
                    <FilterBar selectedFilters={filters} onChange={setFilters}/>
                </aside>

                <main className="flex-1 w-full bg-neutral-100 rounded-xl border border-l-0 border-gray-200 overflow-y-auto">
                    <CalendarHeader
                        initialDate={currentDate}
                        initialView={viewMode}
                        onChange={(date, view) => {
                        setCurrentDate(date)
                        setViewMode(view)
                        }}
                    />
                    {/* {viewMode === "week" && <WeeklyCalendarView date={currentDate} />} */}
                    {viewMode === "month" &&
                        <MonthlyCalendarView
                            date={currentDate}
                            events = {filteredSessions}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteSession}
                            onMarkComplete={handleOpenPayment}/>}
                    {viewMode === "week" &&
                        <WeeklyCalendarView
                            date={currentDate}
                            events = {filteredSessions}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteSession}
                            onMarkComplete={handleOpenPayment}/>}

                    {viewMode === "day" &&
                        <DailyCalendarView
                            date={currentDate}
                            events = {filteredSessions}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteSession}
                            onMarkComplete={handleOpenPayment}/>}
                </main>
            </div>
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-accent-primary text-white px-3 py-2 rounded-md shadow-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                ≡
            </button>
            {showModal && (
                <AddSessionModal
                    onClose={handleClose}
                    onSave={handleSaveSession}
                    initialData={editSession}
                    customers={customers}
                    employees={employees}
                    services={services}
                    onCustomerSearch={setCustomerSearchTerm}
                />
            )}
            {showPayment && paymentSession && (
                <PaymentSummaryModal
                    session={paymentSession}
                    onClose={() => {
                    setShowPayment(false)
                    setPaymentSession(null)
                    }}
                    onConfirm={async (session, tip, method, tax, amountPaid) => {
                        try {
                            console.log(session,tip,method,tax, amountPaid);
                            const updated = await apiPatch(`/sessions/${session.id}/complete`, {
                                amount: amountPaid,   // hoặc amountPaid nếu bạn cho user sửa
                                tip,
                                tax,
                                method,
                            });
                            setSessions((prev) =>
                                prev.map((s) => (s.id === session.id ? updated : s))
                            );
                    
                            toast.success("Payment recorded and session marked as complete!");
                        } catch (err: any) {
                            toast.error(err?.response?.data?.message || "Payment failed.");
                        }
                    
                        setShowPayment(false);
                        setPaymentSession(null);
                    }}
                    
                />
            )}
        </div>

    )
}

