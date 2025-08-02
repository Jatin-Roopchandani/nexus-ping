import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 px-2 sm:px-6 mb-4 bg-white/80 dark:bg-black/40 rounded-xl shadow border border-blue-100 dark:border-blue-900">
      <ul className="hidden sm:flex gap-8 text-blue-900 dark:text-blue-100 font-medium text-base">
        <li><a href="/" className="hover:text-blue-700 transition-colors">Home</a></li>
        <li><a href="/#features" className="hover:text-blue-700 transition-colors">Features</a></li>
        <li><a href="/contact" className="hover:text-blue-700 transition-colors">Contact</a></li>
      </ul>
      <a
        href="/signup"
        className="hidden sm:inline-block ml-6 px-6 py-2 rounded-full bg-blue-700 text-white font-semibold text-base shadow hover:bg-blue-800 transition-colors"
      >
        Sign Up
      </a>
      <button className="sm:hidden p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900" aria-label="Open menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900 dark:text-blue-100"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
    </nav>
  );
}
