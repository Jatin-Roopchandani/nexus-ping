'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateAccount(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Optional: log or redirect
    console.error('User not found or auth error:', authError);
    redirect('/error?reason=user-not-found'); // or redirect to login
    return;
  }

  const fullName = formData.get('fullName') as string;
  const notificationEmail = formData.get('notificationEmail') as string;
  const password = formData.get('password') as string;

  // Update user metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      notification_email: notificationEmail,
    },
  });

  if (metadataError) {
    console.error('Metadata update error:', metadataError);
    redirect('/error?reason=metadata'); // or handle otherwise
    return;
  }

  // Update user table
  const { error: userError } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (userError) {
    console.error('User table update error:', userError);
    redirect('/error?reason=db');
    return;
  }

  // Update password if provided
  if (password) {
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      console.error('Password update error:', passwordError);
      redirect('/error?reason=password');
      return;
    }
  }

  revalidatePath('/account');
  redirect('/account'); // redirect after success
}
