"use client";

import { useState } from "react";
import SetStatusModal from "./SetStatusModal";

type StatusOption = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
};

const statusOptions: StatusOption[] = [
  {
    icon: <span className="w-5 h-5 rounded-full bg-[#34C759] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>,
    label: "Online",
    active: true,
  },
  {
    icon: <span className="w-5 h-5 rounded-full bg-[#FF9500] flex items-center justify-center text-white text-[10px] font-bold">!</span>,
    label: "Away",
  },
  {
    icon: <span className="w-5 h-5 rounded-full bg-[#FF3B30] flex items-center justify-center" />,
    label: "Do Not Disturb",
    hasSubmenu: true,
  },
  {
    icon: <span className="w-5 h-5 rounded-full bg-[#CCCFD2] flex items-center justify-center" />,
    label: "Offline",
  },
];

export default function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Online");

  return (
    <>
      <div
        className="absolute right-0 top-12 w-[260px] rounded-xl z-50 overflow-hidden"
        style={{
          backgroundColor: "var(--th-dropdown-bg)",
          border: "1px solid var(--th-dropdown-border)",
          boxShadow: "var(--th-dropdown-shadow)",
        }}
      >
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-semibold shrink-0">
            BH
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--th-text-primary)" }}>Billy Harrington</p>
            <p className="text-xs truncate" style={{ color: "var(--th-text-secondary)" }}>@bharrington</p>
          </div>
        </div>

        <div className="h-px" style={{ backgroundColor: "var(--th-dropdown-divider)" }} />

        {/* Set custom status */}
        <button
          onClick={() => setShowStatusModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Set a Custom Status</span>
        </button>

        <div className="h-px" style={{ backgroundColor: "var(--th-dropdown-divider)" }} />

        {/* Status options */}
        <div className="py-1">
          {statusOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setCurrentStatus(option.label)}
              className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {option.icon}
              <span className="text-sm flex-1" style={{ color: "var(--th-text-primary)" }}>{option.label}</span>
              {option.active && currentStatus === option.label && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {option.hasSubmenu && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="h-px" style={{ backgroundColor: "var(--th-dropdown-divider)" }} />

        {/* Profile & Logout */}
        <div className="py-1">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Profile</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Logout</span>
          </button>
        </div>
      </div>

      {showStatusModal && (
        <SetStatusModal onClose={() => setShowStatusModal(false)} />
      )}
    </>
  );
}
