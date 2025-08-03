'use client'

import { Suspense } from 'react'
import UpdatePasswordForm from './UpdatePasswordForm'

export default function UpdatePassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePasswordForm />
    </Suspense>
  )
}