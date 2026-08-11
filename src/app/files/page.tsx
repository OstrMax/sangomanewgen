"use client";

import { useState } from "react";

const folders = [
  { name: "Recordings", items: 24, icon: "folder", color: "#7C3AED" },
  { name: "Voicemails", items: 12, icon: "folder", color: "#1D3E77" },
  { name: "Meeting Notes", items: 8, icon: "folder", color: "#7C2870" },
  { name: "Shared with me", items: 15, icon: "shared", color: "#2CAD43" },
];

const files = [
  { name: "Q1 Sales Report.pdf", size: "2.4 MB", date: "Mar 2, 2026", type: "pdf", shared: ["Sarah C."] },
  { name: "Product Roadmap v3.2.xlsx", size: "890 KB", date: "Mar 1, 2026", type: "xlsx", shared: ["Mike R.", "Laura K."] },
  { name: "Meeting Recording - Sprint Review.mp3", size: "45.2 MB", date: "Feb 28, 2026", type: "audio", shared: [] },
  { name: "Brand Guidelines 2026.pdf", size: "12.1 MB", date: "Feb 25, 2026", type: "pdf", shared: ["Design Team"] },
  { name: "Customer Feedback Analysis.docx", size: "1.8 MB", date: "Feb 22, 2026", type: "docx", shared: ["Ava S."] },
  { name: "Onboarding Call - Acme Corp.mp4", size: "156 MB", date: "Feb 20, 2026", type: "video", shared: [] },
  { name: "Invoice Template.xlsx", size: "340 KB", date: "Feb 18, 2026", type: "xlsx", shared: [] },
  { name: "Team Photo - Offsite 2026.jpg", size: "4.7 MB", date: "Feb 15, 2026", type: "image", shared: ["All"] },
];

function FileTypeIcon({ type }: { type: string }) {
  const colors: Record<string, string> = { pdf: "#EF4444", xlsx: "#2CAD43", docx: "#1D3E77", audio: "#7C3AED", video: "#7C2870", image: "#3B82F6" };
  const labels: Record<string, string> = { pdf: "PDF", xlsx: "XLS", docx: "DOC", audio: "MP3", video: "MP4", image: "JPG" };
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: `${colors[type] || "#7F888F"}1A`, color: colors[type] || "#7F888F" }}>
      {labels[type] || "FILE"}
    </div>
  );
}

export default function FilesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("date");

  return (
    <div className="flex flex-col h-full bg-[var(--th-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--th-border)]">
        <h1 className="text-lg font-semibold text-[var(--th-text-primary)]">Files</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-2.5 top-1/2 -translate-y-1/2">
              <circle cx="7" cy="7" r="4.5" stroke="#7F888F" strokeWidth="1.3"/>
              <path d="M10.5 10.5L13.5 13.5" stroke="#7F888F" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search files..." className="pl-8 pr-3 py-1.5 w-52 text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-lg bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] transition-colors" />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-[13px] text-[var(--th-text-secondary)] border border-[var(--th-border)] rounded-lg bg-[var(--th-bg)] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="date">Sort by date</option>
            <option value="name">Sort by name</option>
            <option value="size">Sort by size</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-[var(--th-bg-hover)] rounded-lg p-0.5">
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-[var(--th-bg)] shadow-sm" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke={view === "list" ? "var(--th-text-primary)" : "var(--th-text-muted)"} strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-[var(--th-bg)] shadow-sm" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke={view === "grid" ? "var(--th-text-primary)" : "var(--th-text-muted)"} strokeWidth="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke={view === "grid" ? "var(--th-text-primary)" : "var(--th-text-muted)"} strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke={view === "grid" ? "var(--th-text-primary)" : "var(--th-text-muted)"} strokeWidth="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke={view === "grid" ? "var(--th-text-primary)" : "var(--th-text-muted)"} strokeWidth="1.3"/></svg>
            </button>
          </div>

          {/* Upload */}
          <button style={{ backgroundColor: "var(--th-tab-active)" }} className="flex items-center gap-1.5 px-4 py-1.5 text-white text-[13px] font-medium rounded-lg hover:bg-[#3d1a6e] active:scale-[0.98] transition-all">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 11V3m0 0L5 6m3-3l3 3M3 13h10" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Upload
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Folders */}
        <h2 className="text-[13px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-3">Folders</h2>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {folders.map((folder, i) => (
            <button
              key={folder.name}
              className="flex items-center gap-3 px-4 py-3.5 bg-[var(--th-bg)] border border-[var(--th-border)] rounded-xl hover:border-[var(--th-text-muted)] hover:shadow-sm active:scale-[0.98] transition-all text-left"
              style={{ animation: `fadeIn 0.2s ease-out ${0.04 * i}s both` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${folder.color}15` }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 5.5C2 4.67 2.67 4 3.5 4h4.17c.44 0 .86.18 1.17.5L10 5.67h6.5c.83 0 1.5.67 1.5 1.5V14.5c0 .83-.67 1.5-1.5 1.5h-13C2.67 16 2 15.33 2 14.5V5.5z" fill={folder.color} opacity="0.8"/>
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-medium text-[var(--th-text-primary)]">{folder.name}</div>
                <div className="text-[11px] text-[var(--th-text-muted)]">{folder.items} items</div>
              </div>
            </button>
          ))}
        </div>

        {/* Files */}
        <h2 className="text-[13px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-3">Recent Files</h2>
        {view === "list" ? (
          <div className="bg-[var(--th-bg)] border border-[var(--th-border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--th-border)] bg-[var(--th-bg-hover)]">
                  <th className="text-left text-[11px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider px-4 py-2.5">Name</th>
                  <th className="text-left text-[11px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider px-4 py-2.5">Size</th>
                  <th className="text-left text-[11px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider px-4 py-2.5">Modified</th>
                  <th className="text-left text-[11px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider px-4 py-2.5">Shared with</th>
                  <th className="text-right text-[11px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider px-4 py-2.5 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, i) => (
                  <tr
                    key={file.name}
                    className="border-b border-[var(--th-border-light)] last:border-0 hover:bg-[var(--th-bg-hover)] transition-colors cursor-pointer group"
                    style={{ animation: `fadeIn 0.2s ease-out ${0.03 * i}s both` }}
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <FileTypeIcon type={file.type} />
                      <span className="text-[13px] font-medium text-[var(--th-text-primary)]">{file.name}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--th-text-muted)]">{file.size}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--th-text-muted)]">{file.date}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--th-text-muted)]">{file.shared.length > 0 ? file.shared.join(", ") : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-[var(--th-bg-hover)] transition-colors active:scale-90">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 11V3m0 8l-3-3m3 3l3-3M3 13h10" stroke="#7F888F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 8 8)"/></svg>
                        </button>
                        <button className="p-1 rounded hover:bg-[var(--th-bg-hover)] transition-colors active:scale-90">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="4" r="1" fill="#7F888F"/><circle cx="8" cy="8" r="1" fill="#7F888F"/><circle cx="8" cy="12" r="1" fill="#7F888F"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {files.map((file, i) => (
              <button
                key={file.name}
                className="flex flex-col items-center gap-2 p-4 bg-[var(--th-bg)] border border-[var(--th-border)] rounded-xl hover:border-[var(--th-text-muted)] hover:shadow-sm active:scale-[0.98] transition-all text-center"
                style={{ animation: `fadeIn 0.2s ease-out ${0.03 * i}s both` }}
              >
                <FileTypeIcon type={file.type} />
                <div className="text-[12px] font-medium text-[var(--th-text-primary)] line-clamp-2 leading-tight">{file.name}</div>
                <div className="text-[11px] text-[var(--th-text-muted)]">{file.size} · {file.date}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
