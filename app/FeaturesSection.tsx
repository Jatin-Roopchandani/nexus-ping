"use client";
import { useEffect, useRef, useState } from "react";

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={ref}
      className="w-full max-w-6xl mx-auto mt-12 mb-16 flex flex-col items-center"
    >
      <h2 className={`text-3xl font-bold text-white mb-8 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {[{
          icon: (
            <svg className="w-10 h-10 mb-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          ),
          title: "Get Notifications",
          desc: "Receive instant alerts via email when your site goes down or recovers."
        }, {
          icon: (
            <svg className="w-10 h-10 mb-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h1v-4h1m-4 0h1v4h1" /></svg>
          ),
          title: "Monitor Uptime",
          desc: "Track the uptime and response time of your websites and APIs 24/7."
        }, {
          icon: (
            <svg className="w-10 h-10 mb-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H7a1 1 0 00-1 1v9m0 0l4 4 4-4" /></svg>
          ),
          title: "Incident History",
          desc: "View a full history of incidents, downtime, and recoveries for all your monitors."
        }, {
          icon: (
            <svg className="w-10 h-10 mb-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          ),
          title: "Easy Setup",
          desc: "Add new monitors in seconds with a simple, intuitive interface."
        }].map((f, i) => (
          <div
            key={f.title}
            className={`bg-indigo-950 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center text-white border border-white/10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: visible ? `${i * 120}ms` : '0ms' }}
          >
            {f.icon}
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-white/80">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 