"use client";

import React from 'react';

interface Incident {
  id: string;
  name: string;
  type: string;
  status: string;
  started_at: string | null;
}

interface RecentIncidentsListProps {
  incidents: Incident[];
}

const RecentIncidentsList: React.FC<RecentIncidentsListProps> = ({ incidents }) => {
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
            <p className="text-xs text-gray-600 mt-1">{formatTime(incident.started_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentIncidentsList;
