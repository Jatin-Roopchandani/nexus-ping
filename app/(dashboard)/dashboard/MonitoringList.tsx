"use client";

import React from 'react';

interface Site {
  id: string;
  name: string;
  url: string | undefined;
  status: string;
  lastCheck: string;
}

interface MonitoringListProps {
  sites: Site[];
}

const MonitoringList: React.FC<MonitoringListProps> = ({ sites }) => {
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
    <div className="space-y-4">
      {sites.map((site) => (
        <a key={site.id} href={`/monitor/${site.id}`} className="block">
          <div className="flex items-center justify-between p-4 border hover:bg-indigo-200 border-purple-200 rounded-lg bg-indigo-300 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${site.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{site.name}</h3>
                <p className="text-xs text-gray-600">{site.url}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                site.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {site.status}
              </span>
              <p className="text-xs text-gray-600 mt-1">{formatTime(site.lastCheck)}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default MonitoringList;
