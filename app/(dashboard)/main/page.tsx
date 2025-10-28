"use client"
import Card from "@/components/Card";
import DashboardHeader from "@/components/DashboardHeader";
import { Users, Activity, UserMinus, DollarSign, Table } from "lucide-react"
import { mockSessions, mockCustomers, mockEmployees, mockServices } from "@/data/sessions"
import TopServiceChart from "@/components/TopServiceChart";
import RevenueOverview from "@/components/RevenueOverview";
import TopEmployeesChart from "@/components/TopEmployeeChart";
import ActiveCustomersChart from "@/components/TopCustomerChart";
import UpcomingSessionsCard from "@/components/UpcomingSession";



export default function Home(){
    const today = new Date().toISOString().split("T")[0]
    const todaysRevenue = mockSessions
    .filter(s => s.status === "done" && s.date === today)
    .reduce((sum, s) => sum + s.totalPrice, 0)
    const todaysSessions = mockSessions.filter(s => s.date === today).length

    const newCustomersToday = mockCustomers.filter(c => c.joinDate === today).length

    const activeCustomers = mockCustomers.filter(c => c.status === "active").length


    const revenueByService: Record<string, number> = {}
      mockSessions.forEach(s => {
        if (s.status === "done") {
          revenueByService[s.serviceId] = (revenueByService[s.serviceId] ?? 0) + s.totalPrice
        }
    })

    const totalRevenue = Object.values(revenueByService).reduce((a, b) => a + b, 0)

    const topServices = mockServices
      .map(service => ({
        ...service,
        percent: totalRevenue
          ? Math.round(((revenueByService[service.id] ?? 0) / totalRevenue) * 100)
          : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5)
    return (
      <div className="p-10 space-y-8 h-screen">
        {/* Header */}
        <DashboardHeader
          title="Dashboard"
          buttonText="Generate Report"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="Today's Revenue"
              number={todaysRevenue}
              prefix="$"
              date={new Date().toLocaleDateString()}
              icon={<DollarSign className="text-green-600" />}
              durationSec={1.2}
            />

            <Card
              title="Today's Sessions"
              number={todaysSessions}
              date={new Date().toLocaleDateString()}
              icon={<Activity className="text-blue-600" />}
              durationSec={1.2}
            />

            <Card
              title="New Customers"
              number={newCustomersToday}
              date={new Date().toLocaleDateString()}
              icon={<UserMinus className="text-red-600" />}
              durationSec={1.2}
            />

            <Card
              title="Active Customers"
              number={activeCustomers}
              date={new Date().toLocaleDateString()}
              icon={<Users className="text-brand-700" />}
              durationSec={1.2}
            />
        </div>
        <div className="flex flex-row gap-4">
          <RevenueOverview/>
          <TopServiceChart topServices={topServices}/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <TopEmployeesChart />
          <ActiveCustomersChart/>
          <UpcomingSessionsCard/>
        </div>
      </div>
    )
    
}