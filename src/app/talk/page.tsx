"use client";

import { useState } from "react";
import ContactsList from "@/components/talk/ContactsList";
import CallLog from "@/components/talk/CallLog";
import CallPopup from "@/components/talk/CallPopup";

const tabs = [
  { id: "contacts", label: "Contacts", icon: ContactsIcon },
  { id: "call-log", label: "Call log", icon: CallLogIcon },
  { id: "voicemail", label: "Voicemail", icon: VoicemailIcon },
  { id: "recordings", label: "Recordings", icon: RecordingsIcon },
  { id: "parked", label: "Parked", icon: ParkedIcon },
] as const;

const dialPadKeys = [
  { digit: "1", sub: "" },
  { digit: "2", sub: "ABC" },
  { digit: "3", sub: "DEF" },
  { digit: "4", sub: "GHI" },
  { digit: "5", sub: "JKL" },
  { digit: "6", sub: "NMO" },
  { digit: "7", sub: "PQRS" },
  { digit: "8", sub: "TUV" },
  { digit: "9", sub: "WXYZ" },
  { digit: "*", sub: "" },
  { digit: "0", sub: "+" },
  { digit: "#", sub: "" },
];

const voicemails = [
  { id: 1, from: "Sarah Chen", phone: "+1 (416) 555-0123", duration: "0:42", date: "Today, 2:30 PM", isNew: true },
  { id: 2, from: "Unknown", phone: "+1 (905) 555-0456", duration: "1:15", date: "Today, 11:45 AM", isNew: true },
  { id: 3, from: "Mike Ross", phone: "+1 (647) 555-0789", duration: "0:28", date: "Yesterday, 4:20 PM", isNew: false },
  { id: 4, from: "Terry Crews", phone: "+1 (416) 555-0321", duration: "2:05", date: "Yesterday, 9:15 AM", isNew: false },
  { id: 5, from: "Laura Kim", phone: "+1 (905) 555-0654", duration: "0:55", date: "Mar 18, 3:30 PM", isNew: false },
];

const recordingsList = [
  { id: 1, title: "Call with Sarah Chen", duration: "12:34", date: "Today, 10:30 AM", size: "4.2 MB" },
  { id: 2, title: "Support Call #4521", duration: "8:15", date: "Yesterday, 2:15 PM", size: "2.8 MB" },
  { id: 3, title: "Client Meeting — Acme", duration: "45:22", date: "Mar 18, 11:00 AM", size: "15.6 MB" },
  { id: 4, title: "Sales Demo Call", duration: "23:10", date: "Mar 17, 3:45 PM", size: "7.9 MB" },
];

const parkedCalls = [
  { id: 1, slot: "701", caller: "+1 (416) 555-0123", name: "Sarah Chen", duration: "2:15", queue: "Sales" },
  { id: 2, slot: "702", caller: "+1 (905) 555-0456", name: "Unknown", duration: "0:45", queue: "Support" },
];

export default function TalkPage() {
  const [activeTab, setActiveTab] = useState<string>("contacts");
  const [phoneInput, setPhoneInput] = useState("");
  const [calling, setCalling] = useState(false);
  const [showActiveCall, setShowActiveCall] = useState(true);

  const handleCall = () => {
    if (phoneInput.length > 0) setCalling(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header bar: Talk title + phone dropdown + tabs */}
      <div
        className="flex items-center shrink-0 px-5"
        style={{ borderBottom: '1px solid var(--th-border)' }}
      >
        {/* Talk title */}
        <span className="text-lg font-semibold mr-3" style={{ color: 'var(--th-text-primary)' }}>
          Talk
        </span>

        {/* Phone number dropdown */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors"
          style={{ color: 'var(--th-text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          +12063127805
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Separator */}
        <div className="w-px h-6 mx-4" style={{ backgroundColor: 'var(--th-border)' }} />

        {/* Tabs */}
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-5 text-sm font-semibold transition-colors relative"
              style={{
                color: activeTab === tab.id ? 'var(--th-tab-active)' : 'var(--th-text-secondary)',
              }}
            >
              <span style={{ color: activeTab === tab.id ? 'var(--th-tab-active)' : 'var(--th-text-secondary)' }}>
                <tab.icon active={activeTab === tab.id} />
              </span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--th-tab-active)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content — Left panel (call card + dial pad) | Content right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          className="w-[300px] shrink-0 border-r flex flex-col h-full overflow-y-auto"
          style={{ backgroundColor: 'var(--th-bg)', borderColor: 'var(--th-border)' }}
        >
          {/* Active call card */}
          {showActiveCall && (
            <div className="px-4 py-3" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--th-text-primary)' }}>Ongoing call</span>
              <div className="mt-2 rounded-[12px] p-2" style={{ backgroundColor: "var(--th-call-card-bg)", border: "1px solid var(--th-call-card-border)" }}>
                {/* Header row: phone number + External badge */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] font-medium" style={{ color: "var(--th-call-card-text)" }}>(416) 7638098</span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 text-[12px] font-medium rounded-full" style={{ backgroundColor: "var(--th-badge-external-bg)", color: "var(--th-badge-external-text)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="7 17 2 12 7 7"/><polyline points="17 7 22 12 17 17"/></svg>
                    External
                  </span>
                </div>

                {/* Timer */}
                <div className="text-[12px] mb-3" style={{ color: "var(--th-call-card-muted)" }}>00:00:02</div>

                {/* Controls row */}
                <div className="flex items-center gap-2">
                  {/* Blind dropdown */}
                  <button className="flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors active:scale-95" title="Transfer call" style={{ backgroundColor: "var(--th-call-btn-bg)", color: "var(--th-call-btn-text)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span className="text-[12px] font-medium">Blind</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  <div className="flex-1" />

                  {/* Hold */}
                  <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95" title="Hold" style={{ backgroundColor: "var(--th-call-action-bg)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-call-card-text)" strokeWidth="2"><line x1="8" y1="5" x2="8" y2="19"/><line x1="16" y1="5" x2="16" y2="19"/></svg>
                  </button>

                  {/* Park */}
                  <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95" title="Park" style={{ backgroundColor: "var(--th-call-action-bg)" }}>
                    <span className="text-[13px] font-bold" style={{ color: "var(--th-call-card-text)" }}>P</span>
                  </button>

                  {/* End call */}
                  <button
                    onClick={() => setShowActiveCall(false)}
                    className="w-9 h-9 rounded-full bg-[#EF4444] flex items-center justify-center hover:bg-[#dc3545] transition-all active:scale-90"
                    title="End call"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.32564 12.1201C5.47897 11.9481 6.42229 11.5697 6.44429 10.4146L6.4556 9.72167C6.464 9.2154 5.78853 7.66424 9.96947 7.66096C14.1454 7.65328 13.4184 9.20775 13.4052 9.71277L13.3941 10.4089C13.375 11.5606 14.3024 11.9371 15.4514 12.1067L16.1447 12.2107C17.2919 12.3757 18.2292 12.2774 18.2514 11.1255L18.2599 10.4991C18.311 10.0246 18.3529 8.61362 17.2413 7.28151C15.9087 5.68225 13.4754 4.87232 10.0172 4.87638C6.55883 4.87729 4.0967 5.69704 2.70646 7.30024C1.55202 8.63383 1.54033 10.0474 1.57292 10.5207L1.56446 11.1471C1.54229 12.299 2.47557 12.3955 3.63039 12.2217L4.32564 12.1201Z" fill="white"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dial pad */}
          <div className="flex flex-col items-center flex-1 p-6">
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Enter a name or number"
              className="w-full text-center text-base text-[var(--th-text-muted)] mb-4 pb-2 outline-none placeholder:text-[var(--th-text-muted)]"
              style={{ backgroundColor: 'transparent' }}
            />

            <div className="grid grid-cols-3 gap-3 mb-6">
              {dialPadKeys.map((key) => (
                <button
                  key={key.digit}
                  onClick={() => setPhoneInput((prev) => prev + key.digit)}
                  className="flex flex-col items-center justify-center w-16 h-16 rounded-full border active:scale-95 transition-all"
                  style={{ borderColor: 'var(--th-border)', backgroundColor: 'var(--th-bg)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg)'}
                >
                  <span className="text-2xl font-medium" style={{ color: 'var(--th-text-primary)' }}>{key.digit}</span>
                  {key.sub && (
                    <span className="text-[10px] font-medium text-[color:var(--th-text-muted)] tracking-wider">{key.sub}</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleCall}
              className={`btn-call w-14 h-14 rounded-full bg-[#2CAD43] flex items-center justify-center shadow-lg ${phoneInput.length > 0 ? "" : "opacity-60 cursor-not-allowed"}`}
              title="Make a call"
            >
              <svg width="22" height="22" viewBox="0 0 28 28" fill="white"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>
            </button>
          </div>
        </div>

        {/* Right panel — content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "contacts" && <ContactsList />}
            {activeTab === "call-log" && <CallLog />}
            {activeTab === "voicemail" && <VoicemailList />}
            {activeTab === "recordings" && <RecordingsListView />}
            {activeTab === "parked" && <ParkedCallsView />}
          </div>
        </div>
      </div>

      {calling && <CallPopup name={phoneInput || "Unknown"} initials="#" onEnd={() => setCalling(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Voicemail List                                                      */
/* ------------------------------------------------------------------ */
function VoicemailList() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-3 border-b"
        style={{ borderColor: 'var(--th-border)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--th-text-primary)' }}>
          Voicemail
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--th-tab-active)', color: '#fff' }}>
          {voicemails.filter(v => v.isNew).length} new
        </span>
        <div className="flex-1" />
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--th-search-bg)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search voicemails"
            className="bg-transparent outline-none text-sm placeholder:text-[#7F888F] w-48"
            style={{ color: 'var(--th-text-primary)' }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {voicemails.map((vm) => (
          <div
            key={vm.id}
            className="flex items-center gap-4 px-6 py-3.5 transition-colors cursor-pointer"
            style={{ backgroundColor: hoveredId === vm.id ? 'var(--th-bg-hover)' : 'transparent' }}
            onMouseEnter={() => setHoveredId(vm.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* New indicator */}
            <div className="w-2.5 shrink-0 flex items-center justify-center">
              {vm.isNew && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              )}
            </div>

            {/* Play button */}
            <button
              className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors"
              style={{ borderColor: 'var(--th-border)', backgroundColor: 'var(--th-bg)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--th-text-primary)">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--th-text-primary)' }}>
                {vm.from}
              </p>
              <p className="text-xs text-[color:var(--th-text-muted)]">{vm.phone}</p>
            </div>

            {/* Duration */}
            <span className="text-xs font-medium shrink-0" style={{ color: 'var(--th-text-secondary)' }}>
              {vm.duration}
            </span>

            {/* Date */}
            <span className="text-xs text-[color:var(--th-text-muted)] shrink-0 w-36 text-right">
              {vm.date}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                className="p-1.5 rounded transition-colors"
                title="Call back"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </button>
              <button
                className="p-1.5 rounded transition-colors"
                title="Delete"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recordings List                                                     */
/* ------------------------------------------------------------------ */
function RecordingsListView() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-3 border-b"
        style={{ borderColor: 'var(--th-border)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--th-text-primary)' }}>
          Recordings
        </span>
        <span className="text-xs text-[color:var(--th-text-muted)]">
          {recordingsList.length} recordings
        </span>
        <div className="flex-1" />
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--th-search-bg)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search recordings"
            className="bg-transparent outline-none text-sm placeholder:text-[#7F888F] w-48"
            style={{ color: 'var(--th-text-primary)' }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {recordingsList.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center gap-4 px-6 py-3.5 transition-colors cursor-pointer"
            style={{ backgroundColor: hoveredId === rec.id ? 'var(--th-bg-hover)' : 'transparent' }}
            onMouseEnter={() => setHoveredId(rec.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Play button */}
            <button
              className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors"
              style={{ borderColor: 'var(--th-border)', backgroundColor: 'var(--th-bg)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--th-text-primary)">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--th-text-primary)' }}>
                {rec.title}
              </p>
              <p className="text-xs text-[color:var(--th-text-muted)]">{rec.date}</p>
            </div>

            {/* Duration */}
            <span className="text-xs font-medium shrink-0" style={{ color: 'var(--th-text-secondary)' }}>
              {rec.duration}
            </span>

            {/* Size badge */}
            <span
              className="text-xs px-2 py-0.5 rounded border shrink-0"
              style={{ backgroundColor: 'var(--th-badge-bg)', borderColor: 'var(--th-border)', color: 'var(--th-text-secondary)' }}
            >
              {rec.size}
            </span>

            {/* Download button */}
            <button
              className="p-1.5 rounded transition-colors"
              title="Download"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parked Calls                                                        */
/* ------------------------------------------------------------------ */
function ParkedCallsView() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-3 border-b"
        style={{ borderColor: 'var(--th-border)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--th-text-primary)' }}>
          Parked Calls
        </span>
        <span className="text-xs text-[color:var(--th-text-muted)]">
          {parkedCalls.length} calls parked
        </span>
        <div className="flex-1" />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {parkedCalls.map((call) => (
          <div
            key={call.id}
            className="flex items-center gap-4 px-6 py-3.5 transition-colors cursor-pointer"
            style={{ backgroundColor: hoveredId === call.id ? 'var(--th-bg-hover)' : 'transparent' }}
            onMouseEnter={() => setHoveredId(call.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Slot badge */}
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
              style={{ backgroundColor: 'var(--th-tab-active)', color: '#fff' }}
            >
              {call.slot}
            </span>

            {/* Caller info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--th-text-primary)' }}>
                {call.name}
              </p>
              <p className="text-xs text-[color:var(--th-text-muted)]">{call.caller}</p>
            </div>

            {/* Duration */}
            <span className="text-xs font-medium shrink-0" style={{ color: 'var(--th-text-secondary)' }}>
              {call.duration}
            </span>

            {/* Queue badge */}
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0"
              style={{
                backgroundColor: call.queue === "Sales" ? '#DBEAFE' : '#FEF3C7',
                color: call.queue === "Sales" ? '#1E40AF' : '#92400E',
              }}
            >
              {call.queue}
            </span>

            {/* Pickup button */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-colors active:scale-95"
              style={{ backgroundColor: '#2CAD43' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#259c3a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2CAD43'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              Pickup
            </button>
          </div>
        ))}

        {/* Empty state hint */}
        {parkedCalls.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-[color:var(--th-text-muted)]">
            No calls currently parked
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab Icons                                                           */
/* ------------------------------------------------------------------ */
function ContactsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--th-tab-active)" : "#7F888F"} strokeWidth="1.8">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" strokeLinecap="round"/>
      <path d="M19 8h3M20.5 6.5v3" strokeLinecap="round"/>
    </svg>
  );
}

function CallLogIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--th-tab-active)" : "#7F888F"} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VoicemailIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--th-tab-active)" : "#7F888F"} strokeWidth="1.8">
      <circle cx="6" cy="12" r="4"/>
      <circle cx="18" cy="12" r="4"/>
      <path d="M6 16h12"/>
    </svg>
  );
}

function RecordingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--th-tab-active)" : "#7F888F"} strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function ParkedIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--th-tab-active)" : "#7F888F"} strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <path d="M9 17V7h4a3 3 0 010 6H9"/>
    </svg>
  );
}
