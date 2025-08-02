import React from 'react';
import { usePathname } from 'next/navigation';

interface MonitoredSite {
  id: string;
  name: string;
  url?: string;
  status: string;
  lastCheck: string;
}

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

interface UserData {
  user: {
    email: string;
  };
}

interface SidebarProps {
  monitoredSites: MonitoredSite[];
  sidebarIncidents: Incident[];
  userData?: UserData | null;
}

const Sidebar: React.FC<SidebarProps> = ({ monitoredSites = [], sidebarIncidents = [], userData }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  // For SSR/SSG fallback, usePathname from next/navigation if available
  // const pathname = usePathname ? usePathname() : '';
  // Extract monitor id from path if on monitor page
  const monitorMatch = pathname.match(/\/monitor\/([^/]+)/);
  const activeMonitorId = monitorMatch ? monitorMatch[1] : null;

  const userEmail = userData && userData.user && userData.user.email ? userData.user.email : '';
  return (
    <div className="w-64 shadow-lg fixed h-full overflow-y-auto custom-scrollbar rounded-r-lg overflow-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-indigo-950 z-20">
      <div className="relative h-full">
        {/* User Profile Section */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {userEmail ? userEmail.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userEmail || 'Unknown User'}
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
              <a href="/dashboard" className={`${pathname === '/dashboard' ? 'bg-white/20 border-white/30 text-white border-r-2' : 'text-white/80 hover:bg-white/10 hover:text-white'} group flex items-center px-3 py-2 text-sm font-medium`}>
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Dashboard
              </a>
              <a href="/incidents" className={`${pathname === '/incidents' ? 'bg-white/20 border-white/30 text-white border-r-2' : 'text-white/80 hover:bg-white/10 hover:text-white'} group flex items-center px-3 py-2 text-sm font-medium`}>
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Incidents
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
                  className={`block px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer ${activeMonitorId === site.id ? 'bg-white/20 border-white/30 text-white border-r-2' : ''}`}
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
  );
};

export default Sidebar;