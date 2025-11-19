"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserCog,
  CalendarDays,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navItems = [
    { label: "Main", href: "/main", icon: BarChart3 },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Employees", href: "/employees", icon: UserCog },
    { label: "Sessions", href: "/sessions", icon: CalendarDays },
    {
      label: "Revenue",
      icon: Briefcase,
      href: "/revenue", // dashboard page
      children: [
        { label: "Payments", href: "/revenue/payments", icon: Wallet },
        {
          label: "Expenses",
          icon: Briefcase,
          children: [
            { label: "Operational Cost", href: "/revenue/expense/operation-cost" },
            { label: "Payroll", href: "/revenue/expense/payrolls" },
          ],
        },
      ],
    },
  ];

  const RenderNavItem = ({
    item,
    depth = 0,
  }: {
    item: any;
    depth?: number;
  }) => {
    const isExpanded = expanded[item.label];
    const active = pathname.startsWith(item.href || "");
    const Icon = item.icon;

    // --- Parent with children
    if (item.children) {
      return (
        <div key={item.label}>
          <div
            className={`group flex items-center justify-between gap-3 px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isExpanded
                ? "bg-brand-50 text-brand-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ paddingLeft: `${16 + depth * 12}px` }}
          >
            {/* Make parent label a clickable link */}
            <Link
              href={item.href || "#"}
              className="flex items-center gap-3 flex-1"
            >
              {Icon && (
                <Icon
                  size={20}
                  className={isExpanded ? "text-brand-700" : "text-gray-400"}
                />
              )}
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>

            {/* Expand / collapse toggle */}
            {isOpen && (
              <motion.button
                onClick={() => toggleExpand(item.label)}
                className="p-1 rounded-md hover:bg-gray-100"
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-4 border-l border-gray-100 pl-3"
              >
                {item.children.map((child: any) => (
                  <RenderNavItem key={child.label} item={child} depth={depth + 1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // --- Regular leaf link
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
          style={{ paddingLeft: `${16 + depth * 12}px` }}
        >
          {Icon && (
            <Icon size={20} className={active ? "text-brand-700" : "text-gray-400"} />
          )}
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-sm"
            >
              {item.label}
            </motion.span>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 240 : 80 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white border-r border-gray-200 shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <motion.h1
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-bold text-lg text-brand-primary overflow-hidden whitespace-nowrap"
          >
            HT Private Gym
          </motion.h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-brand-700 transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <RenderNavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Footer */}
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
                  className="text-sm"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main layout className="flex-1 overflow-y-auto" transition={{ duration: 0.4 }}>
        <div className="min-h-screen bg-gray-50">
          {children}
          <Toaster 
            position="top-center" 
            theme="light"
            richColors
            expand={true} // tự động mở rộng khi nhiều toast
            closeButton // thêm nút close
            toastOptions={{
              style: { borderRadius: '10px', fontSize: '15px', fontWeight: 500 },
              className: 'shadow-lg border border-gray-200',
            }}
          />
        </div>
      </motion.main>
    </div>
  );
}
