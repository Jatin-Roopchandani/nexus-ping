"use client";
import React, { useState } from "react";
import { addMonitor } from "./actions";

export default function AddMonitorButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [interval, setInterval] = useState(5);
  const [sslCheck, setSslCheck] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name || !interval) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('url', url);
      formData.append('name', name);
      formData.append('emailNotifications', emailNotifications.toString());
      formData.append('interval', interval.toString());
      formData.append('sslCheck', sslCheck.toString());

      await addMonitor(formData);
      
      // Reset form and close modal
      setUrl("");
      setName("");
      setEmailNotifications(false);
      setInterval(5);
      setSslCheck(false);
      setModalOpen(false);
      
      // Refresh the page to show the new monitor
      window.location.reload();
    } catch (err) {
      setError("Failed to add monitor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
        onClick={() => setModalOpen(true)}
        type="button"
      >
        + Add Monitor
      </button>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="rounded-lg shadow-lg w-full max-w-md p-6 relative border border-white/20 overflow-hidden"
            style={{
              backgroundImage: "url('/gradient.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <button
              className="absolute top-2 right-2 text-white/80 hover:text-white"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">Add Monitor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Monitor Name<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-white/30 rounded px-3 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="My Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Website URL<span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  className="w-full border border-white/30 rounded px-3 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={e => setEmailNotifications(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="emailNotifications" className="text-sm text-white">
                  Get email notifications
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">
                  Monitor Interval (minutes)<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  className="w-full border border-white/30 rounded px-3 py-2 bg-white/10 backdrop-blur-sm text-white"
                  value={interval}
                  onChange={e => setInterval(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sslCheck"
                  checked={sslCheck}
                  onChange={e => setSslCheck(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="sslCheck" className="text-sm text-white">
                  Check for SSL errors
                </label>
              </div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-purple-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 