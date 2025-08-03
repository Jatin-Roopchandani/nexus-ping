'use client';

import { deleteMonitor, updateMonitorSettings } from './actions';
import { useActionState } from "react";
const initialState = {
  error: null,
  success: '',
};


export default function SettingsForm({ monitor }: { monitor: any }) {
  const [state, formAction] = useActionState(updateMonitorSettings, initialState);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this monitor?')) {
      await deleteMonitor(monitor.id);
    }
  };

  return (
    <div className="rounded-2xl shadow-2xl bg-indigo-950 p-8 text-white m-10">
      <h2 className="text-2xl font-bold mb-6">Update settings</h2>
      <form action={formAction}>
        <input type="hidden" name="monitorId" value={monitor.id} />
        <div className="mb-4">
          <label htmlFor="emailNotifications" className="flex items-center">
            <input type="checkbox" id="emailNotifications" name="emailNotifications" defaultChecked={monitor.email_notifications} className="mr-2" />
            <span>Enable Email Notifications</span>
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="checkFrequency" className="block text-sm font-medium text-gray-400">Check Frequency (in seconds)</label>
          <input type="number" id="checkFrequency" name="checkFrequency" defaultValue={monitor.check_frequency} min="60" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white" />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Update Settings</button>
        {state?.success && <p className="text-green-500 mt-4">{state.success}</p>}
        {state?.error && <p className="text-red-500 mt-4">{state.error.message}</p>}
      </form>
      <button onClick={handleDelete} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4">Delete Monitor</button>
    </div>
  );
}
