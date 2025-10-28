"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCog,
  CalendarDays,
  DollarSign,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpanded(expanded === label ? null : label);
  };

  const navItems = [
    { label: "Main", href: "/main", icon: BarChart3 },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Employees", href: "/employees", icon: UserCog },
    { label: "Sessions", href: "/sessions", icon: CalendarDays },
    { label: "Revenue", href: "/revenue", icon: DollarSign },
    { label: "Payments", href: "/revenue/payments", icon: Wallet },
    {
      label: "Expenses",
      icon: Briefcase,
      children: [
        { label: "Operational Cost", href: "/revenue/expense/operation-cost" },
        { label: "Payroll", href: "/revenue/expense/payrolls" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 240 : 80 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white border-r border-gray-200 shadow-xl flex flex-col"
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <motion.h1
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-bold text-lg text-brand-primary overflow-hidden whitespace-nowrap"
          >
            FitWell Admin
          </motion.h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-brand-700 transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href || "");
            const Icon = item.icon;

            // ---- Parent item with children (expandable)
            if (item.children) {
              const isExpanded = expanded === item.label;

              return (
                <div key={item.label}>
                  <div
                    onClick={() => toggleExpand(item.label)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200 ${
                      isExpanded
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className={isExpanded ? "text-brand-700" : "text-gray-400"}
                      />
                      {isOpen && <span className="font-medium">{item.label}</span>}
                    </div>

                    {isOpen && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    )}
                  </div>

                  {/* Animated Submenu */}
                  <AnimatePresence>
                    {isExpanded && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 border-l border-gray-100 pl-3"
                      >
                        {item.children.map((child) => {
                          const childActive = pathname.startsWith(child.href);
                          return (
                            <Link key={child.href} href={child.href}>
                              <div
                                className={`flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition cursor-pointer ${
                                  childActive
                                    ? "bg-brand-100 text-brand-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                <span className="text-sm font-medium">
                                  {child.label}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // ---- Regular single nav item
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-brand-100 text-brand-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    size={20}
                    className={active ? "text-brand-700" : "text-gray-400"}
                  />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Settings */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Settings size={20} className="text-gray-400" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main
        layout
        className="flex-1 overflow-y-auto"
        transition={{ duration: 0.4 }}
      >
        <div className="min-h-screen bg-gray-50">{children}</div>
      </motion.main>
    </div>
  );
}
