
"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function UpdatePassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const resetParam = searchParams.get('reset')
    if (resetParam !== 'true') {
      router.replace('/login')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Password updated successfully!')
      router.push('/login');
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 font-[family-name:var(--font-geist-sans)] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)",
      }}
    >
      <div className="w-full max-w-md bg-white/90 dark:bg-black/40 rounded-xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
        <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-red-400 mb-6">Update Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-black/30 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-black/30 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60"
          >
            Update Password
          </button>
                    {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-center text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-center text-green-600 text-sm">{success}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
