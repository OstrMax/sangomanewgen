"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import IntegrationDialog from "./IntegrationDialog";

export default function SettingsDropdown({ onClose: _onClose, onOpenCustomizeTabs, onOpenBranding }: { onClose: () => void; onOpenCustomizeTabs?: () => void; onOpenBranding?: () => void }) {
  const { isDark, toggleTheme } = useTheme();
  const [volume, setVolume] = useState(65);
  const [showIntegration, setShowIntegration] = useState(false);

  return (
    <div
      className="absolute right-0 top-12 w-[260px] rounded-xl overflow-hidden z-50"
      style={{
        backgroundColor: "var(--th-dropdown-bg)",
        border: "1px solid var(--th-dropdown-border)",
        boxShadow: "var(--th-dropdown-shadow)",
      }}
    >
      {/* Chat settings */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        style={{ borderTop: "1px solid var(--th-dropdown-divider)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Chat settings</span>
      </button>

      {/* Phone settings */}
      <div className="px-4 py-3.5 transition-colors">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Phone settings</span>
        </div>
        {/* Volume control */}
        <div className="flex items-center gap-2.5 mt-3 ml-[32px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="var(--th-text-muted)"/>
            {volume > 0 && <path d="M15.54 8.46a5 5 0 010 7.07" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/>}
            {volume > 50 && <path d="M18.07 5.93a9 9 0 010 12.14" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/>}
          </svg>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-[3px] rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--th-text-primary) 0%, var(--th-text-primary) ${volume}%, var(--th-border) ${volume}%, var(--th-border) 100%)`,
            }}
          />
          <span className="text-[11px] font-medium tabular-nums w-7 text-right" style={{ color: "var(--th-text-muted)" }}>{volume}</span>
        </div>
      </div>

      {/* SMS settings */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
        </svg>
        <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>SMS settings</span>
      </button>

      {/* Meet */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
        <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Meet</span>
      </button>

      {/* Color mode row */}
      <button
        onClick={toggleTheme}
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        style={{ borderTop: "1px solid var(--th-dropdown-divider)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        {/* Moon/sun icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
        <span className="text-sm flex-1" style={{ color: "var(--th-text-primary)" }}>Color mode</span>

        {/* Toggle switch */}
        <div
          className="relative w-12 h-[26px] rounded-full transition-colors duration-200 cursor-pointer"
          style={{
            backgroundColor: isDark ? "#158FCF" : "#F2F2F3",
            boxShadow: "inset 0px 6px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="absolute top-[1.5px] w-[23px] h-[23px] rounded-full bg-white transition-all duration-200 flex items-center justify-center"
            style={{
              left: isDark ? "23.5px" : "1.5px",
              boxShadow: isDark ? "-2px 1px 6px rgba(0,0,0,0.25)" : "0 0 12px rgba(0,0,0,0.12)",
            }}
          >
            {isDark ? (
              /* Moon icon inside toggle */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#158FCF" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            ) : (
              /* Sun icon inside toggle */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </div>
        </div>
      </button>

      {/* Integration */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        style={{ borderTop: "1px solid var(--th-dropdown-divider)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        onClick={() => setShowIntegration(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Integration</span>
      </button>

      {/* Customize tabs */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        onClick={() => onOpenCustomizeTabs?.()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
          <circle cx="6" cy="6" r="1.5" fill="var(--th-text-primary)" />
          <circle cx="14" cy="12" r="1.5" fill="var(--th-text-primary)" />
          <circle cx="9" cy="18" r="1.5" fill="var(--th-text-primary)" />
        </svg>
        <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Customize tabs</span>
      </button>

      {/* Branding & theme (white-label) */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        onClick={() => onOpenBranding?.()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
          <circle cx="13.5" cy="6.5" r="0.5" fill="var(--th-text-primary)" />
          <circle cx="17.5" cy="10.5" r="0.5" fill="var(--th-text-primary)" />
          <circle cx="8.5" cy="7.5" r="0.5" fill="var(--th-text-primary)" />
          <circle cx="6.5" cy="12.5" r="0.5" fill="var(--th-text-primary)" />
          <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z" />
        </svg>
        <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Branding & theme</span>
      </button>

      {showIntegration && (
        <IntegrationDialog onClose={() => setShowIntegration(false)} />
      )}
    </div>
  );
}
