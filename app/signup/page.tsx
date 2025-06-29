"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signup } from "./action";

export default function SignUp() {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    switch (errorParam) {
      case 'weak_password':
        setError("Password is too weak. Please use at least 6 characters.");
        break;
      case 'invalid_email':
        setError("Please enter a valid email address.");
        break;
      case 'signup_failed':
        setError("Signup failed. Please try again.");
        break;
      default:
        setError("");
    }
  }, [searchParams]);

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
        <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-red-400 mb-6">Sign Up</h1>
        <form className="flex flex-col gap-4" action={signup}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-black/30 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-black/30 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2 rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-black/30 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60"
          >
            Create Account
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-center text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <p className="mt-6 text-center text-blue-900 dark:text-blue-100 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-700 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
} 