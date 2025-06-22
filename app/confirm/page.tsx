"use client"
import Link from "next/link";

export default function ConfirmPage() {
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
      <div className="w-full max-w-md bg-white/90 dark:bg-black/40 rounded-xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">Check Your Email</h1>
          <p className="text-blue-700 dark:text-blue-300 mb-6">
            We've sent you a confirmation email. Please check your inbox and click the confirmation link to verify your account.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> If you don't see the email, check your spam folder.
            </p>
          </div>
          <Link 
            href="/login" 
            className="inline-block w-full py-2 px-4 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 