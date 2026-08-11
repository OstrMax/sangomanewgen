"use client";

import { useState } from "react";

type StatusSuggestion = {
  emoji: string;
  text: string;
  duration: string;
};

const recentStatuses: StatusSuggestion[] = [
  { emoji: "\uD83D\uDCC5", text: "In a meeting", duration: "1 hour" },
  { emoji: "\uD83C\uDF34", text: "Vacation time untill", duration: "23.10 Today" },
];

const suggestions: StatusSuggestion[] = [
  { emoji: "\uD83C\uDF7D\uFE0F", text: "Out for lunch", duration: "1 hour" },
  { emoji: "\uD83E\uDD12", text: "Out of sick", duration: "23.10 Today" },
  { emoji: "\uD83C\uDFE0", text: "Working from home", duration: "5 hour" },
  { emoji: "\uD83C\uDF34", text: "On vacations", duration: "5 hour" },
];

export default function SetStatusModal({ onClose }: { onClose: () => void }) {
  const [statusText, setStatusText] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div
        className="rounded-xl w-[500px]"
        style={{
          backgroundColor: "var(--th-dropdown-bg)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-semibold" style={{ color: "var(--th-text-primary)" }}>Set a status</h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Input */}
        <div className="px-6 pb-4">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5"
            style={{ border: "1px solid var(--th-border)" }}
          >
            <button className="shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Write your status here"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
              style={{ color: "var(--th-text-primary)" }}
            />
          </div>
        </div>

        {/* Recent */}
        <div className="px-6 pb-3">
          <p className="text-xs font-semibold tracking-wider mb-2" style={{ color: "var(--th-text-muted)" }}>RECENT</p>
          {recentStatuses.map((status, i) => (
            <button
              key={i}
              onClick={() => setStatusText(status.text)}
              className="w-full flex items-center gap-2 py-2 rounded px-1 transition-colors text-left"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span className="text-base">{status.emoji}</span>
              <span className="text-sm font-medium" style={{ color: "var(--th-text-primary)" }}>{status.text}</span>
              <span className="text-xs" style={{ color: "var(--th-text-muted)" }}>{status.duration}</span>
            </button>
          ))}
        </div>

        {/* Suggestions */}
        <div className="px-6 pb-4">
          <p className="text-xs font-semibold tracking-wider mb-2" style={{ color: "var(--th-text-muted)" }}>SUGGESTIONS</p>
          {suggestions.map((status, i) => (
            <button
              key={i}
              onClick={() => setStatusText(status.text)}
              className="w-full flex items-center gap-2 py-2 rounded px-1 transition-colors text-left"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span className="text-base">{status.emoji}</span>
              <span className="text-sm font-medium" style={{ color: "var(--th-text-primary)" }}>{status.text}</span>
              <span className="text-xs" style={{ color: "var(--th-text-muted)" }}>{status.duration}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4" style={{ borderTop: "1px solid var(--th-dropdown-divider)" }}>
          <button className="px-6 py-2.5 bg-[#0B182E] text-white text-sm font-semibold rounded-lg hover:bg-[#1a2b40] transition-colors">
            SET STATUS
          </button>
        </div>
      </div>
    </div>
  );
}
