"use client"
import Card from "@/components/Card";
import DashboardHeader from "@/components/DashboardHeader";
import { Users, Activity, UserMinus, DollarSign, Table } from "lucide-react"
import TopServiceChart from "@/components/TopServiceChart";
import RevenueOverview from "@/components/RevenueOverview";
import TopEmployeesChart from "@/components/TopEmployeeChart";
import ActiveCustomersChart from "@/components/TopCustomerChart";
import UpcomingSessionsCard from "@/components/UpcomingSession";
import { useEffect, useState } from "react";
import { Dashboard } from "@/types/types";
import Skeleton from "@/components/Skeleton";
import { apiGet } from "@/lib/api";

export default function Home(){
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchDashboard() {
        try {
          setLoading(true);
          const data = await apiGet("/dashboard");
          setDashboard(data);
        } catch (error) {
          console.error("Failed to load dashboard:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchDashboard();
    }, []);

    if (loading) {
      return (
        <div className="p-10 space-y-8">
          <DashboardHeader title="Dashboard" buttonText="Generate Report" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
          </div>
          <div className="flex flex-row gap-4 mt-6">
            <Skeleton className="h-[300px] w-1/2" />
            <Skeleton className="h-[300px] w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full" />
            ))}
          </div>
        </div>
      );
    }
    if (!dashboard) return <p className="p-10">No dashboard data available.</p>;
  
    const {
      todaysRevenue,
      todaysSessions,
      newCustomersToday,
      activeCustomers,
      topServices,
      monthlyRevenue,
      topEmployees,
      activeCustomersList,
      upcomingSessions
    } = dashboard;
    
    return (
      <div className="p-10 space-y-8 max-h-screen">
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
          <RevenueOverview monthlyRevenue={monthlyRevenue}/>
          <TopServiceChart topServices={topServices}/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <TopEmployeesChart topEmployees={topEmployees}/>
          <ActiveCustomersChart customerActivity={activeCustomersList}/>
          <UpcomingSessionsCard upcoming={upcomingSessions}/>
        </div>
      </div>
    )
    
}