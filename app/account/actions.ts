'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: 'User not found' } };
  }

  const fullName = formData.get('fullName') as string;
  const notificationEmail = formData.get('notificationEmail') as string;
  const password = formData.get('password') as string;

  // Update user metadata and users table
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      notification_email: notificationEmail,
    },
  });

  if (metadataError) {
    return { error: metadataError };
  }

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (userError) {
    return { error: userError };
  }

  // Update password if provided
  if (password) {
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      return { error: passwordError };
    }
  }

  revalidatePath('/account');
  return { error: null };
}