"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type PanelView = "main" | "receptionist" | "tone" | "meeting" | "sms" | "recording" | "autoresponse" | "smart-reply" | "summarize" | "transcribe" | "meeting-notes" | "sentiment" | "smart-search";

const personas = [
  { name: "John", img: "https://i.pravatar.cc/128?img=11" },
  { name: "Stacy", img: "https://i.pravatar.cc/128?img=5" },
  { name: "Lora", img: "https://i.pravatar.cc/128?img=9" },
  { name: "Steve", img: "https://i.pravatar.cc/128?img=12" },
  { name: "Kerry", img: "https://i.pravatar.cc/128?img=32" },
  { name: "Arro", img: "https://i.pravatar.cc/128?img=33" },
  { name: "Terry", img: "https://i.pravatar.cc/128?img=53" },
  { name: "Mike", img: "https://i.pravatar.cc/128?img=68" },
];

const actionButtons = [
  { label: "Catch up on meeting", icon: "meeting" },
  { label: "Help me write a text message", icon: "sms" },
  { label: "Add your AI receptionist", icon: "receptionist" },
  { label: "Help to find recordings", icon: "recording" },
  { label: "Create auto-response", icon: "auto" },
];

const receptionistSteps = [
  "Tone and personality",
  "Company description",
  "Location and business hours",
  "Transfer by name",
  "Greeting",
];

/* ── Action button icons (outline style) ── */
function ActionIcon({ type }: { type: string }) {
  const cls = "shrink-0";
  switch (type) {
    case "meeting":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cls}><rect x="3" y="6" width="14" height="12" rx="1.5" stroke="var(--th-tab-active)" strokeWidth="1.5"/><path d="M17 10l4-3v10l-4-3" stroke="var(--th-tab-active)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "sms":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cls}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z" stroke="var(--th-tab-active)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="12" r="1" fill="var(--th-tab-active)"/><circle cx="12" cy="12" r="1" fill="var(--th-tab-active)"/><circle cx="16" cy="12" r="1" fill="var(--th-tab-active)"/></svg>;
    case "receptionist":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cls}><circle cx="12" cy="8" r="4" stroke="var(--th-tab-active)" strokeWidth="1.5"/><path d="M4 20c0-2.67 5.33-4 8-4s8 1.33 8 4" stroke="var(--th-tab-active)" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "recording":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cls}><rect x="9" y="2" width="6" height="12" rx="3" stroke="var(--th-tab-active)" strokeWidth="1.5"/><path d="M5 11a7 7 0 0014 0" stroke="var(--th-tab-active)" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 18v3m-3 0h6" stroke="var(--th-tab-active)" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "auto":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={cls}><circle cx="12" cy="12" r="9" stroke="var(--th-tab-active)" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="var(--th-tab-active)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default:
      return null;
  }
}

/* ── Sparkle icon (purple, used in main view heading) ── */
function SparkleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.8645 11.3095L13.5196 10.2864C12.9525 10.0397 12.5008 9.58654 12.254 9.02087L11.2309 6.67592C11.1516 6.49409 10.8933 6.49409 10.8139 6.67592L9.79077 9.02087C9.54401 9.58798 9.09089 10.0397 8.52522 10.2864L6.17738 11.311C5.99556 11.3903 5.99556 11.6472 6.17738 11.7266L8.56562 12.7829C9.1313 13.0325 9.58153 13.4871 9.8254 14.0557L10.8153 16.3559C10.8933 16.5391 11.153 16.5391 11.2324 16.3559L12.254 14.0152C12.5008 13.4481 12.9539 12.9965 13.5196 12.7497L15.8645 11.7266C16.0464 11.6472 16.0464 11.3889 15.8645 11.3095Z" fill="var(--th-tab-active)"/>
      <path d="M6.43189 9.78292L6.91098 8.68476C7.02643 8.41924 7.23855 8.20711 7.50407 8.09167L8.60367 7.61258C8.68881 7.57506 8.68881 7.45384 8.60367 7.41777L7.50407 6.93868C7.23855 6.82323 7.02643 6.6111 6.91098 6.34558L6.43189 5.24598C6.39437 5.16084 6.27316 5.16084 6.23708 5.24598L5.75799 6.34558C5.64255 6.6111 5.43042 6.82323 5.1649 6.93868L4.06385 7.41921C3.97872 7.45673 3.97872 7.5765 4.06385 7.61402L5.18366 8.10898C5.44918 8.22587 5.65986 8.43944 5.77386 8.70496L6.23852 9.78292C6.27604 9.86806 6.39726 9.8695 6.43333 9.78292H6.43189Z" fill="var(--th-tab-active)"/>
      <path d="M8.53992 4.79559L9.13445 5.05823C9.27587 5.12028 9.38699 5.23428 9.4476 5.37425L9.69436 5.94714C9.71456 5.99332 9.77805 5.99332 9.79826 5.94714L10.0522 5.36415C10.1143 5.22273 10.2268 5.11018 10.3668 5.04957L10.9498 4.79559C10.9945 4.77539 10.9945 4.7119 10.9498 4.69169L10.3668 4.43772C10.2254 4.37567 10.1128 4.26311 10.0522 4.12313L9.79826 3.54014C9.77805 3.49541 9.71456 3.49541 9.69436 3.54014L9.44038 4.12313C9.37833 4.26455 9.26577 4.37711 9.1258 4.43772L8.54136 4.69314C8.49663 4.71334 8.49663 4.77683 8.54136 4.79703L8.53992 4.79559Z" fill="var(--th-tab-active)"/>
    </svg>
  );
}

/* ── Passive state AI button (outline circle with sparkles) ── */
export function PassiveAIIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="white"/>
      <path d="M15.8645 11.3095L13.5196 10.2864C12.9525 10.0397 12.5008 9.58654 12.254 9.02087L11.2309 6.67592C11.1516 6.49409 10.8933 6.49409 10.8139 6.67592L9.79077 9.02087C9.54401 9.58798 9.09089 10.0397 8.52522 10.2864L6.17738 11.311C5.99556 11.3903 5.99556 11.6472 6.17738 11.7266L8.56562 12.7829C9.1313 13.0325 9.58153 13.4871 9.8254 14.0557L10.8153 16.3559C10.8933 16.5391 11.153 16.5391 11.2324 16.3559L12.254 14.0152C12.5008 13.4481 12.9539 12.9965 13.5196 12.7497L15.8645 11.7266C16.0464 11.6472 16.0464 11.3889 15.8645 11.3095Z" fill="white"/>
      <path d="M6.43189 9.78292L6.91098 8.68476C7.02643 8.41924 7.23855 8.20711 7.50407 8.09167L8.60367 7.61258C8.68881 7.57506 8.68881 7.45384 8.60367 7.41777L7.50407 6.93868C7.23855 6.82323 7.02643 6.6111 6.91098 6.34558L6.43189 5.24598C6.39437 5.16084 6.27316 5.16084 6.23708 5.24598L5.75799 6.34558C5.64255 6.6111 5.43042 6.82323 5.1649 6.93868L4.06385 7.41921C3.97872 7.45673 3.97872 7.5765 4.06385 7.61402L5.18366 8.10898C5.44918 8.22587 5.65986 8.43944 5.77386 8.70496L6.23852 9.78292C6.27604 9.86806 6.39726 9.8695 6.43333 9.78292H6.43189Z" fill="white"/>
      <path d="M8.53992 4.79559L9.13445 5.05823C9.27587 5.12028 9.38699 5.23428 9.4476 5.37425L9.69436 5.94714C9.71456 5.99332 9.77805 5.99332 9.79826 5.94714L10.0522 5.36415C10.1143 5.22273 10.2268 5.11018 10.3668 5.04957L10.9498 4.79559C10.9945 4.77539 10.9945 4.7119 10.9498 4.69169L10.3668 4.43772C10.2254 4.37567 10.1128 4.26311 10.0522 4.12313L9.79826 3.54014C9.77805 3.49541 9.71456 3.49541 9.69436 3.54014L9.44038 4.12313C9.37833 4.26455 9.26577 4.37711 9.1258 4.43772L8.54136 4.69314C8.49663 4.71334 8.49663 4.77683 8.54136 4.79703L8.53992 4.79559Z" fill="white"/>
    </svg>
  );
}

/* ── Active state Sangoma AI icon (filled circle with dark sparkles) ── */
export function ActiveAIIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="10" fill="white"/>
      <path d="M17.8645 13.3095L15.5196 12.2864C14.9525 12.0397 14.5008 11.5865 14.254 11.0209L13.2309 8.67592C13.1516 8.49409 12.8933 8.49409 12.8139 8.67592L11.7908 11.0209C11.544 11.588 11.0909 12.0397 10.5252 12.2864L8.17738 13.311C7.99556 13.3903 7.99556 13.6472 8.17738 13.7266L10.5656 14.7829C11.1313 15.0325 11.5815 15.4871 11.8254 16.0557L12.8153 18.3559C12.8933 18.5391 13.153 18.5391 13.2324 18.3559L14.254 16.0152C14.5008 15.4481 14.9539 14.9965 15.5196 14.7497L17.8645 13.7266C18.0464 13.6472 18.0464 13.3889 17.8645 13.3095Z" fill="#2E1055"/>
      <path d="M8.43189 11.7829L8.91098 10.6848C9.02643 10.4192 9.23855 10.2071 9.50407 10.0917L10.6037 9.61258C10.6888 9.57506 10.6888 9.45384 10.6037 9.41777L9.50407 8.93868C9.23855 8.82323 9.02643 8.6111 8.91098 8.34558L8.43189 7.24598C8.39437 7.16084 8.27316 7.16084 8.23708 7.24598L7.75799 8.34558C7.64255 8.6111 7.43042 8.82323 7.1649 8.93868L6.06385 9.41921C5.97872 9.45673 5.97872 9.5765 6.06385 9.61402L7.18366 10.109C7.44918 10.2259 7.65986 10.4394 7.77386 10.705L8.23852 11.7829C8.27604 11.8681 8.39726 11.8695 8.43333 11.7829H8.43189Z" fill="#2E1055"/>
      <path d="M10.5399 6.79559L11.1345 7.05823C11.2759 7.12028 11.387 7.23428 11.4476 7.37425L11.6944 7.94714C11.7146 7.99332 11.7781 7.99332 11.7983 7.94714L12.0522 7.36415C12.1143 7.22273 12.2268 7.11018 12.3668 7.04957L12.9498 6.79559C12.9945 6.77539 12.9945 6.7119 12.9498 6.69169L12.3668 6.43772C12.2254 6.37567 12.1128 6.26311 12.0522 6.12313L11.7983 5.54014C11.7781 5.49541 11.7146 5.49541 11.6944 5.54014L11.4404 6.12313C11.3783 6.26455 11.2658 6.37711 11.1258 6.43772L10.5414 6.69314C10.4966 6.71334 10.4966 6.77683 10.5414 6.79703L10.5399 6.79559Z" fill="#2E1055"/>
    </svg>
  );
}

/* ── Play button icon ── */
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="var(--th-tab-active)" strokeWidth="1"/>
      <path d="M6.5 5L10.5 8L6.5 11V5Z" fill="var(--th-tab-active)"/>
    </svg>
  );
}

/* ── Banner illustration for receptionist view ── */
function ReceptionistBanner() {
  return (
    <div className="mx-5 mt-5 mb-4 rounded-2xl overflow-hidden h-[170px] relative" style={{ background: "linear-gradient(135deg, #f0e4f7 0%, #d8b8ec 40%, #c89de0 70%, #b882d4 100%)" }}>
      {/* Decorative sparkles */}
      <div className="absolute top-3 right-4 opacity-30">
        <svg width="24" height="24" viewBox="0 0 20 20" fill="#2E1055"><path d="M15.86 11.31L13.52 10.29C12.95 10.04 12.5 9.59 12.25 9.02L11.23 6.68C11.15 6.49 10.89 6.49 10.81 6.68L9.79 9.02C9.54 9.59 9.09 10.04 8.53 10.29L6.18 11.31C6 11.39 6 11.65 6.18 11.73L8.57 12.78C9.13 13.03 9.58 13.49 9.83 14.06L10.82 16.36C10.89 16.54 11.15 16.54 11.23 16.36L12.25 14.02C12.5 13.45 12.95 13 13.52 12.75L15.86 11.73C16.05 11.65 16.05 11.39 15.86 11.31Z"/></svg>
      </div>
      {/* Transcript rows mock */}
      <div className="absolute inset-0 flex flex-col justify-center px-3.5 gap-1.5">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center text-[9px] shadow-sm">
          <span className="font-semibold text-[#2E1055] uppercase tracking-wider w-16">Sentiment</span>
          <span className="text-[color:var(--th-text-secondary)] flex-1">Audio</span>
          <span className="text-[color:var(--th-text-secondary)]">Actions</span>
        </div>
        {[
          { sentiment: "Neutral", color: "bg-yellow-400", time1: "00:00", time2: "00:24", width: "35%", action: "Open transcript" },
          { sentiment: "Neutral", color: "bg-yellow-400", time1: "00:01", time2: "00:25", width: "50%", action: "Close transcript" },
          { sentiment: "Good", color: "bg-green-500", time1: "00:02", time2: "00:26", width: "65%", action: "Open transcript" },
          { sentiment: "Good", color: "bg-green-500", time1: "00:03", time2: "00:27", width: "80%", action: "Open transcript" },
        ].map((row, i) => (
          <div key={i} className="bg-white/75 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1.5 text-[8px] shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${row.color} shrink-0`} />
            <span className="text-[color:var(--th-text-primary)] font-medium w-10">{row.sentiment}</span>
            <div className="flex items-center gap-1 flex-1 mx-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E1055]/10 flex items-center justify-center">
                <span className="text-[5px]">&#9654;</span>
              </div>
              <span className="text-[color:var(--th-text-muted)]">{row.time1}</span>
              <div className="flex-1 h-[3px] bg-[#2E1055]/10 rounded-full relative mx-0.5">
                <div className="absolute left-0 top-0 h-full bg-[#2E1055]/30 rounded-full" style={{ width: row.width }} />
              </div>
              <span className="text-[color:var(--th-text-muted)]">{row.time2}</span>
            </div>
            <span className="text-[#2E1055] font-medium shrink-0">{row.action}</span>
          </div>
        ))}
      </div>
      {/* AI chat bubble */}
      <div className="absolute bottom-3 right-4 bg-[#001221] text-white text-[8px] leading-[1.4] rounded-xl rounded-bl-sm px-3 py-2 max-w-[160px] shadow-xl">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#783a9b] to-[#2E1055] flex items-center justify-center">
            <svg width="7" height="7" viewBox="0 0 20 20" fill="white"><path d="M15.86 11.31L13.52 10.29C12.95 10.04 12.5 9.59 12.25 9.02L11.23 6.68C11.15 6.49 10.89 6.49 10.81 6.68L9.79 9.02C9.54 9.59 9.09 10.04 8.53 10.29L6.18 11.31C6 11.39 6 11.65 6.18 11.73L8.57 12.78C9.13 13.03 9.58 13.49 9.83 14.06L10.82 16.36C10.89 16.54 11.15 16.54 11.23 16.36L12.25 14.02C12.5 13.45 12.95 13 13.52 12.75L15.86 11.73C16.05 11.65 16.05 11.39 15.86 11.31Z"/></svg>
          </div>
          <span className="font-semibold text-[7px] opacity-70">Sangoma AI</span>
        </div>
        Welcome to Restaurant! My name is Laura, AI-reception assistant. How can I help you?
      </div>
    </div>
  );
}

/* ── Step content for expanded accordion sections (#6) ── */
function StepContent({ stepIndex }: { stepIndex: number }) {
  switch (stepIndex) {
    case 1: // Company description
      return (
        <div className="px-1 pb-5 space-y-3 animate-[fadeIn_0.2s_ease-out]">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Company name</label>
            <input type="text" defaultValue="Sangoma Technologies" className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Industry</label>
            <select className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors appearance-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }}>
              <option>Telecommunications</option>
              <option>Healthcare</option>
              <option>Restaurant & Hospitality</option>
              <option>Legal Services</option>
              <option>Real Estate</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Description</label>
            <textarea rows={3} defaultValue="We provide unified communication solutions for businesses of all sizes, including VoIP, video conferencing, and AI-powered tools." className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors resize-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
          </div>
          <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all mt-1" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
            Save and Continue
          </button>
        </div>
      );
    case 2: // Location and business hours
      return (
        <div className="px-1 pb-5 space-y-3 animate-[fadeIn_0.2s_ease-out]">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Address</label>
            <input type="text" defaultValue="100 Renfrew Dr, Suite 100, Markham, ON" className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Timezone</label>
            <select className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors appearance-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }}>
              <option>Eastern Time (ET)</option>
              <option>Pacific Time (PT)</option>
              <option>Central Time (CT)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--th-text-secondary)" }}>Business hours</label>
            {["Monday - Friday", "Saturday", "Sunday"].map((day, i) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-[12px] w-28" style={{ color: "var(--th-text-primary)" }}>{day}</span>
                <input type="text" defaultValue={i === 0 ? "9:00 AM - 5:00 PM" : i === 1 ? "10:00 AM - 2:00 PM" : "Closed"} className="flex-1 px-2.5 py-1.5 text-[12px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
              </div>
            ))}
          </div>
          <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all mt-1" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
            Save and Continue
          </button>
        </div>
      );
    case 3: // Transfer by name
      return (
        <div className="px-1 pb-5 space-y-3 animate-[fadeIn_0.2s_ease-out]">
          <p className="text-[12px]" style={{ color: "var(--th-text-secondary)" }}>Allow callers to be transferred to a team member by name.</p>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>Enable transfer by name</span>
            <div className="w-10 h-6 rounded-full relative cursor-pointer" style={{ backgroundColor: "var(--th-tab-active)" }}>
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Directory source</label>
            <select className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors appearance-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }}>
              <option>All extensions</option>
              <option>Sales team only</option>
              <option>Support team only</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Max transfer attempts</label>
            <input type="number" defaultValue={3} className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
          </div>
          <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all mt-1" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
            Save and Continue
          </button>
        </div>
      );
    case 4: // Greeting
      return (
        <div className="px-1 pb-5 space-y-3 animate-[fadeIn_0.2s_ease-out]">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Greeting message</label>
            <textarea rows={3} defaultValue="Thank you for calling Sangoma Technologies! How may I direct your call today?" className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors resize-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>After-hours message</label>
            <textarea rows={3} defaultValue="We are currently closed. Our business hours are Monday to Friday, 9 AM to 5 PM. Please leave a message and we will return your call." className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors resize-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>Play hold music</span>
            <div className="w-10 h-6 rounded-full relative cursor-pointer" style={{ backgroundColor: "var(--th-tab-active)" }}>
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
            </div>
          </div>
          <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all mt-1" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
            Save and Finish
          </button>
        </div>
      );
    default:
      return null;
  }
}

/* ── Contextual AI features per page ── */
const contextualFeatures: Record<string, { label: string; icon: React.ReactNode }[]> = {
  "/chats": [
    { label: "Smart reply", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { label: "Summarize conversation", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: "Translate message", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg> },
  ],
  "/talk": [
    { label: "Transcribe call", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg> },
    { label: "Call summary", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
    { label: "Voicemail to text", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="5.5" cy="11.5" r="3.5"/><circle cx="18.5" cy="11.5" r="3.5"/><line x1="9" y1="11.5" x2="15" y2="11.5"/></svg> },
  ],
  "/operator": [
    { label: "Smart call routing", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg> },
    { label: "Agent coaching tips", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg> },
    { label: "Call sentiment analysis", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  ],
  "/meet": [
    { label: "Generate meeting notes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: "Extract action items", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { label: "AI virtual background", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> },
  ],
  "/sms": [
    { label: "Smart reply", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { label: "Auto-translate message", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg> },
  ],
  "/calendar": [
    { label: "Meeting prep brief", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: "Find best time", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: "Detect conflicts", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ],
  "/files": [
    { label: "Smart search", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { label: "Summarize document", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: "Auto-categorize files", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
  ],
  "/contact-center": [
    { label: "Sentiment analysis", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
    { label: "Queue optimization", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg> },
    { label: "Predict call volume", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: "Agent performance report", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  ],
  "/fax": [
    { label: "Summarize fax content", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: "Extract key information", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { label: "Draft cover page", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  ],
};

/* ── Main AI Assist Panel (inline, white bg, with micro-interactions) ── */
export default function AIAssistPanel({
  isOpen,
  onClose,
  currentPage,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
}) {
  const [view, setView] = useState<PanelView>("main");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>("Stacy");
  const [animating, setAnimating] = useState(false);

  // Reset view when panel opens with animation
  useEffect(() => {
    if (isOpen) {
      setView("main");
      setExpandedStep(null);
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActionClick = (action: string) => {
    if (action === "Add your AI receptionist") {
      setView("receptionist");
    } else if (action === "Catch up on meeting") {
      setView("meeting");
    } else if (action === "Help me write a text message") {
      setView("sms");
    } else if (action === "Help to find recordings") {
      setView("recording");
    } else if (action === "Create auto-response") {
      setView("autoresponse");
    } else if (action === "Smart reply") {
      setView("smart-reply");
    } else if (action === "Summarize conversation" || action === "Summarize document") {
      setView("summarize");
    } else if (action === "Transcribe call" || action === "Voicemail to text") {
      setView("transcribe");
    } else if (action === "Generate meeting notes" || action === "Extract action items" || action === "Meeting prep brief") {
      setView("meeting-notes");
    } else if (action === "Sentiment analysis" || action === "Call sentiment analysis") {
      setView("sentiment");
    } else if (action === "Smart search") {
      setView("smart-search");
    }
  };

  const handleStepToggle = (index: number) => {
    if (index === 0) {
      if (expandedStep === 0) {
        setExpandedStep(null);
      } else {
        setExpandedStep(0);
        setView("tone");
      }
    } else {
      setExpandedStep(expandedStep === index ? null : index);
    }
  };

  const handleBack = () => {
    if (view === "tone") {
      setView("receptionist");
      setExpandedStep(null);
    } else {
      setView("main");
    }
  };

  const viewTitles: Record<PanelView, string> = {
    main: "AI assist",
    receptionist: "AI receptionist",
    tone: "AI receptionist",
    meeting: "Meeting catch-up",
    sms: "Write a message",
    recording: "Find recordings",
    autoresponse: "Auto-response",
    "smart-reply": "Smart reply",
    summarize: "Summarize",
    transcribe: "Transcribe",
    "meeting-notes": "Meeting notes",
    sentiment: "Sentiment analysis",
    "smart-search": "Smart search",
  };

  return (
    <div className={`w-[390px] shrink-0 flex flex-col overflow-hidden ${animating ? "animate-[slideInRight_0.3s_ease-out]" : ""}`} style={{ backgroundColor: "var(--th-bg-card)", borderLeft: "1px solid var(--th-border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 shrink-0">
        <div className="flex items-center gap-2">
          {view !== "main" && (
            <button
              onClick={handleBack}
              className="p-1 -ml-1 rounded-lg transition-all duration-150 active:scale-90"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <span className="text-[15px] font-semibold" style={{ color: "var(--th-text-primary)" }}>
            {viewTitles[view]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-all duration-150 active:scale-90"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 4.5L4.5 13.5" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4.5 4.5L13.5 13.5" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Content with view transitions */}
      <div className="flex-1 overflow-y-auto">
        <div key={view} className="animate-[fadeIn_0.2s_ease-out]">
          {view === "main" && (
            <MainView onActionClick={handleActionClick} currentPage={currentPage} />
          )}
          {view === "receptionist" && (
            <ReceptionistView
              expandedStep={expandedStep}
              onStepToggle={handleStepToggle}
            />
          )}
          {view === "tone" && (
            <ToneView
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
              expandedStep={expandedStep}
              onStepToggle={handleStepToggle}
              onSave={() => {
                setView("receptionist");
                setExpandedStep(null);
              }}
            />
          )}
          {view === "meeting" && <MeetingView />}
          {view === "sms" && <SMSView />}
          {view === "recording" && <RecordingView />}
          {view === "autoresponse" && <AutoResponseView />}
          {view === "smart-reply" && <SmartReplyView />}
          {view === "summarize" && <SummarizeView />}
          {view === "transcribe" && <TranscribeView />}
          {view === "meeting-notes" && <MeetingNotesView />}
          {view === "sentiment" && <SentimentView />}
          {view === "smart-search" && <SmartSearchView />}
        </div>
      </div>
    </div>
  );
}

/* ── Main View ── */
function MainView({ onActionClick, currentPage }: { onActionClick: (a: string) => void; currentPage?: string }) {
  const pageFeatures = currentPage ? contextualFeatures[currentPage] || [] : [];
  const pageName = currentPage === "/" ? "" : (currentPage?.replace("/", "") ?? "");
  const pageLabels: Record<string, string> = { "": "Home", chats: "Chats", talk: "Talk", operator: "Operator console", meet: "Meet", sms: "SMS", fax: "Fax", calendar: "Calendar", files: "Files", "contact-center": "Contact center" };
  const pageMeta: Record<string, { bg: string; icon: React.ReactNode; title: string; subtitle: string }> = {
    chats: { bg: "rgba(44,173,67,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a7a2b"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>, title: "Smarter conversations", subtitle: "AI helps you reply faster, summarize chats, and break language barriers." },
    talk: { bg: "rgba(29,62,119,0.12)", icon: <svg width="18" height="18" viewBox="0 0 28 28" fill="#1D3E77"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>, title: "Let\u2019s make calls easier", subtitle: "Transcribe calls, get instant summaries, and convert voicemails to text." },
    operator: { bg: "rgba(124,58,237,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#7C3AED"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>, title: "Supercharge your console", subtitle: "Smart routing, coaching tips, and real-time sentiment for every call." },
    meet: { bg: "rgba(156,50,140,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#7C2870"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>, title: "Never miss a detail", subtitle: "Generate notes, extract action items, and prep for meetings instantly." },
    sms: { bg: "rgba(44,173,67,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a7a2b"><path d="M11.99 3C8.65 3 5.75 4.12 3.83 6.15C1.58 8.54 1 11.5 2.11 14.98C2.68 16.76 3.81 19.26 5.96 21.08C6.13 21.22 6.33 21.29 6.54 21.29C6.76 21.29 6.98 21.21 7.15 21.06C7.64 20.62 8.11 19.98 8.6 19.13C9.76 19.38 10.88 19.5 12 19.5C17.97 19.5 22.47 15.91 22.47 11.14C22.47 6.5 17.97 3 11.99 3Z"/></svg>, title: "Text smarter", subtitle: "AI drafts replies and translates messages on the fly." },
    fax: { bg: "rgba(99,102,241,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#4F46E5"><path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm3-6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>, title: "Smarter faxing", subtitle: "Summarize incoming faxes, extract key data, and draft cover pages instantly." },
    calendar: { bg: "rgba(245,158,11,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#D97706"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>, title: "Plan ahead effortlessly", subtitle: "Prep for meetings, find the best times, and spot conflicts before they happen." },
    files: { bg: "rgba(59,130,246,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563EB"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 14H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>, title: "Find anything instantly", subtitle: "Search with natural language, summarize docs, and auto-organize files." },
    "contact-center": { bg: "rgba(239,68,68,0.12)", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>, title: "Insights at a glance", subtitle: "Sentiment analysis, queue optimization, and predictive call volume." },
  };
  const meta = pageMeta[pageName];

  return (
    <div className="px-5 pt-10 pb-8">
      {/* Contextual or sparkle icon */}
      <div className="mb-6 animate-[fadeIn_0.3s_ease-out]">
        {meta ? (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: meta.bg }}>
            {meta.icon}
          </div>
        ) : (
          <SparkleIcon />
        )}
      </div>

      {/* Heading — uses tab title if available */}
      <h2 className="text-[22px] font-bold leading-[1.3] mb-3 animate-[fadeIn_0.35s_ease-out]" style={{ color: "var(--th-text-primary)" }}>
        {meta ? meta.title : <>Use Your Sangoma AI<br />Assistant to Make Your<br />Job Easier</>}
      </h2>

      {/* Subtitle */}
      <p className="text-[14px] leading-[1.5] mb-8 animate-[fadeIn_0.4s_ease-out]" style={{ color: "var(--th-text-secondary)" }}>
        {meta ? meta.subtitle : "Power up your productivity with AI features in the app you use every day."}
      </p>

      {/* Contextual AI features — same button style as Home */}
      {pageFeatures.length > 0 && (
        <div className="mb-8 animate-[fadeIn_0.45s_ease-out]">
          <div className="flex flex-col gap-3">
            {pageFeatures.map((feature, i) => (
              <button
                key={feature.label}
                onClick={() => onActionClick(feature.label)}
                className="w-full py-3.5 px-5 rounded-xl border text-[14px] font-medium text-left flex items-center gap-3 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.98] active:shadow-none transition-all duration-150"
                style={{ backgroundColor: "var(--th-bg-card)", borderColor: "var(--th-border)", color: "var(--th-text-primary)", animation: `fadeIn 0.3s ease-out ${0.05 * i}s both` }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--th-text-muted)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--th-border)"}
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                  {feature.icon}
                </span>
                {feature.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* More section */}
      <div className="mb-3">
        <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--th-text-muted)" }}>More</span>
      </div>
      {pageName === "" ? (
        /* Home — full button cards */
        <div className="flex flex-col gap-3">
          {actionButtons.map((action, i) => (
            <button
              key={action.label}
              onClick={() => onActionClick(action.label)}
              className="w-full py-3.5 px-5 rounded-xl border text-[14px] font-medium text-left flex items-center gap-3 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.98] active:shadow-none transition-all duration-150"
              style={{ backgroundColor: "var(--th-bg-card)", borderColor: "var(--th-border)", color: "var(--th-text-primary)", animation: `fadeIn 0.3s ease-out ${0.05 * i}s both` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--th-text-muted)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--th-border)"}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                <ActionIcon type={action.icon} />
              </span>
              {action.label}
            </button>
          ))}
        </div>
      ) : (
        /* Other pages — links with right arrow + hover underline */
        <div className="flex flex-col gap-0.5">
          {actionButtons.map((action, i) => (
            <button
              key={action.label}
              onClick={() => onActionClick(action.label)}
              className="text-left py-2.5 text-[13px] font-medium flex items-center gap-1 group transition-colors"
              style={{ color: "var(--th-tab-active)", animation: `fadeIn 0.2s ease-out ${0.04 * i}s both` }}
            >
              <span className="group-hover:underline">{action.label}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Receptionist View ── */
function ReceptionistView({
  expandedStep,
  onStepToggle,
}: {
  expandedStep: number | null;
  onStepToggle: (i: number) => void;
}) {
  return (
    <div className="pb-8">
      <ReceptionistBanner />

      <div className="px-5">
        <h2 className="text-[22px] font-bold leading-[1.3] mb-2" style={{ color: "var(--th-text-primary)" }}>
          Create your AI<br />receptionist
        </h2>
        <p className="text-[13px] leading-[1.5] mb-6" style={{ color: "var(--th-text-secondary)" }}>
          Customize your receptionist and equip them with the skills they need to assist your business in 5 easy steps.
        </p>

        {/* Steps accordion */}
        <div className="flex flex-col">
          {receptionistSteps.map((step, i) => (
            <div key={i} style={{ borderBottom: "1px solid var(--th-border)" }}>
              <button
                onClick={() => onStepToggle(i)}
                className="w-full flex items-center justify-between py-4 px-1 text-left rounded-lg transition-all duration-150 active:scale-[0.99]"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span className="text-[14px] font-medium" style={{ color: "var(--th-text-primary)" }}>
                  {i + 1}. {step}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`transition-transform duration-300 ${expandedStep === i ? "rotate-180" : ""}`}
                >
                  {expandedStep === i ? (
                    <path d="M4 10H16" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                  ) : (
                    <>
                      <path d="M10 4V16" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M4 10H16" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                    </>
                  )}
                </svg>
              </button>
              {/* Expanded content for non-tone steps */}
              {expandedStep === i && i !== 0 && (
                <StepContent stepIndex={i} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tone & Personality View ── */
function ToneView({
  selectedPersona,
  onSelectPersona,
  expandedStep,
  onStepToggle,
  onSave,
}: {
  selectedPersona: string;
  onSelectPersona: (name: string) => void;
  expandedStep: number | null;
  onStepToggle: (i: number) => void;
  onSave: () => void;
}) {
  return (
    <div className="pb-8">
      <ReceptionistBanner />

      <div className="px-5">
        <h2 className="text-[22px] font-bold leading-[1.3] mb-2" style={{ color: "var(--th-text-primary)" }}>
          Create your AI<br />receptionist
        </h2>
        <p className="text-[13px] leading-[1.5] mb-6" style={{ color: "var(--th-text-secondary)" }}>
          Customize your receptionist and equip them with the skills they need to assist your business in 5 easy steps.
        </p>

        {/* Step 1: Tone and personality – expanded with personas */}
        <div style={{ borderBottom: "1px solid var(--th-border)" }}>
          <button
            onClick={() => onStepToggle(0)}
            className="w-full flex items-center justify-between py-4 px-1 text-left"
          >
            <span className="text-[14px] font-medium" style={{ color: "var(--th-text-primary)" }}>
              1. Tone and personality
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Persona grid with real faces */}
          <div className="grid grid-cols-4 gap-3 px-1 pt-2 pb-5">
            {personas.map((persona, i) => {
              const isSelected = selectedPersona === persona.name;
              return (
                <button
                  key={persona.name}
                  onClick={() => onSelectPersona(persona.name)}
                  className="flex flex-col items-center gap-1.5 group"
                  style={{ animation: `fadeIn 0.25s ease-out ${0.04 * i}s both` }}
                >
                  <div
                    className={`w-16 h-16 rounded-full overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? "scale-105"
                        : "hover:ring-2 hover:ring-offset-1 hover:scale-105"
                    }`}
                    style={isSelected ? { boxShadow: "0 0 0 2px var(--th-bg-card), 0 0 0 4px var(--th-tab-active)" } : {}}
                  >
                    <Image
                      src={persona.img}
                      alt={persona.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-[12px] font-medium transition-colors" style={{ color: isSelected ? "var(--th-text-primary)" : "var(--th-text-secondary)" }}>
                    {persona.name}
                  </span>
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity active:scale-90">
                    <PlayIcon />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Save and Continue button */}
          <div className="px-1 pb-5">
            <button
              onClick={onSave}
              className="w-full py-3.5 text-[13px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] active:shadow-none transition-all duration-200"
              style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}
            >
              Save and Continue
            </button>
          </div>
        </div>

        {/* Remaining steps (collapsed) */}
        {receptionistSteps.slice(1).map((step, i) => (
          <div key={i + 1} style={{ borderBottom: "1px solid var(--th-border)" }}>
            <button
              onClick={() => onStepToggle(i + 1)}
              className="w-full flex items-center justify-between py-4 px-1 text-left rounded-lg transition-all duration-150 active:scale-[0.99]"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span className="text-[14px] font-medium" style={{ color: "var(--th-text-primary)" }}>
                {i + 2}. {step}
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 10H16" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Meeting Catch-up View ── */
function MeetingView() {
  const [selectedMeeting, setSelectedMeeting] = useState(0);

  const meetings = [
    { title: "Product Roadmap Review", date: "Today, 10:00 AM", duration: "45 min", attendees: ["Sarah Chen", "Mike Ross", "Laura Kim", "David Park"] },
    { title: "Sprint Planning — Q2", date: "Yesterday, 2:30 PM", duration: "60 min", attendees: ["Tom Blake", "Ava Singh", "Chris Lee"] },
    { title: "Design Sync", date: "Mar 1, 9:00 AM", duration: "30 min", attendees: ["Laura Kim", "Ava Singh"] },
  ];

  const summaries = [
    {
      keyTopics: ["Launch timeline moved to April 15", "New AI features prioritized for v3.2", "Mobile app redesign approved"],
      actionItems: [
        { task: "Prepare updated project timeline", assignee: "Sarah Chen", due: "Mar 5" },
        { task: "Draft AI feature specifications", assignee: "Mike Ross", due: "Mar 7" },
        { task: "Share mobile mockups with dev team", assignee: "Laura Kim", due: "Mar 4" },
      ],
      decisions: "Team agreed to postpone the analytics dashboard to Q3 to focus on core AI features.",
    },
    {
      keyTopics: ["Backlog grooming completed", "14 story points allocated", "Testing automation plan reviewed"],
      actionItems: [
        { task: "Create Jira tickets for sprint items", assignee: "Tom Blake", due: "Mar 3" },
        { task: "Set up CI/CD pipeline for staging", assignee: "Chris Lee", due: "Mar 6" },
      ],
      decisions: "Sprint duration extended to 3 weeks for the transition period.",
    },
    {
      keyTopics: ["Component library v2 updates", "Dark mode implementation", "Accessibility audit results"],
      actionItems: [
        { task: "Update Button component variants", assignee: "Laura Kim", due: "Mar 5" },
        { task: "Fix contrast issues from audit", assignee: "Ava Singh", due: "Mar 6" },
      ],
      decisions: "Dark mode will ship as an experimental feature first.",
    },
  ];

  const meeting = meetings[selectedMeeting];
  const summary = summaries[selectedMeeting];

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Meeting selector */}
      <div className="mb-5">
        <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--th-text-secondary)" }}>Select a recent meeting</label>
        <div className="flex flex-col gap-2">
          {meetings.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedMeeting(i)}
              className="w-full px-4 py-3 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] shadow-sm"
              style={{
                borderColor: selectedMeeting === i ? "var(--th-tab-active)" : "var(--th-border)",
                backgroundColor: selectedMeeting === i ? "var(--th-bg-hover)" : "var(--th-bg-card)",
                animation: `fadeIn 0.25s ease-out ${0.05 * i}s both`,
              }}
              onMouseEnter={(e) => { if (selectedMeeting !== i) e.currentTarget.style.borderColor = "var(--th-text-muted)"; }}
              onMouseLeave={(e) => { if (selectedMeeting !== i) e.currentTarget.style.borderColor = "var(--th-border)"; }}
            >
              <div className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{m.title}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{m.date} · {m.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Summary */}
      <div className="animate-[fadeIn_0.25s_ease-out]" key={selectedMeeting}>
        {/* Attendees */}
        <div className="mb-4">
          <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Attendees</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {meeting.attendees.map((a) => (
              <span key={a} className="px-2.5 py-1 text-[11px] font-medium rounded-full" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-tab-active)" }}>{a}</span>
            ))}
          </div>
        </div>

        {/* Key Topics */}
        <div className="mb-4">
          <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Key Topics</span>
          <ul className="mt-1.5 space-y-1.5">
            {summary.keyTopics.map((topic, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--th-text-primary)" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]" style={{ backgroundColor: "var(--th-tab-active)" }} />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div className="mb-4">
          <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Action Items</span>
          <div className="mt-1.5 space-y-2">
            {summary.actionItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                <div className="w-4 h-4 rounded border-2 shrink-0 mt-0.5" style={{ borderColor: "var(--th-border)" }} />
                <div className="flex-1">
                  <div className="text-[12px] font-medium" style={{ color: "var(--th-text-primary)" }}>{item.task}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{item.assignee} · Due {item.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Decisions */}
        <div className="mb-5">
          <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Key Decision</span>
          <div className="mt-1.5 px-3 py-2.5 rounded-lg text-[12px] leading-relaxed" style={{ backgroundColor: "var(--th-bg-hover)", border: "1px solid var(--th-border)", color: "var(--th-text-primary)" }}>
            {summary.decisions}
          </div>
        </div>

        <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
          Share Summary
        </button>
      </div>
    </div>
  );
}

/* ── SMS / Text Message View ── */
function SMSView() {
  const [tone, setTone] = useState("Professional");
  const tones = ["Professional", "Casual", "Friendly", "Urgent"];

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>
        Tell us who you&apos;re writing to and what you want to say. AI will draft a polished message for you.
      </p>

      {/* Recipient */}
      <div className="mb-4">
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Recipient</label>
        <input type="text" defaultValue="Sarah Chen" className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} placeholder="Enter name or number" />
      </div>

      {/* Tone selector */}
      <div className="mb-4">
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Tone</label>
        <div className="flex gap-2 flex-wrap">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-150 active:scale-95"
              style={
                tone === t
                  ? { backgroundColor: "var(--th-tab-active)", color: "white", borderColor: "var(--th-tab-active)" }
                  : { backgroundColor: "var(--th-bg-card)", color: "var(--th-text-secondary)", borderColor: "var(--th-border)" }
              }
              onMouseEnter={(e) => { if (tone !== t) e.currentTarget.style.borderColor = "var(--th-text-muted)"; }}
              onMouseLeave={(e) => { if (tone !== t) e.currentTarget.style.borderColor = "var(--th-border)"; }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Topic / purpose */}
      <div className="mb-4">
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>What do you want to say?</label>
        <textarea rows={3} defaultValue="Remind about tomorrow's meeting at 2 PM and ask to bring the Q2 report" className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors resize-none" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} placeholder="Describe your message purpose..." />
      </div>

      {/* Generated message preview */}
      <div className="mb-5">
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>AI-generated draft</label>
        <div className="px-4 py-3.5 border rounded-xl" style={{ backgroundColor: "var(--th-bg-hover)", borderColor: "var(--th-border)" }}>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--th-text-primary)" }}>
            Hi Sarah, just a quick reminder about our meeting tomorrow at 2:00 PM. Could you please bring the Q2 report along? Looking forward to catching up. Thanks!
          </p>
          <div className="flex items-center gap-1.5 mt-3 pt-2.5" style={{ borderTop: "1px solid var(--th-border)" }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--th-text-muted)" }}>Tone: {tone}</span>
            <span className="text-[10px]" style={{ color: "var(--th-text-muted)" }}>·</span>
            <span className="text-[10px]" style={{ color: "var(--th-text-muted)" }}>142 characters</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          className="flex-1 py-3 text-[12px] font-bold tracking-wider uppercase rounded-full border active:scale-[0.98] transition-all"
          style={{ backgroundColor: "var(--th-bg-card)", color: "var(--th-text-primary)", borderColor: "var(--th-border)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-card)"}
        >
          Regenerate
        </button>
        <button className="flex-1 py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
          Copy & Send
        </button>
      </div>
    </div>
  );
}

/* ── Recording Finder View ── */
function RecordingView() {
  const recordings = [
    { caller: "John Smith", number: "+1 (416) 555-0123", date: "Today, 11:32 AM", duration: "4:23", sentiment: "Good", sentColor: "bg-green-500" },
    { caller: "Maria Garcia", number: "+1 (905) 555-0456", date: "Today, 9:15 AM", duration: "12:07", sentiment: "Neutral", sentColor: "bg-yellow-400" },
    { caller: "David Park", number: "+1 (647) 555-0789", date: "Yesterday, 3:48 PM", duration: "7:45", sentiment: "Good", sentColor: "bg-green-500" },
    { caller: "Lisa Thompson", number: "+1 (416) 555-0321", date: "Yesterday, 1:22 PM", duration: "2:15", sentiment: "Poor", sentColor: "bg-red-400" },
    { caller: "Robert Chen", number: "+1 (905) 555-0654", date: "Mar 1, 4:50 PM", duration: "18:30", sentiment: "Good", sentColor: "bg-green-500" },
  ];

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>
        Search and filter your call recordings by caller, date, or keyword.
      </p>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2">
            <circle cx="7" cy="7" r="5" stroke="var(--th-text-muted)" strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search by name, number, or keyword..." className="w-full pl-9 pr-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
        </div>
      </div>

      {/* Date filter */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1">
          <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--th-text-secondary)" }}>From</label>
          <input type="date" defaultValue="2026-03-01" className="w-full px-2.5 py-2 text-[12px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--th-text-secondary)" }}>To</label>
          <input type="date" defaultValue="2026-03-03" className="w-full px-2.5 py-2 text-[12px] border rounded-lg focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
        </div>
      </div>

      {/* Results count */}
      <div className="text-[12px] mb-3" style={{ color: "var(--th-text-muted)" }}>{recordings.length} recordings found</div>

      {/* Recording results */}
      <div className="flex flex-col gap-2">
        {recordings.map((rec, i) => (
          <div
            key={i}
            className="px-4 py-3 border rounded-xl hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99]"
            style={{ borderColor: "var(--th-border)", animation: `fadeIn 0.25s ease-out ${0.04 * i}s both` }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--th-text-muted)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--th-border)"}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{rec.caller}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${rec.sentColor}`} />
                <span className="text-[10px]" style={{ color: "var(--th-text-muted)" }}>{rec.sentiment}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>{rec.number}</span>
              <span className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>{rec.duration}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>{rec.date}</span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 rounded transition-colors active:scale-90"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 3v10l8-5-8-5z" stroke="var(--th-tab-active)" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="p-1 rounded transition-colors active:scale-90"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 14V3h10v11l-5-3-5 3z" stroke="var(--th-tab-active)" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Auto-Response View ── */
function AutoResponseView() {
  const [enabled, setEnabled] = useState(true);
  const [activeRule, setActiveRule] = useState(0);

  const rules = [
    { name: "After hours", trigger: "Calls received outside business hours", status: true },
    { name: "Busy / On call", trigger: "When status is set to Busy or On a Call", status: true },
    { name: "Holiday", trigger: "During configured holiday dates", status: false },
  ];

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>
        Set up automatic responses for missed calls, voicemails, and text messages based on your availability.
      </p>

      {/* Master toggle */}
      <div className="flex items-center justify-between py-3 px-4 rounded-xl mb-5" style={{ backgroundColor: "var(--th-bg-hover)" }}>
        <div>
          <span className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Auto-response</span>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{enabled ? "Active — responding automatically" : "Disabled"}</p>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          style={enabled ? { backgroundColor: "var(--th-tab-active)" } : undefined}
          className={`w-11 h-6.5 rounded-full relative transition-colors duration-200 ${enabled ? "" : "bg-[#CCCFD2]"}`}
        >
          <div className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200 ${enabled ? "right-[3px]" : "left-[3px]"}`} />
        </button>
      </div>

      {/* Response rules */}
      <div className="mb-5">
        <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--th-text-secondary)" }}>Response rules</label>
        <div className="flex flex-col gap-2">
          {rules.map((rule, i) => (
            <button
              key={i}
              onClick={() => setActiveRule(i)}
              className="w-full px-4 py-3 rounded-xl border text-left transition-all duration-150 active:scale-[0.98]"
              style={{
                borderColor: activeRule === i ? "var(--th-tab-active)" : "var(--th-border)",
                backgroundColor: activeRule === i ? "var(--th-bg-hover)" : "var(--th-bg-card)",
                animation: `fadeIn 0.25s ease-out ${0.05 * i}s both`,
              }}
              onMouseEnter={(e) => { if (activeRule !== i) e.currentTarget.style.borderColor = "var(--th-text-muted)"; }}
              onMouseLeave={(e) => { if (activeRule !== i) e.currentTarget.style.borderColor = "var(--th-border)"; }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{rule.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rule.status ? "bg-[#E8F5E9] text-[#2CAD43]" : ""}`} style={!rule.status ? { backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-muted)" } : {}}>
                  {rule.status ? "Active" : "Inactive"}
                </span>
              </div>
              <span className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>{rule.trigger}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response template for selected rule */}
      <div className="mb-4 animate-[fadeIn_0.2s_ease-out]" key={activeRule}>
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>
          Response message — {rules[activeRule].name}
        </label>
        <textarea
          rows={4}
          defaultValue={
            activeRule === 0
              ? "Thank you for your call. Our office is currently closed. Business hours are Mon–Fri, 9 AM to 5 PM EST. We'll return your call on the next business day."
              : activeRule === 1
                ? "I'm currently on another call. I'll get back to you as soon as I'm available. If this is urgent, please press 1 to be transferred to the front desk."
                : "Our office is closed for the holiday. We will reopen on January 2nd. For emergencies, please contact our on-call team at (416) 555-0199."
          }
          className="w-full px-3 py-2.5 text-[13px] border rounded-lg focus:outline-none transition-colors resize-none"
          style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }}
        />
      </div>

      {/* Response channels */}
      <div className="mb-5">
        <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--th-text-secondary)" }}>Respond via</label>
        <div className="flex flex-col gap-2">
          {[
            { label: "SMS", desc: "Send text message reply", checked: true },
            { label: "Voicemail greeting", desc: "Play custom voicemail", checked: true },
            { label: "Email notification", desc: "Send email to caller (if known)", checked: false },
          ].map((ch) => (
            <label key={ch.label} className="flex items-center gap-3 px-3 py-2.5 border rounded-lg cursor-pointer transition-colors" style={{ borderColor: "var(--th-border)" }}>
              <input type="checkbox" defaultChecked={ch.checked} className="w-4 h-4 rounded" style={{ accentColor: "var(--th-tab-active)" }} />
              <div>
                <div className="text-[12px] font-medium" style={{ color: "var(--th-text-primary)" }}>{ch.label}</div>
                <div className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>{ch.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>
        Save Auto-Response Rules
      </button>
    </div>
  );
}

/* ── Smart Reply View (Chats) ── */
function SmartReplyView() {
  const [tone, setTone] = useState("Professional");
  const tones = ["Professional", "Casual", "Friendly"];
  const draft = tone === "Professional"
    ? "Thank you for the update. I'll review the document and share my feedback by end of day tomorrow."
    : tone === "Casual"
      ? "Got it, thanks! I'll take a look and get back to you tomorrow."
      : "Hey, thanks for sharing! I'll check it out and let you know what I think. Have a great evening!";

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>AI generates a context-aware reply based on the conversation.</p>
      <div className="mb-4">
        <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--th-text-secondary)" }}>Conversation context</label>
        <div className="px-4 py-3 rounded-xl text-[13px]" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
          <span className="font-semibold">Jim Dowell:</span> Hi Jim! Got time to discuss the doc?
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--th-text-secondary)" }}>Tone</label>
        <div className="flex gap-2">
          {tones.map((t) => (
            <button key={t} onClick={() => setTone(t)} className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all active:scale-95" style={tone === t ? { backgroundColor: "var(--th-tab-active)", color: "white", borderColor: "var(--th-tab-active)" } : { backgroundColor: "var(--th-bg-card)", color: "var(--th-text-secondary)", borderColor: "var(--th-border)" }}>{t}</button>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--th-text-secondary)" }}>Suggested reply</label>
        <div className="px-4 py-3.5 border rounded-xl" style={{ backgroundColor: "var(--th-bg-hover)", borderColor: "var(--th-border)" }}>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--th-text-primary)" }}>{draft}</p>
        </div>
      </div>
      <div className="flex gap-2.5">
        <button className="flex-1 py-3 text-[12px] font-bold tracking-wider uppercase rounded-full border active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-bg-card)", color: "var(--th-text-primary)", borderColor: "var(--th-border)" }}>Regenerate</button>
        <button className="flex-1 py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>Insert Reply</button>
      </div>
    </div>
  );
}

/* ── Summarize View (Chats/Meet/Files) ── */
function SummarizeView() {
  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>AI-generated summary of the current conversation or document.</p>
      <div className="mb-4">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Summary</span>
        <div className="mt-1.5 space-y-2">
          {["Team discussed Q2 launch timeline — moved to April 15", "AI features prioritized for v3.2 release", "Mobile app redesign approved by stakeholders", "Analytics dashboard postponed to Q3"].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--th-text-primary)", animation: `fadeIn 0.25s ease-out ${0.1 * i}s both` }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]" style={{ backgroundColor: "var(--th-tab-active)" }} />{item}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Key Takeaway</span>
        <div className="mt-1.5 px-3 py-2.5 rounded-lg text-[12px] leading-relaxed" style={{ backgroundColor: "var(--th-bg-hover)", border: "1px solid var(--th-border)", color: "var(--th-text-primary)" }}>Focus shifted to core AI features; analytics dashboard deferred to maintain velocity.</div>
      </div>
      <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>Copy Summary</button>
    </div>
  );
}

/* ── Transcribe View (Talk) ── */
function TranscribeView() {
  const transcript = [
    { time: "00:00", speaker: "You", text: "Hi Sarah, thanks for calling back." },
    { time: "00:05", speaker: "Sarah Chen", text: "No problem! I wanted to follow up on the proposal." },
    { time: "00:12", speaker: "You", text: "Sure, we reviewed it internally. A few questions on pricing." },
    { time: "00:20", speaker: "Sarah Chen", text: "Of course, happy to walk through each line item." },
    { time: "00:35", speaker: "You", text: "The enterprise tier — is there flexibility on the per-seat cost?" },
    { time: "00:42", speaker: "Sarah Chen", text: "For annual commitments over 50 seats, we can offer 15% off." },
  ];
  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>AI-generated transcript from the most recent call.</p>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Call with Sarah Chen</span>
          <span className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>Today, 11:32 AM · 4:23</span>
        </div>
        <div className="space-y-3">
          {transcript.map((line, i) => (
            <div key={i} className="flex gap-2" style={{ animation: `fadeIn 0.2s ease-out ${0.08 * i}s both` }}>
              <span className="text-[10px] font-mono shrink-0 mt-0.5 w-8" style={{ color: "var(--th-text-muted)" }}>{line.time}</span>
              <div>
                <span className="text-[11px] font-semibold" style={{ color: line.speaker === "You" ? "var(--th-tab-active)" : "var(--th-text-primary)" }}>{line.speaker}</span>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--th-text-primary)" }}>{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2.5">
        <button className="flex-1 py-3 text-[12px] font-bold tracking-wider uppercase rounded-full border active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-bg-card)", color: "var(--th-text-primary)", borderColor: "var(--th-border)" }}>Export</button>
        <button className="flex-1 py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>Share</button>
      </div>
    </div>
  );
}

/* ── Meeting Notes View (Meet/Calendar) ── */
function MeetingNotesView() {
  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>AI-generated notes from your recent meeting.</p>
      <div className="mb-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--th-bg-hover)" }}>
        <div className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Weekly Design Team Meeting</div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>Today, 10:00 AM · 45 min · 4 attendees</div>
      </div>
      <div className="mb-4">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Notes</span>
        <ul className="mt-1.5 space-y-1.5">
          {["Reviewed component library v2 progress", "Dark mode implementation on track for next sprint", "Accessibility audit: 3 critical issues to fix", "New icon set approved — will replace current by April 20"].map((n, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--th-text-primary)" }}><span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]" style={{ backgroundColor: "var(--th-tab-active)" }} />{n}</li>
          ))}
        </ul>
      </div>
      <div className="mb-5">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Action Items</span>
        <div className="mt-1.5 space-y-2">
          {[{ task: "Fix contrast issues from audit", who: "Laura Kim", due: "Apr 10" }, { task: "Update Button component variants", who: "Ava Singh", due: "Apr 12" }, { task: "Share icon set with dev team", who: "David Park", due: "Apr 8" }].map((a, i) => (
            <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--th-bg-hover)" }}>
              <div className="w-4 h-4 rounded border-2 shrink-0 mt-0.5" style={{ borderColor: "var(--th-border)" }} />
              <div className="flex-1"><div className="text-[12px] font-medium" style={{ color: "var(--th-text-primary)" }}>{a.task}</div><div className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{a.who} · Due {a.due}</div></div>
            </div>
          ))}
        </div>
      </div>
      <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>Share Notes</button>
    </div>
  );
}

/* ── Sentiment View (CX) ── */
function SentimentView() {
  const calls = [
    { caller: "John Smith", sentiment: "Good", color: "bg-green-500", score: 87 },
    { caller: "Maria Garcia", sentiment: "Neutral", color: "bg-yellow-400", score: 62 },
    { caller: "David Park", sentiment: "Good", color: "bg-green-500", score: 91 },
    { caller: "Lisa Thompson", sentiment: "Poor", color: "bg-red-400", score: 28 },
  ];
  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>AI analyzes call sentiment to identify trends and areas for improvement.</p>
      <div className="mb-5">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Today&apos;s Breakdown</span>
        <div className="flex gap-3 mt-2">
          {[{ label: "Good", pct: "62%", color: "bg-green-500" }, { label: "Neutral", pct: "25%", color: "bg-yellow-400" }, { label: "Poor", pct: "13%", color: "bg-red-400" }].map((s) => (
            <div key={s.label} className="flex-1 px-3 py-2.5 rounded-lg text-center" style={{ backgroundColor: "var(--th-bg-hover)" }}>
              <span className={`inline-block w-2 h-2 rounded-full ${s.color} mb-1`} />
              <div className="text-[16px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{s.pct}</div>
              <div className="text-[10px]" style={{ color: "var(--th-text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Recent Calls</span>
        <div className="mt-2 space-y-2">
          {calls.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--th-bg-hover)", animation: `fadeIn 0.2s ease-out ${0.08 * i}s both` }}>
              <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${c.color}`} /><span className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{c.caller}</span></div>
              <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>{c.score}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <span className="text-[12px] font-medium" style={{ color: "var(--th-text-secondary)" }}>Recommendation</span>
        <div className="mt-1.5 px-3 py-2.5 rounded-lg text-[12px] leading-relaxed" style={{ backgroundColor: "var(--th-bg-hover)", border: "1px solid var(--th-border)", color: "var(--th-text-primary)" }}>Lisa Thompson&apos;s call had low sentiment. Consider reviewing the interaction and providing coaching on de-escalation techniques.</div>
      </div>
      <button className="w-full py-3 text-[12px] font-bold tracking-wider uppercase rounded-full active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--th-text-primary)", color: "var(--th-bg)" }}>Export Report</button>
    </div>
  );
}

/* ── Smart Search View (Files) ── */
function SmartSearchView() {
  const [query, setQuery] = useState("Q2 product roadmap changes");
  const results = [
    { name: "Q2_Product_Roadmap_v3.pdf", match: "95%", snippet: "...timeline moved to April 15 with AI features prioritized..." },
    { name: "Sprint Planning Notes.docx", match: "78%", snippet: "...discussed roadmap changes affecting Q2 deliverables..." },
    { name: "Board Meeting Recap.pdf", match: "65%", snippet: "...Q2 roadmap approved with modifications to timeline..." },
  ];
  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-[13px] leading-[1.5] mb-5" style={{ color: "var(--th-text-secondary)" }}>Search your files using natural language. AI finds the most relevant documents.</p>
      <div className="mb-4">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about your files..." className="w-full px-4 py-2.5 text-[13px] border rounded-xl focus:outline-none transition-colors" style={{ color: "var(--th-text-primary)", borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-card)" }} />
      </div>
      <div className="text-[12px] mb-3" style={{ color: "var(--th-text-muted)" }}>{results.length} results found</div>
      <div className="space-y-2">
        {results.map((r, i) => (
          <div key={i} className="px-4 py-3 border rounded-xl cursor-pointer hover:shadow-sm transition-all active:scale-[0.99]" style={{ borderColor: "var(--th-border)", animation: `fadeIn 0.25s ease-out ${0.08 * i}s both` }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--th-text-muted)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--th-border)"}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{r.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-tab-active)" }}>{r.match}</span>
            </div>
            <p className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
