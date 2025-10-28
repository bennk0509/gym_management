"use client";
import { useState } from "react";
import {
  User,
  Building2,
  Bell,
  Lock,
  Save,
  Moon,
  Sun,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-10"
    >
      {/* --- Page Header --- */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          ⚙️ Settings
        </h1>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
          <Save size={16} /> Save Changes
        </button>
      </header>

      {/* --- Sections --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <User className="text-brand-600" size={18} />
            Profile
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Profile Photo</p>
              <button className="text-sm text-brand-600 hover:underline">
                Upload new photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="John Smith"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="admin@fitwell.com"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <Building2 className="text-brand-600" size={18} />
            Business Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Business Name</label>
              <input
                type="text"
                placeholder="FitWell Therapy & Gym"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Currency</label>
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none">
                <option>USD ($)</option>
                <option>CAD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tax Rate (%)</label>
              <input
                type="number"
                placeholder="13"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Working Hours</label>
              <input
                type="text"
                placeholder="Mon–Sat, 9 AM – 6 PM"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <Bell className="text-brand-600" size={18} />
            Preferences
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              {darkMode ? (
                <>
                  <Moon size={16} /> On
                </>
              ) : (
                <>
                  <Sun size={16} /> Off
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <Lock className="text-brand-600" size={18} />
            Security
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                placeholder="New password"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300 focus:border-brand-400 outline-none"
              />
            </div>
          </div>
          <button className="mt-2 text-sm text-brand-600 hover:underline">
            Forgot password?
          </button>
        </div>
      </div>
    </motion.div>
  );
}
