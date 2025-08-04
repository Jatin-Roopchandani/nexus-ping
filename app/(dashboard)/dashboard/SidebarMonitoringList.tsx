"use client";

import React from 'react';

interface Site {
  id: string;
  name: string;
  status: string;
  lastCheck: string;
}

interface SidebarMonitoringListProps {
  sites: Site[];
  activeMonitorId: string | null;
}

const SidebarMonitoringList: React.FC<SidebarMonitoringListProps> = ({ sites, activeMonitorId }) => {
  const formatTime = (dateString: string) => {
    if (dateString === 'Never') {
      return 'Never';
    }
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="mt-3 space-y-1">
      {sites.map((site) => (
        <a
          key={site.id}
          href={`/monitor/${site.id}`}
          className={`block px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer ${activeMonitorId === site.id ? 'bg-white/20 border-white/30 text-white border-r-2' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${site.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium text-white truncate">{site.name}</span>
            </div>
            <span className="text-xs text-white/60">{formatTime(site.lastCheck)}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SidebarMonitoringList;
