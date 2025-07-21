"use client";

import Image from "next/image";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FeaturesSection = dynamic(() => import('./FeaturesSection'), { ssr: false });

export default function Home() {
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    setShowFeatures(true);
  }, []);

  // If you want to keep the redirect logic, move it to a server component or middleware.

  return (
    <div
      className="min-h-screen flex flex-col p-6 sm:p-12 font-[family-name:var(--font-geist-sans)] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)",
      }}
    >
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 px-2 sm:px-6 mb-4 bg-white/80 dark:bg-black/40 rounded-xl shadow border border-blue-100 dark:border-blue-900">
        <ul className="hidden sm:flex gap-8 text-blue-900 dark:text-blue-100 font-medium text-base">
          <li><a href="#" className="hover:text-blue-700 transition-colors">Home</a></li>
          <li><a href="#features" className="hover:text-blue-700 transition-colors">Features</a></li>
          <li><a href="#status" className="hover:text-blue-700 transition-colors">Status</a></li>
          <li><a href="#contact" className="hover:text-blue-700 transition-colors">Contact</a></li>
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
      {/* Hero Section with Image */}
      <main className="flex flex-1 w-full max-w-6xl mx-auto items-center justify-center gap-12 mt-8 mb-8 flex-col md:flex-row min-h-[70vh]">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center items-start text-left gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-red-400 drop-shadow-sm">
            Uptime Monitoring Service
          </h1>
          <a
            href="/signup"
            className="inline-block mt-4 px-8 py-3 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors"
          >
            Get Started
          </a>
        </div>
        {/* Right: Example Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/example.png"
            alt="Example dashboard screenshot"
            className="rounded-xl shadow-lg border border-white/20 max-w-6xl w-full h-auto object-contain bg-white/5"
            style={{ maxHeight: '1000px', minWidth: '600px' }}
          />
        </div>
      </main>
      {/* Features Section (client-only, animated) */}
      {showFeatures && <FeaturesSection />}
      {/* Footer */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-blue-200 dark:border-blue-900 text-blue-100 text-sm mt-auto">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <a href="/" className="hover:underline">Home</a>
          <a href="#features" className="hover:underline">Features</a>
          <a href="#status" className="hover:underline">Status</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a href="/login" className="hover:underline">Login</a>
          <a href="/signup" className="hover:underline">Signup</a>
        </div>
        <span>&copy; {new Date().getFullYear()} Uptime Monitoring Service</span>
      </footer>
    </div>
  );
}
