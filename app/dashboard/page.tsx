import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AddMonitorButton from './AddMonitorButton'
import Sidebar from './Sidebar'
import MonitoringList from './MonitoringList'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // Fetch real monitors for the current user
  const { data: monitors, error: monitorsError } = await supabase
    .from('monitors')
    .select('id, name, url, is_active, created_at')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: false })

  const monitorIds = (monitors || []).map(m => m.id);

  // Fetch the latest check for each monitor
  let latestChecks: Record<string, any> = {};
  if (monitorIds.length > 0) {
    const { data: checks } = await supabase
      .from('monitor_checks')
      .select('monitor_id, status, checked_at')
      .in('monitor_id', monitorIds)
      .order('checked_at', { ascending: false });

    // Map: monitor_id -> latest check
    for (const check of checks || []) {
      if (!latestChecks[check.monitor_id]) {
        latestChecks[check.monitor_id] = check;
      }
    }
  }

  const monitoredSites = (monitors || []).map((monitor) => {
    const check = latestChecks[monitor.id];
    return {
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
      status: check ? check.status : (monitor.is_active ? 'unknown' : 'offline'),
      lastCheck: check ? check.checked_at : 'Never',
    }
  });

  // Stats
  const onlineCount = monitoredSites.filter(site => site.status === 'online').length;
  const offlineCount = monitoredSites.filter(site => site.status === 'offline').length;


 
  let incidents: any[] = [];
  if (monitorIds.length > 0) {
    const { data: incidentsData, error: incidentsError } = await supabase
      .from('incidents')
      .select('id, monitor_id, name, url, type, status, started_at, resolved_at, duration_minutes, description, created_at')
      .in('monitor_id', monitorIds)
      .order('started_at', { ascending: false });
    if (incidentsError) {
      console.error('Error fetching incidents:', incidentsError);
      incidents = [];
    } else {
      incidents = incidentsData || [];
    }
  }

  const activeIncidentsCount = incidents.filter(incident => incident.status !== 'Resolved').length;
  const totalDowntimeMinutes = incidents.reduce((acc, incident) => acc + (incident.duration_minutes || 0), 0);
  const totalUptimePercentage = monitoredSites.length > 0
    ? Math.max(0, (1 - totalDowntimeMinutes / (monitoredSites.length * 30 * 24 * 60)) * 100)
    : 100;

  const userData = { user: { email: data.user.email || '' } };

  return (
    <div className="min-h-screen flex">
      <Sidebar monitoredSites={monitoredSites} sidebarIncidents={incidents} userData={userData} />
      <div className="flex-1 ml-64 relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-black bg-cover bg-center bg-no-repeat opacity-100 -z-10"
          style={{ background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)" }}
        ></div>
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="mt-2 text-white">Monitor your websites and track incidents in real-time</p>
            </div>
            <AddMonitorButton />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-lg shadow-2xl hover:shadow-3xl transition-shadow border bg-indigo-950 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Online Sites</p>
                    <p className="text-2xl font-semibold text-white">{onlineCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-2xl hover:shadow-3xl transition-shadow border bg-indigo-950  overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Offline Sites</p>
                    <p className="text-2xl font-semibold text-white">{offlineCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-2xl hover:shadow-3xl transition-shadow border bg-indigo-950 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Active Incidents</p>
                    <p className="text-2xl font-semibold text-white">{activeIncidentsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-2xl hover:shadow-3xl transition-shadow border border-purple-200 overflow-hidden bg-indigo-950">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">Uptime</p>
                    <p className="text-2xl font-semibold text-green-400">{totalUptimePercentage.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monitoring Overview */}
            <div className="rounded-lg shadow-2xl hover:shadow-3xl transition-shadow border border-purple-200 overflow-hidden bg-indigo-950">
              <div className="px-6 py-4 border-b border-purple-200">
                <h2 className="text-lg font-bold text-white">Website Monitoring</h2>
              </div>
              <div className="p-6">
                <MonitoringList sites={monitoredSites} />
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="rounded-lg shadow-2xl hover:shadow-3xl transition-shadow border border-purple-200 overflow-hidden bg-indigo-950">
              <div className="px-6 py-4 border-b border-purple-200">
                <h2 className="text-lg font-bold text-s">Recent Incidents</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-4 border hover:bg-indigo-200 border-purple-200 rounded-lg bg-indigo-300">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{incident.name}</h3>
                        <p className="text-xs text-gray-600">{incident.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          incident.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {incident.status}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">{incident.started_at ? new Date(incident.started_at).toLocaleString() : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}