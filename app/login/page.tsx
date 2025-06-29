"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { login, resendConfirmation } from "./action";

export default function Login() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');
    
    if (errorParam === 'email_not_confirmed') {
      setError("Account not confirmed. Please check your email and click the confirmation link to verify your account.");
      setShowResendForm(true);
    } else if (errorParam === 'account_exists') {
      setError("An account with this email already exists. Please log in instead.");
    } else if (errorParam === 'resend_failed') {
      setError("Failed to resend confirmation email. Please try again.");
    } else if (successParam === 'confirmation_sent') {
      setSuccess("Confirmation email sent! Please check your inbox.");
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
        <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-red-400 mb-6">Log In</h1>
        <form className="flex flex-col gap-4" action={login} method="post">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full px-4 py-2 rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-black/30 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button type="submit" className="w-full mt-2 py-2 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60">
            Log In
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-center text-red-600 text-sm">{error}</p>
            <p className="text-center text-red-500 text-xs mt-1">
              {error.includes('not confirmed') && "Check your spam folder if you don't see the confirmation email."}
            </p>
          </div>
        )}
        
        {showResendForm && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-center text-blue-600 text-sm mb-2">
              Didn't receive the confirmation email?
            </p>
            <form action={resendConfirmation} className="flex gap-2">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-1 text-sm rounded border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Resend
              </button>
            </form>
          </div>
        )}
        
        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
        <p className="mt-6 text-center text-blue-900 dark:text-blue-100 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-700 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
