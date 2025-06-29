"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { data: authData, error } = await supabase.auth.signInWithPassword(data)
  
  if (error) {
    // Check if the error is due to unconfirmed email
    if (error.message.includes('Email not confirmed') || 
        error.message.includes('Invalid login credentials') ||
        error.message.includes('Email not verified')) {
      redirect('/login?error=email_not_confirmed')
    }
    redirect('/error')
  }

  // Check if user profile exists, create if it doesn't
  if (authData.user) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', authData.user.id)
      .single()

    if (!existingUser) {
      // Create user profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || '',
          role: 'user'
        })
      
      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resendConfirmation(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })
  
  if (error) {
    redirect('/login?error=resend_failed')
  }
  
  redirect('/login?success=confirmation_sent')
} 