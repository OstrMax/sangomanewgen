"use client";

import { useState } from "react";

type CallRecord = {
  id: number;
  name: string;
  extension: string;
  type: "Personal" | "Directory";
  typeColor: string;
  direction: "incoming" | "outgoing" | "missed";
  duration: string;
  date: string;
  time: string;
};

const callRecords: CallRecord[] = [
  { id: 1, name: "Terry Crews", extension: "X9421", type: "Personal", typeColor: "#2CAD43", direction: "incoming", duration: "02:11", date: "5/11/2025", time: "1:22 AM" },
  { id: 2, name: "Cameron Lopez", extension: "X1112", type: "Directory", typeColor: "#4A9EF5", direction: "missed", duration: "00:00", date: "4/11/2025", time: "8:21 AM" },
  { id: 3, name: "Cameron Lopez", extension: "X1112", type: "Directory", typeColor: "#4A9EF5", direction: "missed", duration: "00:00", date: "4/11/2025", time: "8:21 AM" },
  { id: 4, name: "Cameron Lopez", extension: "X1112", type: "Directory", typeColor: "#4A9EF5", direction: "missed", duration: "00:00", date: "4/11/2025", time: "8:21 AM" },
  { id: 5, name: "Anneta Walson", extension: "X752", type: "Personal", typeColor: "#2CAD43", direction: "outgoing", duration: "00:33", date: "3/11/2025", time: "10:15 AM" },
];

const filterTabs = ["ALL", "MISSED", "INCOMING", "OUTGOING"] as const;

export default function CallLog() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = callRecords.filter((r) => {
    if (activeFilter === "MISSED") return r.direction === "missed";
    if (activeFilter === "INCOMING") return r.direction === "incoming";
    if (activeFilter === "OUTGOING") return r.direction === "outgoing";
    return true;
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Filter tabs */}
      <div
        className="flex items-center gap-4 px-6 py-3 border-b"
        style={{ borderColor: 'var(--th-border)' }}
      >
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="text-xs font-semibold tracking-wider transition-colors flex items-center gap-1"
            style={{ color: activeFilter === tab ? 'var(--th-text-primary)' : 'var(--th-text-muted)' }}
          >
            {activeFilter === tab && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-6 py-3">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ backgroundColor: 'var(--th-search-bg)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search calls"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--th-text-muted)]"
            style={{ color: 'var(--th-text-primary)' }}
          />
        </div>
      </div>

      {/* Table header */}
      <div
        className="grid grid-cols-[1fr_100px_80px_120px_60px] gap-2 px-6 py-2 text-xs font-semibold text-[var(--th-text-muted)] tracking-wider border-b"
        style={{ borderColor: 'var(--th-border)' }}
      >
        <span>TO / FROM</span>
        <span>TYPE</span>
        <span>DURATION</span>
        <span>CALL TIME</span>
        <span></span>
      </div>

      {/* Records */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((record) => (
          <div
            key={record.id}
            className="grid grid-cols-[1fr_100px_80px_120px_60px] gap-2 items-center px-6 py-3 transition-colors cursor-pointer group border-b"
            style={{ borderColor: 'var(--th-border-light)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {/* Name & direction */}
            <div className="flex items-center gap-3">
              {/* Direction icon */}
              <div className="shrink-0">
                {record.direction === "incoming" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 7 17 17 17"/>
                  </svg>
                )}
                {record.direction === "outgoing" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="17 17 17 7 7 7"/>
                  </svg>
                )}
                {record.direction === "missed" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 7 17 17 17"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--th-text-primary)' }}>{record.name}</p>
                <span
                  className="text-xs px-1.5 py-0.5 rounded border inline-block mt-0.5"
                  style={{ backgroundColor: 'var(--th-badge-bg)', borderColor: 'var(--th-border)', color: 'var(--th-text-secondary)' }}
                >
                  {record.extension}
                </span>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: record.typeColor }} />
              <span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>{record.type}</span>
            </div>

            {/* Duration */}
            <span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>{record.duration}</span>

            {/* Call time */}
            <div>
              <p className="text-sm" style={{ color: 'var(--th-text-primary)' }}>{record.date}</p>
              <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{record.time}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </button>
              <button
                className="p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--th-text-secondary)">
                  <circle cx="12" cy="5" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
