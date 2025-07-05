import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AddMonitorButton from './AddMonitorButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // Mock data for demonstration
  const monitoredSites = [
    { id: 1, name: 'Example.com', status: 'online', url: 'https://example.com', lastCheck: '2 min ago' },
    { id: 2, name: 'MyApp.com', status: 'offline', url: 'https://myapp.com', lastCheck: '1 min ago' },
    { id: 3, name: 'Blog.com', status: 'online', url: 'https://blog.com', lastCheck: '3 min ago' },
    { id: 4, name: 'API.com', status: 'online', url: 'https://api.com', lastCheck: '1 min ago' },
  ]

  const incidents = [
    { id: 1, site: 'MyApp.com', type: 'Downtime', status: 'Resolved', time: '2 hours ago' },
    { id: 2, site: 'API.com', type: 'High Response Time', status: 'Investigating', time: '30 min ago' },
    { id: 3, site: 'Example.com', type: 'SSL Certificate Expired', status: 'Resolved', time: '1 day ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 shadow-lg fixed h-full overflow-y-auto custom-scrollbar rounded-r-lg overflow-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent" style={{
        backgroundImage: "url('/gradient.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        <div className="relative h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {data.user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {data.user.email}
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
                <a href="#" className="bg-white/20 border-white/30 text-white group flex items-center px-3 py-2 text-sm font-medium border-r-2">
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
                  <div key={site.id} className="px-3 py-2 hover:bg-white/10 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${site.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm font-medium text-white truncate">{site.name}</span>
                      </div>
                      <span className="text-xs text-white/60">{site.lastCheck}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incidents Section */}
            <div className="mt-8 px-3">
              <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Recent Incidents
              </h3>
              <div className="mt-3 space-y-1">
                {incidents.map((incident) => (
                  <div key={incident.id} className="px-3 py-2 hover:bg-white/10 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{incident.site}</p>
                        <p className="text-xs text-white/60 truncate">{incident.type}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          incident.status === 'Resolved' ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-200'
                        }`}>
                          {incident.status}
                        </span>
                        <span className="text-xs text-white/60 mt-1">{incident.time}</span>
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
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-black bg-cover bg-center bg-no-repeat opacity-100"
           style={{
            background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)"
           }}
        ></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-sky-50">Dashboard</h1>
              <p className="mt-2 text-sky-50">Monitor your websites and track incidents in real-time</p>
            </div>
            <AddMonitorButton />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-lg shadow-lg border border-white/20 overflow-hidden">
              <div 
                className="relative p-6"
                style={{
                  backgroundImage: "url('/gradient.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/80">Online Sites</p>
                    <p className="text-2xl font-semibold text-white">3</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-lg border border-white/20 overflow-hidden">
              <div 
                className="relative p-6"
                style={{
                  backgroundImage: "url('/gradient.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/80">Offline Sites</p>
                    <p className="text-2xl font-semibold text-white">1</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-lg border border-white/20 overflow-hidden">
              <div 
                className="relative p-6"
                style={{
                  backgroundImage: "url('/gradient.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/80">Active Incidents</p>
                    <p className="text-2xl font-semibold text-white">1</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-lg border border-white/20 overflow-hidden">
              <div 
                className="relative p-6"
                style={{
                  backgroundImage: "url('/gradient.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/80">Uptime</p>
                    <p className="text-2xl font-semibold text-green-500">99.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monitoring Overview */}
            <div className="rounded-lg shadow-lg border border-white/20 overflow-hidden">
              <div 
                className="relative"
                style={{
                  backgroundImage: "url('/gradient.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="px-6 py-4 border-b border-white/20">
                  <h2 className="text-lg font-medium text-white">Website Monitoring</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {monitoredSites.map((site) => (
                      <div key={site.id} className="flex items-center justify-between p-4 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${site.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div>
                            <h3 className="text-sm font-medium text-white">{site.name}</h3>
                            <p className="text-xs text-white/80">{site.url}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            site.status === 'online' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                          }`}>
                            {site.status}
                          </span>
                          <p className="text-xs text-white/80 mt-1">{site.lastCheck}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="rounded-lg shadow-lg border border-white/20 overflow-hidden">
              <div 
                className="relative"
                style={{
                  backgroundImage: "url('/gradient.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="px-6 py-4 border-b border-white/20">
                  <h2 className="text-lg font-medium text-white">Recent Incidents</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-4 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div>
                          <h3 className="text-sm font-medium text-white">{incident.site}</h3>
                          <p className="text-xs text-white/80">{incident.type}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            incident.status === 'Resolved' ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-200'
                          }`}>
                            {incident.status}
                          </span>
                          <p className="text-xs text-white/80 mt-1">{incident.time}</p>
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
    </div>
  )
} 