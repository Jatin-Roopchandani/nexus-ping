"use client";

import { useState } from 'react';

export default function DashboardLayout({ children, sidebar }: { children: React.ReactNode, sidebar: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-black bg-cover bg-center bg-no-repeat opacity-100 -z-10"
        style={{
          background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)"
        }}
      ></div>

      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white/20 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        <div className={`relative w-64 h-full bg-indigo-950 shadow-lg transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebar}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        {sidebar}
      </div>

      {/* Main content area */}
      <div className="flex-1 relative z-10 ">
        {children}
      </div>
    </div>
  );
}