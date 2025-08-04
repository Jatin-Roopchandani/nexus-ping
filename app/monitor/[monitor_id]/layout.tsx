import { createClient } from '@/utils/supabase/server';
import Sidebar from '../../(dashboard)/dashboard/Sidebar';
import DashboardLayout from '../../../layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  const { data: monitors } = await supabase
    .from('monitors')
    .select('id, name, url, is_active, created_at')
    .eq('user_id', user?.id || '')
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
      lastCheck: check ? check.checked_at : 'Never',
    };
  });

  let incidents: any[] = [];
  if (monitorIds.length > 0) {
    const { data: incidentsData } = await supabase
      .from('incidents')
      .select('id, monitor_id, name, url, type, status, started_at, resolved_at, duration_minutes, description, created_at')
      .in('monitor_id', monitorIds)
      .order('started_at', { ascending: false });
    incidents = incidentsData || [];
  }

  const userData = user ? { user: { email: user.email || '' } } : null;

  return (
    <DashboardLayout sidebar={<Sidebar monitoredSites={monitoredSites} sidebarIncidents={incidents} userData={userData} />}>
      {children}
    </DashboardLayout>
  );
}
