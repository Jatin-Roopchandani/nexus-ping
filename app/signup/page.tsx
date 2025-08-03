'use client'

import { Suspense } from 'react'
import SignUpForm from './SignUpForm'

export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}