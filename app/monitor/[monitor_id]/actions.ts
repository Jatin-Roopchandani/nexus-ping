'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";
export async function updateMonitorSettings(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: 'User not found' } };
  }

  const monitorId = formData.get('monitorId') as string;
  const emailNotifications = formData.get('emailNotifications') === 'on';
  const checkFrequency = parseInt(formData.get('checkFrequency') as string, 10);

  const { error } = await supabase
    .from('monitors')
    .update({
      email_notifications: emailNotifications,
      check_frequency: checkFrequency,
    })
    .eq('id', monitorId)
    .eq('user_id', user.id);

  if (error) {
    return { error };
  }

  revalidatePath(`/monitor/${monitorId}`);
  return { error: null, success: 'Settings updated!' };
}

export async function deleteMonitor(monitorId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: 'User not found' } };
  }

  const { error } = await supabase
    .from('monitors')
    .delete()
    .eq('id', monitorId)
    .eq('user_id', user.id);

  if (error) {
    return { error };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}