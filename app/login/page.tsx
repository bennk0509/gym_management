"use client";

import { apiPost } from "@/lib/api";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
  
    try {
      const res = await apiPost("/auth/login", {
        email,
        password,
      });
  
      // If successful login:
      window.location.href = "/main";
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  }
  

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#1E1E1E]/80 backdrop-blur-md border border-[#2b2b2b] p-10 rounded-2xl max-w-md w-full shadow-xl">
        
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[#121212] text-white placeholder-gray-500 
                         border border-[#333] focus:border-[#FFC107] outline-none transition-all"
              placeholder="admin@gymfit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[#121212] text-white placeholder-gray-500 
                         border border-[#333] focus:border-[#FFC107] outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#FFC107] text-black font-semibold py-3 rounded-lg
                       hover:bg-[#e6a800] transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* subtle footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Gym & Therapy Admin Portal © 2025
        </p>
      </div>
    </div>
  );
}
