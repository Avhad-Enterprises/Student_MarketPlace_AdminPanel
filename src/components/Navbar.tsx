"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <a href="#" className="text-lg font-semibold">StudentMarketplace</a>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-sm text-gray-700">Home</a>
        </nav>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="container py-2">
            <a href="#" className="block py-2 text-gray-700">Home</a>
          </div>
        </div>
      )}
    </header>
  );
}
