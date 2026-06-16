"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/20 border-b border-white/30 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-white/40 p-1.5 rounded-xl border border-white/50 shadow-sm group-hover:scale-105 group-hover:bg-white/60 transition-all duration-200">
            <svg 
              className="w-5 h-5 text-amalfi" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Notebook spine/cover */}
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              {/* Notebook page lines */}
              <path d="M9 7h7" strokeWidth="2" opacity="0.6" />
              <path d="M9 11h7" strokeWidth="2" opacity="0.6" />
              {/* Pen drawing */}
              <path d="M19 12l2.5-2.5a1 1 0 0 0 0-1.4l-1.1-1.1a1 1 0 0 0-1.4 0L16.5 9.5" strokeWidth="2" />
              <path d="M15 15l4-4" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-xl text-amalfi tracking-tight font-sans">
            FirstDraft
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className={`text-sm font-semibold px-4.5 py-2 rounded-full transition-all duration-200 ${
              pathname === "/" 
                ? "bg-amalfi text-white shadow-sm" 
                : "text-amalfi/80 hover:text-amalfi hover:bg-white/20"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-semibold px-4.5 py-2 rounded-full transition-all duration-200 ${
              pathname === "/about" 
                ? "bg-amalfi text-white shadow-sm" 
                : "text-amalfi/80 hover:text-amalfi hover:bg-white/20"
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
