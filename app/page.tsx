"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from './Navbar';
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
      <Navbar/>
      {/* Hero Section with Image */}
      <main className="flex flex-1 w-full max-w-6xl mx-auto items-center justify-center gap-12 mt-8 mb-8 flex-col lg:flex-row min-h-[70vh]">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-red-400 drop-shadow-sm">
            Nexus Ping
          </h1>
          <p className="max-w-md">Free and open source monitor to track the uptime and response time of your websites and APIs 24/7.</p>
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
            src="/image.png"
            alt="Example dashboard screenshot"
            className="rounded-xl shadow-lg border border-white/20 max-w-full w-full h-auto object-contain bg-white/5"
            style={{ maxWidth: '700px' }}
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
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/login" className="hover:underline">Login</a>
          <a href="/signup" className="hover:underline">Signup</a>
          <a href="https://github.com/Jatin-Roopchandani/uptime-monitoring-service" className="hover:underline">Github</a>
        </div>
        <span>&copy; {new Date().getFullYear()} Nexus Ping</span>
      </footer>
    </div>
  );
}
