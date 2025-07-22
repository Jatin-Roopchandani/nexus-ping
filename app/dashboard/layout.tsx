import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 relative">
        <div 
          className="absolute inset-0 bg-black bg-cover bg-center bg-no-repeat opacity-100"
           style={{
            background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)"
           }}
        ></div>
        <div className="relative z-10 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}