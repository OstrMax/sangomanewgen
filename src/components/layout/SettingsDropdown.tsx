"use client";

import { useState } from "react";
import IntegrationDialog from "./IntegrationDialog";
import FaxSettingsDialog from "@/components/fax/FaxSettingsDialog";
import GeneralSettingsDialog from "./GeneralSettingsDialog";

type Row = { id: string; label: string; icon: React.ReactNode };

export default function SettingsDropdown({
  onClose: _onClose,
  onOpenCustomizeTabs,
  onOpenBranding,
}: {
  onClose: () => void;
  onOpenCustomizeTabs?: () => void;
  onOpenBranding?: () => void;
}) {
  const [open, setOpen] = useState<null | "general" | "fax" | "integrations">(null);

  const stroke = "var(--th-text-primary)";
  const rows: Row[] = [
    {
      id: "general",
      label: "General Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
    {
      id: "chat",
      label: "Chat Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      id: "phone",
      label: "Phone Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      id: "meet",
      label: "Meet Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      id: "sms",
      label: "SMS Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      ),
    },
    {
      id: "fax",
      label: "Fax Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
          <path d="M6 9V3h12v6" />
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
          <rect x="6" y="14" width="12" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="absolute right-0 top-12 w-[240px] rounded-2xl overflow-hidden z-50"
      style={{
        backgroundColor: "var(--th-dropdown-bg)",
        border: "1px solid var(--th-dropdown-border)",
        boxShadow: "var(--th-dropdown-shadow)",
      }}
    >
      {rows.map((row, i) => (
        <button
          key={row.id}
          onClick={() => {
            if (row.id === "general" || row.id === "fax" || row.id === "integrations") {
              setOpen(row.id as "general" | "fax" | "integrations");
            }
          }}
          className="w-full flex items-center gap-3 h-10 px-4 transition-colors text-left"
          style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--th-dropdown-divider)" : undefined }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <span className="shrink-0 flex items-center justify-center w-5 h-5">{row.icon}</span>
          <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>{row.label}</span>
        </button>
      ))}

      {open === "integrations" && <IntegrationDialog onClose={() => setOpen(null)} />}
      {open === "fax" && <FaxSettingsDialog onClose={() => setOpen(null)} />}
      {open === "general" && (
        <GeneralSettingsDialog
          onClose={() => setOpen(null)}
          onOpenCustomizeTabs={() => { setOpen(null); onOpenCustomizeTabs?.(); }}
          onOpenBranding={() => { setOpen(null); onOpenBranding?.(); }}
        />
      )}
    </div>
  );
}
