"use client";

import React from 'react';

interface Incident {
  id: string;
  name: string;
  type: string;
  status: string;
  started_at: string | null;
}

interface SidebarRecentIncidentsListProps {
  incidents: Incident[];
}

const SidebarRecentIncidentsList: React.FC<SidebarRecentIncidentsListProps> = ({ incidents }) => {
  const formatTime = (dateString: string | null) => {
    if (!dateString) {
      return '';
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
      {incidents.map((incident) => (
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
              <span className="text-xs text-white/60 mt-1">{formatTime(incident.started_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarRecentIncidentsList;
