"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 mb-4 bg-white/80 dark:bg-black/40 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 relative z-50">
        {/* Brand/Logo */}
        <a href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-900 dark:text-white">
          <img src="/favicon.png" alt="Nexus Ping Logo" className="h-8 w-8" />
          <span>Nexus Ping</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex items-center gap-8 text-blue-900 dark:text-blue-100 font-medium text-base">
          <li><a href="/" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Home</a></li>
          <li><a href="/#features" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Features</a></li>
          <li><a href="/contact" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Contact</a></li>
        </ul>

        {/* Desktop Sign Up Button */}
        <a
          href="/signup"
          className="hidden sm:inline-block px-6 py-2 rounded-full bg-blue-700 text-white font-semibold text-base shadow hover:bg-blue-800 transition-colors"
        >
          Sign Up
        </a>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label="Open menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-900 dark:text-blue-100"
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" /> // X icon
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" /> // Hamburger icon
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden fixed top-0 left-0 w-full h-full bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 pt-24">
            <ul className="flex flex-col items-center gap-6 text-blue-900 dark:text-blue-100 font-medium text-xl">
              <li><a href="/" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors" onClick={() => setIsOpen(false)}>Home</a></li>
              <li><a href="/#features" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors" onClick={() => setIsOpen(false)}>Features</a></li>
              <li><a href="/contact" className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors" onClick={() => setIsOpen(false)}>Contact</a></li>
              <li>
                <a
                  href="/signup"
                  className="mt-4 w-full text-center px-8 py-3 rounded-full bg-blue-700 text-white font-semibold text-lg shadow hover:bg-blue-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </a>
              </li>
               <li>
                <a
                  href="/login"
                  className="mt-4 w-full text-center px-8 py-3 rounded-full bg-blue-700 text-white font-semibold text-lg shadow hover:bg-blue-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}