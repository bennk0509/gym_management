"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/image.svg";

export default function Navbar() {
  return (
    <nav className="bg-[#1E1E1E] px-6 md:px-20 py-4 shadow-md fixed w-full z-50">
      <div className="w-full flex flex-row items-center justify-between h-[46px] text-[20px] tracking-wide">
        
        {/* Logo + Title */}
        <Link href="/" className="flex flex-row items-center gap-2">
          <img 
            src="/image.svg"
            alt="HT Logo" 
            className="h-16 w-auto" />
          <h1 className="text-3xl text-white font-branding font-semibold">
            HT Massage Therapy
          </h1>
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex flex-row gap-10 items-center text-white">
          <li className="font-branding"><Link href="/about">About</Link></li>
          <li className="font-branding"><Link href="/blog">Blog</Link></li>
          <li className="font-branding"><Link href="/services">Services</Link></li>
          <li className="font-branding"><Link href="/contact">Contact</Link></li>
          <li className="font-branding">
            <Link
              href="/login"
              className="bg-[#FFC107] p-2 px-10 rounded-full text-[#1E1E1E] font-medium"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
