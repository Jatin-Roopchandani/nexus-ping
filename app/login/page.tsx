'use client'

import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}