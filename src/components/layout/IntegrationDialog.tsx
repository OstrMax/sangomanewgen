"use client";

import { useState, type ReactNode } from "react";

type SidebarItem = "extensions" | "calendar" | "contacts";

interface ExtensionRow {
  ext: string;
  destination: string;
  delay: string;
  enabled: boolean;
}

export default function IntegrationDialog({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<SidebarItem>("extensions");
  const [findMeFollowMe, setFindMeFollowMe] = useState(true);
  const [extensions, setExtensions] = useState<ExtensionRow[]>([
    { ext: "1001", destination: "+1 (416) 555-0100", delay: "20", enabled: true },
    { ext: "1002", destination: "+1 (416) 555-0200", delay: "25", enabled: true },
    { ext: "1003", destination: "+1 (416) 555-0300", delay: "30", enabled: false },
  ]);
  const [selectedExt, setSelectedExt] = useState(0);

  const sidebarItems: { key: SidebarItem; label: string; icon: ReactNode }[] = [
    {
      key: "extensions",
      label: "Extensions",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      key: "calendar",
      label: "Calendar",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      key: "contacts",
      label: "Contacts",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];

  const updateExtension = (index: number, field: keyof ExtensionRow, value: string | boolean) => {
    setExtensions((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-[780px] max-h-[85vh] rounded-xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: "var(--th-bg-elevated)",
          border: "1px solid var(--th-border)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--th-border)" }}
        >
          <h2 className="text-[16px] font-semibold" style={{ color: "var(--th-text-primary)" }}>
            Integrations
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Close integrations dialog"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div
            className="w-[180px] shrink-0 py-3 px-3 flex flex-col gap-0.5"
            style={{ borderRight: "1px solid var(--th-border)" }}
          >
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left w-full"
                style={{
                  backgroundColor: activeTab === item.key ? "var(--th-bg-hover)" : "transparent",
                  color: activeTab === item.key ? "var(--th-tab-active)" : "var(--th-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.key) e.currentTarget.style.backgroundColor = "var(--th-bg-hover)";
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.key) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "extensions" && (
              <ExtensionsContent
                findMeFollowMe={findMeFollowMe}
                setFindMeFollowMe={setFindMeFollowMe}
                extensions={extensions}
                selectedExt={selectedExt}
                setSelectedExt={setSelectedExt}
                updateExtension={updateExtension}
              />
            )}
            {activeTab === "calendar" && (
              <div>
                <h3 className="text-[15px] font-semibold mb-3" style={{ color: "var(--th-text-primary)" }}>
                  Calendar Integration
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--th-text-secondary)" }}>
                  Connect your calendar to sync meetings and availability status automatically. Supported providers include Google Calendar, Microsoft Outlook, and Apple Calendar.
                </p>
                <div
                  className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-[12px]" style={{ color: "var(--th-text-secondary)" }}>
                    No calendar connected. Click Connect to get started.
                  </span>
                </div>
                <button
                  className="mt-4 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-colors"
                  style={{ backgroundColor: "var(--th-tab-active)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Connect Calendar
                </button>
              </div>
            )}
            {activeTab === "contacts" && (
              <div>
                <h3 className="text-[15px] font-semibold mb-3" style={{ color: "var(--th-text-primary)" }}>
                  Contacts Integration
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--th-text-secondary)" }}>
                  Import and sync contacts from external sources. Supported providers include Google Contacts, Microsoft 365, and LDAP directories.
                </p>
                <div
                  className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-[12px]" style={{ color: "var(--th-text-secondary)" }}>
                    No contacts source connected. Click Connect to get started.
                  </span>
                </div>
                <button
                  className="mt-4 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-colors"
                  style={{ backgroundColor: "var(--th-tab-active)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Connect Contacts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtensionsContent({
  findMeFollowMe,
  setFindMeFollowMe,
  extensions,
  selectedExt,
  setSelectedExt,
  updateExtension,
}: {
  findMeFollowMe: boolean;
  setFindMeFollowMe: (v: boolean) => void;
  extensions: ExtensionRow[];
  selectedExt: number;
  setSelectedExt: (i: number) => void;
  updateExtension: (i: number, field: keyof ExtensionRow, value: string | boolean) => void;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold mb-4" style={{ color: "var(--th-text-primary)" }}>
        Extensions
      </h3>

      {/* Success banner */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-3"
        style={{ backgroundColor: "rgba(44,173,67,0.08)", border: "1px solid rgba(44,173,67,0.2)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2CAD43" strokeWidth="2" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span className="text-[12px] font-medium" style={{ color: "#2CAD43" }}>
          Extensions are active and registered.
        </span>
      </div>

      {/* Warning banner */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-3"
        style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-[12px] font-medium" style={{ color: "#F59E0B" }}>
          Extension 1003 is disabled. Enable it to receive forwarded calls.
        </span>
      </div>

      {/* Find Me / Follow Me toggle */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg mb-4"
        style={{ backgroundColor: "var(--th-bg-hover)" }}
      >
        <div>
          <div className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>
            Find Me / Follow Me
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>
            Ring extensions sequentially until answered
          </div>
        </div>
        <button
          onClick={() => setFindMeFollowMe(!findMeFollowMe)}
          className="relative w-10 h-[22px] rounded-full transition-colors duration-200"
          style={{
            backgroundColor: findMeFollowMe ? "#2CAD43" : "var(--th-border)",
          }}
          aria-label={`Find Me Follow Me is ${findMeFollowMe ? "enabled" : "disabled"}`}
          role="switch"
          aria-checked={findMeFollowMe}
        >
          <div
            className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200"
            style={{
              left: findMeFollowMe ? "20px" : "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>

      {/* Extension table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--th-border)" }}
      >
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ backgroundColor: "var(--th-bg-hover)", borderBottom: "1px solid var(--th-border)" }}>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 w-10" style={{ color: "var(--th-text-muted)" }}></th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Extension</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Destination</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 w-20" style={{ color: "var(--th-text-muted)" }}>Delay (s)</th>
              <th className="text-center text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 w-20" style={{ color: "var(--th-text-muted)" }}>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {extensions.map((row, i) => (
              <tr
                key={i}
                className="transition-colors cursor-pointer"
                style={{
                  borderBottom: i < extensions.length - 1 ? "1px solid var(--th-border-light)" : "none",
                  backgroundColor: selectedExt === i ? "var(--th-bg-hover)" : "transparent",
                }}
                onClick={() => setSelectedExt(i)}
              >
                <td className="px-4 py-2.5">
                  <input
                    type="radio"
                    name="selectedExt"
                    checked={selectedExt === i}
                    onChange={() => setSelectedExt(i)}
                    className="w-3.5 h-3.5"
                    style={{ accentColor: "var(--th-tab-active)" }}
                    aria-label={`Select extension ${row.ext}`}
                  />
                </td>
                <td className="px-4 py-2.5 font-medium" style={{ color: "var(--th-text-primary)" }}>
                  {row.ext}
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={row.destination}
                    onChange={(e) => updateExtension(i, "destination", e.target.value)}
                    className="w-full px-2 py-1 rounded text-[12px] outline-none transition-colors"
                    style={{
                      backgroundColor: "var(--th-bg-input)",
                      border: "1px solid var(--th-border)",
                      color: "var(--th-text-primary)",
                    }}
                    aria-label={`Destination for extension ${row.ext}`}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={row.delay}
                    onChange={(e) => updateExtension(i, "delay", e.target.value)}
                    className="w-full px-2 py-1 rounded text-[12px] outline-none transition-colors text-center"
                    style={{
                      backgroundColor: "var(--th-bg-input)",
                      border: "1px solid var(--th-border)",
                      color: "var(--th-text-primary)",
                    }}
                    aria-label={`Delay for extension ${row.ext}`}
                  />
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateExtension(i, "enabled", !row.enabled);
                    }}
                    className="relative w-8 h-[18px] rounded-full transition-colors duration-200 mx-auto block"
                    style={{
                      backgroundColor: row.enabled ? "#2CAD43" : "var(--th-border)",
                    }}
                    aria-label={`Extension ${row.ext} is ${row.enabled ? "enabled" : "disabled"}`}
                    role="switch"
                    aria-checked={row.enabled}
                  >
                    <div
                      className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200"
                      style={{
                        left: row.enabled ? "16px" : "2px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save / Cancel buttons */}
      <div className="flex items-center justify-end gap-3 mt-5">
        <button
          className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--th-border)",
            color: "var(--th-text-secondary)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-colors"
          style={{ backgroundColor: "var(--th-tab-active)" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
