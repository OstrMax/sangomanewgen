"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function GeneralSettingsDialog({
  onClose,
  onOpenCustomizeTabs,
  onOpenBranding,
}: {
  onClose: () => void;
  onOpenCustomizeTabs: () => void;
  onOpenBranding: () => void;
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="modal-enter w-[440px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--th-bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--th-border)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--th-text-primary)" }}>General Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-1">
          {/* Color mode */}
          <div className="flex items-center gap-3 py-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
            <span className="text-sm flex-1" style={{ color: "var(--th-text-primary)" }}>Color mode</span>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-[26px] rounded-full transition-colors duration-200 cursor-pointer shrink-0"
              style={{ backgroundColor: isDark ? "#158FCF" : "#F2F2F3", boxShadow: "inset 0px 6px 8px rgba(0,0,0,0.1)" }}
              aria-label="Toggle color mode"
            >
              <span
                className="absolute top-[1.5px] w-[23px] h-[23px] rounded-full bg-white transition-all duration-200 flex items-center justify-center"
                style={{ left: isDark ? "23.5px" : "1.5px", boxShadow: isDark ? "-2px 1px 6px rgba(0,0,0,0.25)" : "0 0 12px rgba(0,0,0,0.12)" }}
              >
                {isDark ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#158FCF" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </span>
            </button>
          </div>

          {/* Customize tabs */}
          <button
            onClick={onOpenCustomizeTabs}
            className="w-full flex items-center gap-3 py-2.5 rounded-lg transition-colors text-left hover:bg-[var(--th-bg-hover)]"
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

          {/* Branding & theme */}
          <button
            onClick={onOpenBranding}
            className="w-full flex items-center gap-3 py-2.5 rounded-lg transition-colors text-left hover:bg-[var(--th-bg-hover)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="1.5">
              <circle cx="13.5" cy="6.5" r="0.5" fill="var(--th-text-primary)" />
              <circle cx="17.5" cy="10.5" r="0.5" fill="var(--th-text-primary)" />
              <circle cx="8.5" cy="7.5" r="0.5" fill="var(--th-text-primary)" />
              <circle cx="6.5" cy="12.5" r="0.5" fill="var(--th-text-primary)" />
              <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z" />
            </svg>
            <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Branding &amp; theme</span>
          </button>
        </div>
      </div>
    </div>
  );
}
