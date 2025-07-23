
"use server"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/auth/callback?next=/private/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
