"use server"
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
export async function addMonitor(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Extract form data
  const url = formData.get('url') as string
  const name = formData.get('name') as string
  const emailNotifications = formData.get('emailNotifications') === 'true'
  const interval = parseInt(formData.get('interval') as string)
  const sslCheck = formData.get('sslCheck') === 'true'

  // Validate input
  if (!url || !name || !interval) {
    throw new Error('Missing required fields')
  }

  // Validate URL format
  try {
    new URL(url)
  } catch {
    throw new Error('Invalid URL format')
  }

  // Validate interval
  if (interval < 1 || interval > 60) {
    throw new Error('Interval must be between 1 and 60 minutes')
  }

  // Insert the monitor
  const { error: insertError } = await supabase
    .from('monitors')
    .insert({
      user_id: user.id,
      name: name,
      url: url,
      check_frequency: interval * 60, // Convert minutes to seconds
      timeout: 30, // Default timeout
      expected_status_code: 200, // Default expected status
      is_active: true,
      ssl_check_enabled: sslCheck,
      email_notifications: emailNotifications
    })

  if (insertError) {
    console.error('Error adding monitor:', insertError)
    throw new Error('Failed to add monitor')
  }
} 