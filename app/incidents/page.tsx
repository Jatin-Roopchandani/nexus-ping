import Sidebar from '../(dashboard)/dashboard/Sidebar';
import { createClient } from '@/utils/supabase/server';

interface Incident {
  id: string;
  monitor_id: string;
  name: string;
  url?: string;
  type: string;
  status: string;
  started_at: string;
  resolved_at?: string;
  duration_minutes?: number;
  description?: string;
  created_at?: string;
}

export default async function IncidentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return <div className="text-white p-8">You must be logged in to view incidents.</div>;
  }

  // Fetch all monitors for sidebar and incidents
  const { data: monitors } = await supabase
    .from('monitors')
    .select('id, name, url, is_active, created_at')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: false });
  const monitorIds = (monitors || []).map(m => m.id);

  // Sidebar monitoredSites
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
    };
  });

  // Sidebar recent incidents (limit 10)
  let sidebarIncidents: Incident[] = [];
  if (monitorIds.length > 0) {
    const { data: sidebarData } = await supabase
      .from('incidents')
      .select('id, monitor_id, name, url, type, status, started_at, resolved_at, duration_minutes, description, created_at')
      .in('monitor_id', monitorIds)
      .order('started_at', { ascending: false })
      .limit(10);
    sidebarIncidents = sidebarData || [];
  }

  // All incidents for main content
  let incidents: Incident[] = [];
  if (monitorIds.length > 0) {
    const { data: incidentsData } = await supabase
      .from('incidents')
      .select('id, monitor_id, name, url, type, status, started_at, resolved_at, duration_minutes, description, created_at')
      .in('monitor_id', monitorIds)
      .order('started_at', { ascending: false });
    incidents = incidentsData || [];
  }

  const userData = { user: { email: data.user.email || '' } };

  return (
    <div className="min-h-screen flex">
      <Sidebar monitoredSites={monitoredSites} sidebarIncidents={sidebarIncidents} userData={userData} />
      <div className="flex-1 ml-64 relative">
        <div className="absolute inset-0 bg-black bg-cover bg-center bg-no-repeat opacity-100 -z-10"
          style={{ background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)" }}
        ></div>
        <div className="relative z-10 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">All Incidents</h1>
          <div className="space-y-4">
            {incidents.length === 0 && (
              <div className="text-gray-300">No incidents found.</div>
            )}
            {incidents.map(incident => (
              <div key={incident.id} className="p-6 bg-indigo-950 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between border border-white/10">
                <div>
                  <div className="font-semibold text-lg text-white">{incident.name}</div>
                  <div className="text-gray-200 text-base">{incident.description}</div>
                  <div className="text-xs text-white/60 mt-1">Type: {incident.type}</div>
                  <div className="text-xs text-white/60 mt-1">Monitor: {incident.url}</div>
                </div>
                <div className="text-base text-gray-200 mt-4 md:mt-0 md:text-right">
                  <div>Started: {incident.started_at ? new Date(incident.started_at).toLocaleString() : ''}</div>
                  <div>Status: <span className={`px-2 py-1 rounded-full text-xs ${
                    incident.status === 'Resolved' ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-200'
                  }`}>{incident.status}</span></div>
                  {incident.resolved_at && <div>Resolved: {new Date(incident.resolved_at).toLocaleString()}</div>}
                  {incident.duration_minutes && <div>Duration: {incident.duration_minutes} min</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
