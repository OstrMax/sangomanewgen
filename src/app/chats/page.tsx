"use client";

import { useState } from "react";
import CallPopup from "@/components/talk/CallPopup";

const favorites = [
  { name: "operations-team", type: "channel" as const, bold: true },
  { name: "Rent adjustment requests", type: "channel" as const },
];

const important = [
  { name: "ca-conference-2026-27", type: "channel" as const },
  { name: "us-conference-2025", type: "channel" as const },
];

const channels = [
  { name: "operations-team", type: "channel" as const },
  { name: "general", type: "channel" as const },
  { name: "Lora Greenland", type: "dm" as const, online: true },
  { name: "Terry Gonzales", type: "dm" as const, online: true },
  { name: "Eugene Sertgent", type: "dm" as const, online: true },
  { name: "design", type: "channel" as const, locked: true },
];

interface Message {
  id: number;
  sender: string;
  avatar: string;
  avatarColor: string;
  time: string;
  text: string;
  mention?: string;
  reactions?: { emoji: string; count: number }[];
  dividerBefore?: string;
  type?: "text" | "video-call" | "transcription" | "thread" | "document";
  metadata?: {
    duration?: string;
    participants?: number;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    threadCount?: number;
    callTitle?: string;
  };
}

const messages: Message[] = [
  { id: 1, sender: "Jim Dowell", avatar: "JD", avatarColor: "#3B82F6", time: "3:25 PM", text: "Heads up, we might need to cancel the evening meeting.", reactions: [{ emoji: "💯", count: 1 }, { emoji: "😊", count: 0 }] },
  { id: 2, sender: "Jim Dowell", avatar: "JD", avatarColor: "#3B82F6", time: "3:25 PM", text: "", type: "video-call", metadata: { callTitle: "Quick Sync — Design Review", duration: "23:14", participants: 4 }, dividerBefore: "Yesterday" },
  { id: 3, sender: "Cody Russell", avatar: "CR", avatarColor: "#7C3AED", time: "3:27 PM", text: "", type: "transcription", metadata: { callTitle: "Quick Sync — Design Review", duration: "23:14" } },
  { id: 4, sender: "Jim Dowell", avatar: "JD", avatarColor: "#3B82F6", time: "3:30 PM", text: "", type: "document", metadata: { fileName: "Q2_Design_Specs.pdf", fileSize: "2.4 MB", fileType: "pdf" } },
  { id: 5, sender: "Cody Russell", avatar: "CR", avatarColor: "#7C3AED", time: "3:27 PM", text: "Alright. We can discuss the QA doc next week.", mention: "@Jim Dowel", type: "thread", metadata: { threadCount: 3 } },
  { id: 6, sender: "Jim Dowell", avatar: "JD", avatarColor: "#3B82F6", time: "3:27 PM", text: "Cool." },
  { id: 7, sender: "Cody Russell", avatar: "CR", avatarColor: "#7C3AED", time: "3:27 PM", text: "Hi Jim! Got time to discuss the doc?", reactions: [{ emoji: "👍", count: 2 }, { emoji: "💬", count: 2 }, { emoji: "💯", count: 1 }], dividerBefore: "Today" },
];

export default function ChatsPage() {
  const [activeChannel, setActiveChannel] = useState("Jim Dowell");
  const [messageInput, setMessageInput] = useState("");
  const [calling, setCalling] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <div className="w-[280px] shrink-0 flex flex-col h-full" style={{ backgroundColor: 'var(--th-bg)', borderRight: '1px solid var(--th-border)' }}>
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-3" style={{ color: 'var(--th-text-primary)' }}>Chats</h1>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--th-bg-hover)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Find channel" className="bg-transparent outline-none text-sm placeholder:text-[#7F888F] w-full" style={{ color: 'var(--th-text-primary)' }} />
            </div>
            <button className="p-2 text-[color:var(--th-text-muted)] rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Filter channels">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <button className="flex items-center gap-2 text-sm text-[color:var(--th-text-muted)] mb-3">
            <span className="text-base">+</span> Threads
          </button>

          {/* Favorites */}
          <SectionHeader title="FAVORITES" />
          {favorites.map((item) => (
            <ChannelItem key={item.name} name={item.name} type={item.type} bold={item.bold} />
          ))}

          {/* Important */}
          <SectionHeader title="IMPORTANT" />
          {important.map((item) => (
            <ChannelItem key={item.name} name={item.name} type={item.type} />
          ))}

          {/* Channels */}
          <SectionHeader title="CHANNELS" />
          {channels.map((item) => (
            <ChannelItem key={item.name} name={item.name} type={item.type} online={item.online} locked={item.locked} />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: 'var(--th-bg)' }}>
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--th-border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>{activeChannel}</h2>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="flex items-center gap-3 text-xs text-[color:var(--th-text-muted)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2CAD43]" /> Online</span>
              <span className="flex items-center gap-1">📌 0</span>
              <span className="flex items-center gap-1">📝 Add chat description</span>
            </div>
          </div>
          <div className="flex items-center gap-[13px]">
            {/* Meet icon */}
            <button onClick={() => setCalling(true)} className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Start video call">
              <svg width="24" height="24" viewBox="0 0 31 32" fill="none"><path d="M24.8047 12.3957C24.5345 11.8045 23.8725 11.4548 23.2419 11.6123C22.7634 11.7317 22.2509 12.0093 21.715 12.3704C21.4735 12.5332 21.3667 12.8295 21.4434 13.1104C21.9673 15.0343 21.9673 16.9655 21.4434 18.8894C21.3667 19.1703 21.4735 19.4673 21.715 19.6295C22.2516 19.9905 22.7641 20.2681 23.2425 20.3875C23.8732 20.545 24.5351 20.1947 24.8054 19.6034C25.7316 17.5748 25.7316 14.425 24.8047 12.3957ZM7.45775 10.5913C11.1527 9.19191 14.8477 9.19191 18.5426 10.5913C18.8689 10.7147 19.1485 10.9643 19.3107 11.2846C20.8969 14.4284 20.8969 17.5721 19.3107 20.7152C19.1492 21.0355 18.8696 21.2851 18.5426 21.4085C14.8477 22.8079 11.1527 22.8079 7.45775 21.4085C7.13143 21.2851 6.85182 21.0355 6.68966 20.7152C5.10345 17.5714 5.10345 14.4284 6.68966 11.2846C6.85182 10.9643 7.13143 10.7147 7.45775 10.5913Z" fill="var(--th-text-primary)"/></svg>
            </button>
            {/* Talk/Phone icon */}
            <button onClick={() => setCalling(true)} className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Start voice call">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="var(--th-text-primary)"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>
            </button>
            {/* Info icon */}
            <button onClick={() => setShowInfo(!showInfo)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Contact info">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99935 1.66675C5.39935 1.66675 1.66602 5.40008 1.66602 10.0001C1.66602 14.6001 5.39935 18.3334 9.99935 18.3334C14.5993 18.3334 18.3327 14.6001 18.3327 10.0001C18.3327 5.40008 14.5993 1.66675 9.99935 1.66675ZM9.99935 14.1667C9.54102 14.1667 9.16602 13.7917 9.16602 13.3334V10.0001C9.16602 9.54175 9.54102 9.16675 9.99935 9.16675C10.4577 9.16675 10.8327 9.54175 10.8327 10.0001V13.3334C10.8327 13.7917 10.4577 14.1667 9.99935 14.1667ZM10.8327 7.50008H9.16602V5.83341H10.8327V7.50008Z" fill="var(--th-text-primary)"/></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.dividerBefore && (
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--th-divider)' }} />
                  <span className="text-xs text-[color:var(--th-text-muted)] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--th-bg)' }}>{msg.dividerBefore}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--th-divider)' }} />
                </div>
              )}
              <div className="flex gap-3 mb-4 group -mx-2 px-2 py-1 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)" }}>{msg.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--th-text-primary)' }}>{msg.sender}</span>
                    <span className="text-xs text-[color:var(--th-text-muted)]">{msg.time}</span>
                  </div>

                  {/* Video call card */}
                  {msg.type === "video-call" && msg.metadata && (
                    <div className="mt-2 rounded-lg p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--th-bg-hover)', border: '1px solid var(--th-border)' }}>
                      <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--th-text-primary)' }}>{msg.metadata.callTitle}</p>
                        <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{msg.metadata.duration} · {msg.metadata.participants} participants</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95" title="Join call" style={{ backgroundColor: 'var(--th-text-primary)', color: 'var(--th-bg)' }}>Join</button>
                    </div>
                  )}

                  {/* Transcription card */}
                  {msg.type === "transcription" && msg.metadata && (
                    <div className="mt-2 rounded-lg p-3" style={{ backgroundColor: 'var(--th-bg-hover)', border: '1px solid var(--th-border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        <span className="text-xs font-medium" style={{ color: 'var(--th-text-primary)' }}>Call Transcription</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--th-text-secondary)' }}>Transcription for &quot;{msg.metadata.callTitle}&quot; ({msg.metadata.duration})</p>
                      <button className="mt-2 text-xs font-medium" style={{ color: 'var(--th-tab-active)' }}>View full transcript →</button>
                    </div>
                  )}

                  {/* Document preview */}
                  {msg.type === "document" && msg.metadata && (
                    <div className="mt-2 rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors" style={{ backgroundColor: 'var(--th-bg-hover)', border: '1px solid var(--th-border)' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#EF4444' }}>
                        <span className="text-white text-[10px] font-bold uppercase">{msg.metadata.fileType}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--th-text-primary)' }}>{msg.metadata.fileName}</p>
                        <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{msg.metadata.fileSize}</p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </div>
                  )}

                  {/* Thread reply */}
                  {msg.type === "thread" && msg.metadata && (
                    <>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-primary)' }}>
                        {msg.mention && <span className="text-[#3B82F6] font-medium">{msg.mention} </span>}
                        {msg.text}
                      </p>
                      <button className="flex items-center gap-1.5 mt-1.5 text-xs font-medium" style={{ color: 'var(--th-tab-active)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        {msg.metadata.threadCount} replies
                      </button>
                    </>
                  )}

                  {/* Regular text message */}
                  {(!msg.type || msg.type === "text") && (
                    <p className="text-sm mt-0.5" style={{ color: 'var(--th-text-primary)' }}>
                      {msg.mention && <span className="text-[#3B82F6] font-medium">{msg.mention} </span>}
                      {msg.text}
                    </p>
                  )}

                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'var(--th-badge-bg)' }}>
                          {r.emoji}{r.count > 0 && <span className="text-[color:var(--th-text-muted)]">{r.count}</span>}
                        </span>
                      ))}
                      <button className="w-6 h-6 flex items-center justify-center rounded-full text-[color:var(--th-text-muted)] text-xs transition-colors hover:bg-[var(--th-bg-hover)]" title="Add reaction">😊</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ border: '1px solid var(--th-border)', backgroundColor: 'var(--th-bg-input)' }}>
            <input
              type="text"
              placeholder="Ask anything or select"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 outline-none text-sm placeholder:text-[#7F888F] bg-transparent"
              style={{ color: 'var(--th-text-primary)' }}
            />
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shrink-0" title="Send message" style={{ background: "linear-gradient(180deg, #AE0D8A 0%, #64168E 47.6%, #2F1155 100%)" }}>
              <svg width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M14.5439 0.820147C12.4104 -1.22485 5.54146 1.16452 4.76577 1.44327C2.63493 2.21015 0.0788345 3.3864 0.00205328 4.6414C-0.085228 6.36952 2.6264 8.10015 5.02696 8.77515C5.14246 8.80765 5.26715 8.77515 5.35246 8.6939L9.66533 4.5864C9.92193 4.34202 10.3367 4.34202 10.5933 4.5864C10.8499 4.83077 10.8499 5.22577 10.5933 5.47015L6.26924 9.58827C6.18393 9.66952 6.1498 9.78827 6.18327 9.89827C6.90121 12.2458 8.77349 14.6683 10.508 14.6683C10.5217 14.6683 10.5362 14.6683 10.55 14.6683C11.9419 14.5633 13.2524 11.6995 13.9093 10.0026C14.1941 9.27015 16.6183 2.79765 14.5439 0.820147Z" fill="white"/></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Info Panel */}
      {showInfo && (
        <div className="w-[340px] shrink-0 flex flex-col overflow-hidden animate-[slideInRight_0.3s_ease-out]" style={{ backgroundColor: 'var(--th-bg)', borderLeft: '1px solid var(--th-border)' }}>
          <div className="flex items-center justify-between px-5 h-14 shrink-0" style={{ borderBottom: '1px solid var(--th-border)' }}>
            <span className="text-[15px] font-semibold" style={{ color: 'var(--th-text-primary)' }}>Contact Info</span>
            <button onClick={() => setShowInfo(false)} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/><path d="M4.5 4.5L13.5 13.5" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold mb-3" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)" }}>JD</div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--th-text-primary)' }}>{activeChannel}</h3>
              <span className="flex items-center gap-1.5 text-sm text-[color:var(--th-text-muted)] mt-1">
                <span className="w-2 h-2 rounded-full bg-[#2CAD43]" /> Online
              </span>
            </div>
            <div className="space-y-4">
              <div className="pt-4" style={{ borderTop: '1px solid var(--th-border)' }}>
                <p className="text-xs font-semibold text-[color:var(--th-text-muted)] uppercase tracking-wider mb-2">Contact Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg><span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>+1 (416) 555-0198</span></div>
                  <div className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>jim.dowell@company.com</span></div>
                  <div className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg><span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>Product Manager</span></div>
                  <div className="flex items-center gap-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>Toronto, ON</span></div>
                </div>
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid var(--th-border)' }}>
                <p className="text-xs font-semibold text-[color:var(--th-text-muted)] uppercase tracking-wider mb-2">Shared Files</p>
                <div className="space-y-2">
                  {["Q2 Report.pdf", "Design Specs.fig", "Meeting Notes.docx"].map((f) => (
                    <div key={f} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--th-bg-hover)]" style={{ backgroundColor: 'var(--th-bg-elevated)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span className="text-sm" style={{ color: 'var(--th-text-primary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call popup */}
      {calling && <CallPopup name={activeChannel} onEnd={() => setCalling(false)} />}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1 mt-4 mb-1">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      <span className="text-[10px] font-semibold text-[color:var(--th-text-muted)] tracking-wider uppercase">{title}</span>
    </div>
  );
}

function ChannelItem({ name, type, bold, online, locked }: { name: string; type: "channel" | "dm"; bold?: boolean; online?: boolean; locked?: boolean }) {
  return (
    <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-[var(--th-bg-hover)]">
      {type === "channel" ? (
        <span className="text-[color:var(--th-text-muted)] text-sm">{locked ? "🔒" : "#"}</span>
      ) : (
        <span className={`w-2 h-2 rounded-full shrink-0 ${online ? "bg-[#2CAD43]" : "bg-[#CCCFD2]"}`} />
      )}
      <span className={`text-sm truncate ${bold ? "font-semibold" : "text-[color:var(--th-text-secondary)]"}`} style={bold ? { color: 'var(--th-text-primary)' } : undefined}>{name}</span>
    </button>
  );
}
