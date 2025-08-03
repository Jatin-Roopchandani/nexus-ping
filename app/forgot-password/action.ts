
"use server"

import { createClient } from "@/utils/supabase/server";

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `/auth/callback?next=/private/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
