import Image from "next/image";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 sm:p-12 font-[family-name:var(--font-geist-sans)] relative overflow-hidden"
      style={{
        backgroundImage:
          "url('/bg2.jpg'), linear-gradient(to bottom right, #eff6ff, #fff, #dbeafe)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
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
        {/* Mobile menu icon (optional, static for now) */}
        <button className="sm:hidden p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900" aria-label="Open menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900 dark:text-blue-100"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
      </nav>
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl text-center gap-8 mt-12 mb-8">
        <div className="flex flex-col items-center gap-4">
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-red-600 drop-shadow-sm">
            Uptime Monitoring Service
          </h1>
          <p className="text-lg sm:text-xl text-blue-800 font-bold max-w-xl mt-2">
            Effortlessly track the uptime and health of your websites and APIs. Get instant alerts, beautiful reports, and peace of mind.
          </p>
        </div>
        <a
          href="/signup"
          className="inline-block mt-4 px-8 py-3 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors"
        >
          Get Started
        </a>
        {/* Example Status Summary */}
       
      </main>
      {/* Footer */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-200 text-sm">
        <span>&copy; {new Date().getFullYear()} Uptime Monitoring Service</span>
        
      </footer>
    </div>
  );
}
