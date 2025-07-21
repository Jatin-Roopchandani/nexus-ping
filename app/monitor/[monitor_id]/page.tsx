// Monitor detail page: shows status, uptime, response time, and incidents for a single monitor
// Route: /monitor/[monitor_id]
// Author: AI-generated, 2024
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';

function calcUptime(checks: any[], from: Date): number {
  const filtered = checks.filter(c => new Date(c.checked_at) >= from);
  if (filtered.length === 0) return 0;
  const up = filtered.filter(c => c.status === 'online').length;
  return Math.round((up / filtered.length) * 1000) / 10;
}

function avgResponseTime(checks: any[], from: Date): number {
  const filtered = checks.filter(c => new Date(c.checked_at) >= from && c.response_time != null);
  if (filtered.length === 0) return 0;
  const sum = filtered.reduce((acc, c) => acc + c.response_time, 0);
  return Math.round((sum / filtered.length));
}

export default async function MonitorDetailPage({ params }: { params: { monitor_id: string } }) {
  const supabase = await createClient();

  // Get user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect('/login');
  }

  // Get all monitors for sidebar
  const { data: monitors, error: monitorsError } = await supabase
    .from('monitors')
    .select('id, name, url, is_active, created_at')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
  const monitorIds = (monitors || []).map(m => m.id);

  // Get latest check for each monitor for sidebar
  let latestChecks: Record<string, any> = {};
  if (monitorIds.length > 0) {
    const { data: checks } = await supabase
      .from('monitor_checks')
      .select('monitor_id, status, checked_at')
      .in('monitor_id', monitorIds)
      .order('checked_at', { ascending: false });
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
      lastCheck: check ? new Date(check.checked_at).toLocaleString() : 'Never',
    }
  });

  // Get recent incidents for sidebar
  let sidebarIncidents: any[] = [];
  if (monitorIds.length > 0) {
    const { data: incidentsData, error: incidentsError } = await supabase
      .from('incidents')
      .select('id, monitor_id, name, url, type, status, started_at, resolved_at, duration_minutes, description, created_at')
      .in('monitor_id', monitorIds)
      .order('started_at', { ascending: false })
      .limit(10);
    if (!incidentsError && incidentsData) {
      sidebarIncidents = incidentsData;
    }
  }

  // Get monitor
  const { data: monitor, error: monitorError } = await supabase
    .from('monitors')
    .select('*')
    .eq('id', params.monitor_id)
    .single();
  if (monitorError || !monitor) notFound();

  // Get all checks for this monitor (last 30 days)
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  let { data: checks, error: checksError } = await supabase
    .from('monitor_checks')
    .select('*')
    .eq('monitor_id', params.monitor_id)
    .gte('checked_at', since30d.toISOString())
    .order('checked_at', { ascending: false });
  if (!checks) checks = [];

  // Get recent incidents
  let { data: incidents, error: incidentsError } = await supabase
    .from('incidents')
    .select('*')
    .eq('monitor_id', params.monitor_id)
    .order('started_at', { ascending: false })
    .limit(10);
  if (!incidents) incidents = [];

  // Uptime calculations
  const now = new Date();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const uptime24h = calcUptime(checks, since24h);
  const uptime7d = calcUptime(checks, since7d);
  const uptime30d = calcUptime(checks, since30d);
  const avgResp24h = avgResponseTime(checks, since24h);
  const avgResp7d = avgResponseTime(checks, since7d);
  const avgResp30d = avgResponseTime(checks, since30d);

  const latestCheck = checks[0];

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar (copied from dashboard) */}
      <div className="w-64 shadow-lg fixed h-full overflow-y-auto custom-scrollbar rounded-r-lg overflow-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-indigo-950 z-20">
        <div className="relative h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {userData.user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userData.user.email}
                </p>
                <p className="text-xs text-white/80">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="px-3">
              <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Navigation
              </h3>
              <div className="mt-3 space-y-1">
                <a href="/dashboard" className="bg-white/20 border-white/30 text-white group flex items-center px-3 py-2 text-sm font-medium border-r-2">
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Dashboard
                </a>
                <a href="#" className="text-white/80 hover:bg-white/10 hover:text-white group flex items-center px-3 py-2 text-sm font-medium">
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Analytics
                </a>
                <a href="#" className="text-white/80 hover:bg-white/10 hover:text-white group flex items-center px-3 py-2 text-sm font-medium">
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Settings
                </a>
              </div>
            </div>

            {/* Monitoring Section */}
            <div className="mt-8 px-3">
              <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Monitoring
              </h3>
              <div className="mt-3 space-y-1">
                {monitoredSites.map((site) => (
                  <a
                    key={site.id}
                    href={`/monitor/${site.id}`}
                    className="block px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${site.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm font-medium text-white truncate">{site.name}</span>
                      </div>
                      <span className="text-xs text-white/60">{site.lastCheck}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Incidents Section */}
            <div className="mt-8 px-3">
              <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Recent Incidents
              </h3>
              <div className="mt-3 space-y-1">
                {sidebarIncidents.map((incident) => (
                  <div key={incident.id} className="px-3 py-2 hover:bg-white/10 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{incident.name}</p>
                        <p className="text-xs text-white/60 truncate">{incident.type}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          incident.status === 'Resolved' ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-200'
                        }`}>
                          {incident.status}
                        </span>
                        <span className="text-xs text-white/60 mt-1">{incident.started_at ? new Date(incident.started_at).toLocaleString() : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign Out */}
            <div className="mt-8 px-3 pb-6">
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full text-left text-white hover:bg-white/10 group flex items-center px-3 py-2 text-sm font-medium rounded-md border border-white hover:border-white/40 transition-colors"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Sign Out
                </button>
              </form>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 relative">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 bg-black bg-cover bg-center bg-no-repeat opacity-100 -z-10"
           style={{
            background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)"
           }}
        ></div>
        <div className="relative z-10 p-8">
          {/* Monitor Info */}
          {/* <div className="rounded-2xl shadow-2xl bg-indigo-950 p-8 text-white"> */}
            <h1 className="text-3xl font-bold mb-2">Monitor: {monitor.name}</h1>
            <p className="mb-4 text-lg">URL: <a href={monitor.url} className="underline text-blue-300" target="_blank">{monitor.url}</a></p>
          {/* </div> */}
          {/* Status Section */}
          {/* <div className="rounded-2xl shadow-2xl bg-indigo-950 p-8 text-white flex flex-col md:flex-row gap-8 items-center justify-between"> */}
            <div className="flex-1">
              <div className="flex items-center mb-4 text-xl">
                <span className={`w-4 h-4 rounded-full mr-3 ${latestCheck?.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className="font-semibold">Current Status:</span>
                <span className="ml-3">{latestCheck?.status || 'unknown'}</span>
              </div>
              <div className="mb-2 text-lg">
                <span className="font-semibold">Last Check:</span>
                <span className="ml-2">{latestCheck ? new Date(latestCheck.checked_at).toLocaleString() : 'Never'}</span>
              </div>
              <div className="text-lg">
                <span className="font-semibold">Response Time (last check):</span>
                <span className="ml-2">{latestCheck?.response_time ? `${latestCheck.response_time} ms` : 'N/A'}</span>
              </div>
            {/* </div> */}
          </div>
          {/* Uptime & Response Stats */}
          <div className="rounded-2xl shadow-2xl bg-indigo-950 p-8 text-white grid grid-cols-1 md:grid-cols-3 gap-8 m-10">
            <div>
              <div className="text-lg font-semibold mb-2">Uptime</div>
              <div className="mb-2">24h: <span className="font-bold">{uptime24h}%</span></div>
              <div className="mb-2">7d: <span className="font-bold">{uptime7d}%</span></div>
              <div>30d: <span className="font-bold">{uptime30d}%</span></div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-2">Avg Response Time</div>
              <div className="mb-2">24h: <span className="font-bold">{avgResp24h} ms</span></div>
              <div className="mb-2">7d: <span className="font-bold">{avgResp7d} ms</span></div>
              <div>30d: <span className="font-bold">{avgResp30d} ms</span></div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-semibold mb-2">Last Check</div>
              <div className="font-bold text-xl">{latestCheck ? new Date(latestCheck.checked_at).toLocaleString() : 'Never'}</div>
            </div>
          </div>
          {/* Incidents Section */}
          <div className="rounded-2xl shadow-2xl bg-indigo-950 p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.length === 0 && <div className="text-gray-300">No incidents in the last 30 days.</div>}
              {incidents.map(incident => (
                <div key={incident.id} className="p-6 bg-red-900/40 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-lg">{incident.type}</div>
                    <div className="text-gray-200 text-base">{incident.description}</div>
                  </div>
                  <div className="text-base text-gray-200 mt-2 md:mt-0">
                    <div>Started: {incident.started_at ? new Date(incident.started_at).toLocaleString() : ''}</div>
                    <div>Status: {incident.status}</div>
                    {incident.resolved_at && <div>Resolved: {new Date(incident.resolved_at).toLocaleString()}</div>}
                    {incident.duration_minutes && <div>Duration: {incident.duration_minutes} min</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 