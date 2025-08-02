import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateAccount } from './actions';
import DashboardLayout from '../dashboard/layout';

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
        <h1 className="text-2xl font-bold mb-6">User Account</h1>
        <form action={updateAccount}>
          <div className="mb-4 ml-100">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="fullName" name="fullName" defaultValue={user.user_metadata?.full_name || ''} className="mt-1 block w-100 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4 ml-100">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Primary Email Address</label>
            <input type="email" id="email" name="email" defaultValue={user.email || ''} disabled className="mt-1 block w-100 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          
          <div className="mb-6 ml-100">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Change Password</label>
            <input type="password" id="password" name="password" placeholder="New Password" className="mt-1 block w-100 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <button type="submit" className="mb-6 ml-100 w-100 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Update Account</button>
        </form>
    </DashboardLayout>
  );
}