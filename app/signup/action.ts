"use server"
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string
      }
    }
  }
  
  // First check if user already exists in our users table
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', data.email)
    .single()

  if (existingUser) {
    // User already exists, redirect to login
    redirect('/login?error=account_exists')
  }

  // Try to sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp(data)
  
  if (signUpError) {
    // Handle specific error cases
    if (signUpError.message.includes('User already registered') || 
        signUpError.message.includes('already been registered') ||
        signUpError.message.includes('already exists') ||
        signUpError.message.includes('A user with this email address has already been registered')) {
      redirect('/login?error=account_exists')
    } else if (signUpError.message.includes('Password should be at least')) {
      redirect('/signup?error=weak_password')
    } else if (signUpError.message.includes('Invalid email')) {
      redirect('/signup?error=invalid_email')
    } else {
      redirect('/signup?error=signup_failed')
    }
  }

  // Check if signup was successful but user needs confirmation
  if (signUpData.user && !signUpData.user.email_confirmed_at) {
    // Redirect to confirmation page
    redirect('/confirm')
  }

  // If we get here, something unexpected happened
  redirect('/signup?error=signup_failed')
}

/*
RLS Policy for users table that allows email existence check during signup:

-- Allow checking if email exists (for signup validation)
CREATE POLICY "Allow email existence check" ON users
  FOR SELECT
  USING (
    -- Allow if user is checking their own profile
    auth.uid() = id
    OR
    -- Allow if checking email existence (no auth.uid() during signup)
    auth.uid() IS NULL
  );
*/ 