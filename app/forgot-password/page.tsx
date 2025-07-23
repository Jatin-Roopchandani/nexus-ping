
"use client"
import { useState } from "react";
import { forgotPassword } from "./action";

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await forgotPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess("Password reset link sent! Please check your email.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 font-[family-name:var(--font-geist-sans)] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)",
      }}
    >
      <div className="w-full max-w-md bg-white/90 dark:bg-black/40 rounded-xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
        <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-red-400 mb-6">Forgot Password</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          <button type="submit" className="w-full mt-2 py-2 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60">
            Send Reset Link
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-center text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
      </div>
    </div>
  );
}
