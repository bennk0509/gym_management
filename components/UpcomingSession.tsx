"use client";
import {User, Dumbbell } from "lucide-react";

interface UpcomingSessionsCardProps {
  upcoming: {
    id: string;
    title: string;
    date: string;
    time: string;
    service: string;
    type: "gym" | "therapy";
    customer: string;
    employee: string;
  }[];
}
export default function UpcomingSessionsCard({upcoming}: UpcomingSessionsCardProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Upcoming Sessions
          </h3>
        </div>
        <span className="text-sm text-gray-400 font-medium">Next 4</span>
      </div>

      {/* Sessions List */}
      <div className="flex flex-col gap-3">
        {upcoming.length > 0 ? (
          upcoming.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-xl px-4 py-3"
            >
              {/* Left: Date + Type */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {new Date(s.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 mt-1 rounded-full w-fit capitalize font-medium ${
                    s.type === "gym"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {s.type}
                </span>
              </div>

              {/* Middle: Customer + Employee */}
              <div className="flex flex-col text-sm text-gray-700">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  <span className="font-medium">{s.customer}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Dumbbell size={14} className="text-gray-400" />
                  <span className="text-gray-600">{s.employee}</span>
                </div>
              </div>

              {/* Right: Time */}
              <div className="text-sm text-gray-500 font-medium">
              {s.time
              ? new Date(s.time).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : "—"}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8 text-sm">
            No upcoming sessions scheduled
          </div>
        )}
      </div>
    </div>
  );
}
