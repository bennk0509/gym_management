"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Briefcase,
  DollarSign,
  Tag,
  Clock,
} from "lucide-react";
import { Session } from "@/types/types";


interface SessionDetailProps {
  session: Session | null;
  onClose: () => void;
  onEdit?: (session: Session) => void;
  onMarkComplete?: (session: Session) => void;
  onDelete?: (session: Session) => void;
}

/**
 * A self-contained right-side drawer for session details
 * No external UI libraries required
 */
const SessionDetail: React.FC<SessionDetailProps> = ({
  session,
  onClose,
  onEdit,
  onMarkComplete,
  onDelete,
}) => {
  // prevent body scroll while open
  useEffect(() => {
    if (session) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [session]);

  return (
    <AnimatePresence>
      {session && (
        <>
          {/* dark backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* sliding drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 25 }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Tag className="w-5 h-5 text-[#FFC107]" />
                {session.title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* main content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* session info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2" />
                  {session.date}
                </div>
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium mr-1">Customer:</span>
                  {session.customer}
                </div>
                <div className="flex items-center text-gray-700">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span className="font-medium mr-1">Employee:</span>
                  {session.employee}
                </div>
                <div className="flex items-center text-gray-700">
                  <Tag className="w-5 h-5 mr-2" />
                  <span className="font-medium mr-1">Service:</span>
                  session.service
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-medium mr-1">Total:</span>
                  <span className="text-emerald-600 font-semibold">
                    ${session.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    session.status === "done"
                      ? "bg-green-100 text-green-700"
                      : session.status === "cancel"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {session.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(session)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  {session.status !== "done" && (
                    <button
                      onClick={() => onMarkComplete?.(session)}
                      className="px-3 py-1.5 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white"
                    >
                      Mark Done
                    </button>
                  )}

                  <button
                    onClick={() => onDelete?.(session)}
                    className="px-3 py-1.5 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionDetail;
