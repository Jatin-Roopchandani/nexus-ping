'use client';
import { createClient } from '@/utils/supabase/client';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { updateMonitorSettings } from './actions';
import { useFormState } from 'react-dom';
import { useEffect, useState, use } from 'react';
import SettingsForm from './SettingsForm';
import Sidebar from '../../dashboard/Sidebar';

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

export default function MonitorDetailPage({ params }: { params: Promise<{ monitor_id: string }> }) {
  const { monitor_id } = use(params);
  const [monitor, setMonitor] = useState<any>(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [monitoredSites, setMonitoredSites] = useState<any[]>([]);
  const [sidebarIncidents, setSidebarIncidents] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      setUserData({ user });

      const { data: monitorData, error: monitorError } = await supabase
        .from('monitors')
        .select('*')
        .eq('id', monitor_id)
        .single();

      if (monitorError || !monitorData) {
        notFound();
      }
      setMonitor(monitorData);

      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const { data: checksData, error: checksError } = await supabase
        .from('monitor_checks')
        .select('*')
        .eq('monitor_id', monitor_id)
        .gte('checked_at', since30d.toISOString())
        .order('checked_at', { ascending: false });
      if (checksData) {
        setChecks(checksData);
      }

      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .eq('monitor_id', monitor_id)
        .order('started_at', { ascending: false })
        .limit(10);
      if (incidentsData) {
        setIncidents(incidentsData);
      }

      const { data: monitors, error: monitorsError } = await supabase
        .from('monitors')
        .select('id, name, url, is_active, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      const monitorIds = (monitors || []).map(m => m.id);

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
      setMonitoredSites(monitoredSites);

      let sidebarIncidents: any[] = [];
      if (monitorIds.length > 0) {
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('incidents')
          .select('id, monitor_id, name, url, type, status, started_at, resolved_at, duration_minutes, description, created_at')
          .in('monitor_id', monitorIds)
          .order('started_at', { ascending: false })
          .limit(10);
        if (!incidentsError && incidentsData) {
          setSidebarIncidents(incidentsData);
        }
      }
    };

    fetchData();
  }, [monitor_id]);

  if (!monitor || !userData) {
    return <div>Loading...</div>;
  }

  const now = new Date();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const uptime24h = calcUptime(checks, since24h);
  const uptime7d = calcUptime(checks, since7d);
  const uptime30d = calcUptime(checks, since30d);
  const avgResp24h = avgResponseTime(checks, since24h);
  const avgResp7d = avgResponseTime(checks, since7d);
  const avgResp30d = avgResponseTime(checks, since30d);

  const latestCheck = checks[0];

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <Sidebar monitoredSites={monitoredSites} sidebarIncidents={sidebarIncidents} userData={userData} />

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
          <div className="rounded-2xl shadow-2xl bg-indigo-950 p-8 text-white m-10">
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
          <SettingsForm monitor={monitor} />
        </div>
        
      </div>
    </div>
  );
}