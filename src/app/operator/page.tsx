"use client";

import { useState } from "react";
import Image from "next/image";
import CallPopup from "@/components/talk/CallPopup";

type ContactStatus = "available" | "busy" | "ringing" | "away" | "offline";

interface Contact {
  id: number;
  name: string;
  initials: string;
  avatar?: string;
  avatarColor: string;
  status: ContactStatus;
  favorite: boolean;
  callWith?: string;
  incomingCalls?: string[];
}

const contacts: Contact[] = [
  { id: 1, name: "Cynthia Campbell", initials: "CC", avatar: "https://i.pravatar.cc/80?img=1", avatarColor: "#8B5CF6", status: "away", favorite: true },
  { id: 2, name: "Linda Stevens", initials: "LS", avatar: "https://i.pravatar.cc/80?img=5", avatarColor: "#EC4899", status: "available", favorite: true },
  { id: 3, name: "Rita Jacobs", initials: "RJ", avatar: "https://i.pravatar.cc/80?img=9", avatarColor: "#F59E0B", status: "ringing", favorite: false, callWith: "On a call with (322) ...", incomingCalls: ["Standford ..", "(647) 5430987"] },
  { id: 4, name: "Samantha Swanson", initials: "SS", avatar: "https://i.pravatar.cc/80?img=10", avatarColor: "#EC4899", status: "ringing", favorite: false, callWith: "On a call with (322)...", incomingCalls: ["(647) 5430987"] },
  { id: 5, name: "Darrell Clark", initials: "DC", avatar: "https://i.pravatar.cc/80?img=12", avatarColor: "#F59E0B", status: "ringing", favorite: true, incomingCalls: ["(647) 5430987"] },
  { id: 6, name: "Tina Fox", initials: "TF", avatarColor: "#6B7280", status: "busy", favorite: true, callWith: "On a call with Pearl ..." },
];

const statusColors: Record<ContactStatus, string> = {
  available: "#34C759",
  busy: "#EF4444",
  ringing: "#EF4444",
  away: "#FE9424",
  offline: "#9CA3AF",
};

const filterChips = ["ALL", "INTERNAL", "EXTERNAL"];

/* ── List view fake data ── */
const listViewData = [
  { id: 1, recipient: "Sarah Tenner", ext: "112344", location: "Austin", caller: "Wade Warren", callerNum: "5553", type: "External", date: "2/11/2023", time: "8:21 AM" },
  { id: 2, recipient: "Cody Briant (Me)", ext: "112344", location: "San Fran...", caller: "(684) 555-0102", callerNum: "(684) 555-0102", type: "External", date: "2/11/2023", time: "8:21 AM" },
  { id: 3, recipient: "Sarah Tenner", ext: "112344", location: "Austin", caller: "Wade Warren", callerNum: "5553", type: "External", date: "2/11/2023", time: "8:21 AM" },
  { id: 4, recipient: "Cody Briant (Me)", ext: "112344", location: "San Fran...", caller: "(684) 555-0102", callerNum: "(684) 555-0102", type: "External", date: "2/11/2023", time: "8:21 AM" },
  { id: 5, recipient: "Cody Briant (Me)", ext: "112344", location: "San Fran...", caller: "(684) 555-0102", callerNum: "(684) 555-0102", type: "External", date: "2/11/2023", time: "8:21 AM" },
];

/* ── Edit Group data ── */
const groups = [
  { id: 1, name: "Management" },
  { id: 2, name: "Sales" },
  { id: 3, name: "NY Office" },
];

interface EditGroupContact { id: number; name: string; avatar?: string; initials?: string; checked: boolean; }

const editGroupContacts: EditGroupContact[] = [
  { id: 1, name: "Jordan Anderson", avatar: "https://i.pravatar.cc/80?img=15", checked: false },
  { id: 2, name: "Cody Fisher", avatar: "https://i.pravatar.cc/80?img=22", checked: true },
  { id: 3, name: "Arlene McCoy", initials: "TF", checked: true },
  { id: 4, name: "Floyd Miles", avatar: "https://i.pravatar.cc/80?img=33", checked: true },
  { id: 5, name: "Allen Munger", avatar: "https://i.pravatar.cc/80?img=44", checked: true },
  { id: 6, name: "Caroline Sparks", avatar: "https://i.pravatar.cc/80?img=48", checked: true },
];

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

export default function OperatorConsolePage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("Contacts");
  const [phoneInput, setPhoneInput] = useState("(455) 669 222");
  const [gridView, setGridView] = useState(true);
  const [calling, setCalling] = useState(false);
  const [callingName, setCallingName] = useState("");
  const [volume, setVolume] = useState(56);
  const [editGroupView, setEditGroupView] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(2);
  const [groupName, setGroupName] = useState("Sales");
  const [groupContacts, setGroupContacts] = useState(editGroupContacts);
  const [hoveredListRow, setHoveredListRow] = useState<number | null>(null);
  const [sortDropdown, setSortDropdown] = useState(false);
  const [recipientsDropdown, setRecipientsDropdown] = useState(false);
  const [locationsDropdown, setLocationsDropdown] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      {editGroupView ? (
        <EditGroupView
          groups={groups}
          activeGroupId={activeGroupId}
          setActiveGroupId={setActiveGroupId}
          groupName={groupName}
          setGroupName={setGroupName}
          groupContacts={groupContacts}
          setGroupContacts={setGroupContacts}
          onBack={() => setEditGroupView(false)}
        />
      ) : (
      <>
      {/* Left Panel - Dial Pad */}
      <div
        className="w-[320px] shrink-0 flex flex-col h-full overflow-y-auto"
        style={{ backgroundColor: "var(--th-bg)", borderRight: "1px solid var(--th-border)" }}
      >
        {/* User Info Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--th-border)" }}>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px]" style={{ color: "var(--th-text-primary)" }}>+12063127805</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--th-text-muted)" }}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <h2 className="text-lg font-semibold tracking-[-0.5px] mt-0.5" style={{ color: "var(--th-text-primary)" }}>Anthony Bordain</h2>
          </div>
          <span className="text-[13px]" style={{ color: "var(--th-text-secondary)" }}>ext: x2344</span>
        </div>

        {/* Audio Controls — single line */}
        <div className="flex items-center gap-2 px-3 py-3" style={{ borderBottom: "1px solid var(--th-border)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--th-text-primary)" }} className="shrink-0">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
          </svg>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-[3px] rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--th-text-muted) 0%, var(--th-text-muted) ${volume}%, var(--th-border) ${volume}%, var(--th-border) 100%)`,
            }}
          />
          <button className="flex items-center gap-1 shrink-0 ml-1" title="Phone Settings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--th-text-muted)" }}>
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-[0.25px]" style={{ color: "var(--th-text-primary)" }}>Phone Settings</span>
          </button>
        </div>

        {/* Ongoing Call */}
        <div className="px-3 pt-3 pb-1">
          <span className="text-xs font-semibold px-1" style={{ color: "var(--th-text-primary)" }}>Ongoing call</span>
          <div className="mt-2 rounded-[12px] p-3 mb-2" style={{ backgroundColor: "var(--th-call-card-bg, #001221)", border: "1px solid var(--th-call-card-border, transparent)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[14px] font-medium" style={{ color: "var(--th-call-card-text, white)" }}>(416) 7638098</span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: "var(--th-badge-external-bg, #ebd6e8)", color: "var(--th-badge-external-text, #9c328c)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="7 17 2 12 7 7"/><polyline points="17 7 22 12 17 17"/></svg>
                External
              </span>
            </div>
            <div className="text-[12px] mb-3" style={{ color: "var(--th-call-card-muted, rgba(255,255,255,0.6))" }}>00:00:02</div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors active:scale-95" title="Transfer call" style={{ backgroundColor: "var(--th-call-btn-bg, white)", color: "var(--th-call-btn-text, #001221)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <span className="text-[12px] font-medium">Blind</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="flex-1" />
              <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95" title="Hold" style={{ backgroundColor: "var(--th-call-action-bg, rgba(255,255,255,0.1))" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-call-card-text, white)" strokeWidth="2"><line x1="8" y1="5" x2="8" y2="19"/><line x1="16" y1="5" x2="16" y2="19"/></svg>
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95" title="Park" style={{ backgroundColor: "var(--th-call-action-bg, rgba(255,255,255,0.1))" }}>
                <span className="text-[13px] font-bold" style={{ color: "var(--th-call-card-text, white)" }}>P</span>
              </button>
              <button className="w-9 h-9 rounded-full bg-[#EF4444] flex items-center justify-center hover:bg-[#dc3545] transition-all active:scale-90" title="End call">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.32564 12.1201C5.47897 11.9481 6.42229 11.5697 6.44429 10.4146L6.4556 9.72167C6.464 9.2154 5.78853 7.66424 9.96947 7.66096C14.1454 7.65328 13.4184 9.20775 13.4052 9.71277L13.3941 10.4089C13.375 11.5606 14.3024 11.9371 15.4514 12.1067L16.1447 12.2107C17.2919 12.3757 18.2292 12.2774 18.2514 11.1255L18.2599 10.4991C18.311 10.0246 18.3529 8.61362 17.2413 7.28151C15.9087 5.68225 13.4754 4.87232 10.0172 4.87638C6.55883 4.87729 4.0967 5.69704 2.70646 7.30024C1.55202 8.63383 1.54033 10.0474 1.57292 10.5207L1.56446 11.1471C1.54229 12.299 2.47557 12.3955 3.63039 12.2217L4.32564 12.1201Z" fill="white"/></svg>
              </button>
            </div>
          </div>

          {/* Ringing */}
          <div className="rounded-[12px] p-3 mb-2" style={{ backgroundColor: "var(--th-call-card-bg, #001221)", border: "1px solid var(--th-call-card-border, transparent)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[14px] font-medium" style={{ color: "var(--th-call-card-text, white)" }}>Mary Clary</span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: "var(--th-badge-internal-bg, #d4edda)", color: "var(--th-badge-internal-text, #28a745)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Internal
              </span>
            </div>
            <div className="text-[12px] mb-3" style={{ color: "var(--th-call-card-muted, rgba(255,255,255,0.6))" }}>Ringing...</div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95" title="Speaker" style={{ backgroundColor: "var(--th-call-action-bg, rgba(255,255,255,0.1))" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-call-card-text, white)" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-[#34C759] flex items-center justify-center hover:bg-[#2daa4e] transition-colors active:scale-95" title="Answer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-[#EF4444] flex items-center justify-center hover:bg-[#dc3545] transition-colors active:scale-95" title="Decline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* On Hold */}
          <div className="text-xs font-semibold mt-3 mb-2 px-1" style={{ color: "var(--th-text-primary)" }}>On Hold</div>
          {[
            { number: "(416) 7638098", time: "00:00:02" },
            { number: "Terry Lowlance", time: "00:01:01" },
          ].map((hold, i) => (
            <div key={i} className="flex items-center justify-between rounded-[12px] px-3 py-2.5 mb-1.5" style={{ backgroundColor: "var(--th-call-card-bg, #001221)", border: "1px solid var(--th-call-card-border, transparent)" }}>
              <span className="text-[13px] font-medium" style={{ color: "var(--th-call-card-text, white)" }}>{hold.number}</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono" style={{ color: "var(--th-call-card-muted, rgba(255,255,255,0.6))" }}>{hold.time}</span>
                <button className="w-7 h-7 rounded-full flex items-center justify-center transition-colors active:scale-95" title="Resume call" style={{ backgroundColor: "var(--th-call-action-bg, rgba(255,255,255,0.1))" }}>
                  <svg width="13" height="13" viewBox="0 0 28 28" fill="var(--th-call-card-text, white)"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phone Input */}
        <div className="flex items-center justify-end gap-2 px-4 pt-6 pb-2">
          <input
            type="text"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Enter a name or number"
            className="w-full text-center text-xl outline-none bg-transparent font-normal placeholder:text-[14px] placeholder:font-normal"
            style={{ color: "var(--th-text-primary)" }}
          />
          {phoneInput && (
            <button
              onClick={() => setPhoneInput("")}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors"
              style={{ color: "var(--th-text-muted)" }}
              title="Backspace"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            </button>
          )}
        </div>

        {/* Dial Pad */}
        <div className="flex-1 flex flex-col items-center px-6 pb-4 pt-2">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {dialPadKeys.map((key) => (
              <button
                key={key.digit}
                onClick={() => setPhoneInput((prev) => prev + key.digit)}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-full active:scale-95 transition-all hover:bg-[var(--th-bg-hover)]"
                style={{ backgroundColor: "transparent", border: "1px solid var(--th-border)", color: "var(--th-text-primary)" }}
              >
                <span className="text-2xl font-normal">{key.digit}</span>
                {key.sub && (
                  <span className="text-[10px] font-medium tracking-[0.45px] uppercase" style={{ color: "var(--th-text-muted)" }}>{key.sub}</span>
                )}
              </button>
            ))}
          </div>
          {/* Call button */}
          <button
            onClick={() => {
              setCallingName(phoneInput || "Unknown");
              setCalling(true);
            }}
            className="btn-call w-16 h-16 rounded-full bg-[#34C759] flex items-center justify-center shadow-lg"
            title="Make a call"
          >
            <svg width="22" height="22" viewBox="0 0 28 28" fill="white"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--th-bg)" }}>
        {/* Tabs */}
        <div className="flex items-center" style={{ borderBottom: "1px solid var(--th-border)" }}>
          {[
            { label: "Contacts", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="8" r="4" /><path d="M1 20c0-2.5 3.5-4 8-4s8 1.5 8 4" strokeLinecap="round" /><path d="M19 8a4 4 0 010 7.75" strokeLinecap="round" /><path d="M21 20c0-1.5-1.5-2.7-3.5-3.5" strokeLinecap="round" /></svg>
            )},
            { label: "Unattended calls", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" /></svg>
            )},
            { label: "Parked", icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 010 6H9" /></svg>
            )},
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="flex items-center gap-2 px-5 py-5 text-sm font-semibold transition-colors relative"
              style={{
                color: activeTab === tab.label ? "var(--th-tab-active)" : "var(--th-text-secondary)",
              }}
            >
              <span style={{ color: activeTab === tab.label ? "var(--th-tab-active)" : "var(--th-text-secondary)" }}>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.label && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--th-tab-active)" }} />
              )}
            </button>
          ))}
        </div>

        {activeTab === "Contacts" ? (
        <>
        {/* Filters & Actions Row */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--th-border)" }}>
          <div className="flex items-center gap-3">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.25px] uppercase transition-all"
                style={{
                  backgroundColor: activeFilter === chip ? "var(--th-bg-hover)" : "transparent",
                  color: activeFilter === chip ? "var(--th-tab-active)" : "var(--th-text-secondary)",
                }}
              >
                {activeFilter === chip && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                )}
                {chip}
              </button>
            ))}
            <button className="flex items-center gap-0.5 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.25px] uppercase" style={{ color: "var(--th-text-secondary)" }}>
              MORE
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setEditGroupView(true)} className="text-xs font-bold tracking-[0.24px] uppercase" title="Edit group" style={{ color: "var(--th-tab-active)" }}>
              Edit group
            </button>
            {activeFilter === "EXTERNAL" && (
              <button onClick={() => setShowAddContact(true)} className="flex items-center gap-1 text-xs font-bold tracking-[0.24px] uppercase" title="Add new contact" style={{ color: "var(--th-tab-active)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Contact
              </button>
            )}
          </div>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--th-border)" }}>
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
            style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search contact"
              className="flex-1 outline-none text-base bg-transparent"
              style={{ color: "var(--th-text-primary)" }}
            />
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
            style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}
          >
            All Contacts
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <div className="flex items-center rounded overflow-hidden" style={{ backgroundColor: "var(--th-bg-hover)" }}>
            <button
              onClick={() => setGridView(false)}
              className="p-1 transition-colors"
              title="Show list view"
              style={{ backgroundColor: !gridView ? "var(--th-text-primary)" : "transparent" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={!gridView ? "var(--th-bg)" : "var(--th-text-muted)"} strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            </button>
            <div className="w-px h-5" style={{ backgroundColor: "var(--th-border)" }} />
            <button
              onClick={() => setGridView(true)}
              className="p-1 transition-colors"
              title="Show grid view"
              style={{ backgroundColor: gridView ? "var(--th-text-primary)" : "transparent" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={gridView ? "var(--th-bg)" : "var(--th-text-muted)"} strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            </button>
          </div>
        </div>

        {/* Sort row with dropdowns */}
        <div className="flex items-center gap-3 px-4 py-2 relative" style={{ borderBottom: "1px solid var(--th-border)" }}>
          {/* Sort by status */}
          <div className="relative">
            <button onClick={() => { setSortDropdown(!sortDropdown); setRecipientsDropdown(false); setLocationsDropdown(false); }} className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>
              Sort by status
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
            </button>
            {sortDropdown && (
              <div className="popover-enter absolute top-full left-0 mt-2 z-50 rounded-xl shadow-lg py-1 min-w-[180px]" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
                {["All contacts", "Available", "Busy", "Offline", "Ringing"].map((item) => (
                  <button key={item} onClick={() => setSortDropdown(false)} className="w-full text-left px-4 py-2.5 text-[13px] transition-colors" style={{ color: "var(--th-text-primary)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>{item}</button>
                ))}
              </div>
            )}
          </div>
          <div className="w-px h-4" style={{ backgroundColor: "var(--th-border)" }} />
          {/* All recipients */}
          <div className="relative">
            <button onClick={() => { setRecipientsDropdown(!recipientsDropdown); setSortDropdown(false); setLocationsDropdown(false); }} className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>
              All recipients
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
            </button>
            {recipientsDropdown && (
              <div className="popover-enter absolute top-full left-0 mt-2 z-50 rounded-xl shadow-lg py-2 min-w-[220px]" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
                <div className="px-3 pb-2 mb-1" style={{ borderBottom: "1px solid var(--th-border-light)" }}>
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" placeholder="Search contact" className="flex-1 outline-none text-[13px] bg-transparent" style={{ color: "var(--th-text-primary)" }} />
                  </div>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px]" style={{ color: "var(--th-text-primary)" }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center bg-[#001221]"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></div>
                  Unselect all
                </button>
                {["Trerry Lowrance", "Bryan Kaligan", "Lowse Lowet", "Trerry Lowrance", "Brandon Stone", "Sharon Stone"].map((name, i) => (
                  <button key={i} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] transition-colors" style={{ color: "var(--th-text-primary)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: i < 4 ? "#001221" : "transparent", border: i < 4 ? "none" : "2px solid var(--th-border)" }}>
                      {i < 4 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="w-px h-4" style={{ backgroundColor: "var(--th-border)" }} />
          {/* All locations */}
          <div className="relative">
            <button onClick={() => { setLocationsDropdown(!locationsDropdown); setSortDropdown(false); setRecipientsDropdown(false); }} className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>
              All locations
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
            </button>
            {locationsDropdown && (
              <div className="popover-enter absolute top-full right-0 mt-2 z-50 rounded-xl shadow-lg py-1 min-w-[180px]" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
                {["All locations", "Austin", "San Francisco", "New York", "Toronto"].map((item) => (
                  <button key={item} onClick={() => setLocationsDropdown(false)} className="w-full text-left px-4 py-2.5 text-[13px] transition-colors" style={{ color: "var(--th-text-primary)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>{item}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contacts Grid or List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {gridView ? (
            <div className="grid grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          ) : (
            /* List/Table view */
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--th-border)" }}>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5 pl-2" style={{ color: "var(--th-text-muted)" }}>Recipient</th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Location</th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Caller</th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Type</th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Call Time</th>
                  <th className="w-10 pb-2.5" />
                </tr>
              </thead>
              <tbody>
                {listViewData.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: "1px solid var(--th-border-light)", backgroundColor: hoveredListRow === row.id ? "var(--th-bg-hover)" : "transparent" }}
                    onMouseEnter={() => setHoveredListRow(row.id)}
                    onMouseLeave={() => setHoveredListRow(null)}
                  >
                    <td className="py-3 pl-2">
                      <div className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{row.recipient}</div>
                      <span className="text-[11px] px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-muted)" }}>{row.ext}</span>
                    </td>
                    <td className="py-3 text-[13px]" style={{ color: "var(--th-text-secondary)" }}>{row.location}</td>
                    <td className="py-3">
                      <div className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{row.caller}</div>
                      <span className="text-[11px] px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-muted)" }}>{row.callerNum}</span>
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--th-text-primary)" }}>
                        <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 text-[13px]" style={{ color: "var(--th-text-secondary)" }}>
                      <div>{row.date}</div>
                      <div>{row.time}</div>
                    </td>
                    <td className="py-3 text-center">
                      <button className="p-1 rounded-lg transition-colors" title="More" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--th-text-muted)"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0"
          style={{ borderTop: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)" }}
        >
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>Contacts per page</span>
            <button
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)" }}
            >
              1
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <span className="text-sm" style={{ color: "var(--th-text-primary)" }}>1-10 of 36</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)" }}
            >
              1
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded" style={{ color: "var(--th-text-muted)" }} title="First page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="11 17 6 12 11 7" /><line x1="6" y1="12" x2="6" y2="12" /></svg>
              </button>
              <button className="p-1 rounded" style={{ color: "var(--th-text-muted)" }} title="Previous page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="p-1 rounded" style={{ color: "var(--th-text-muted)" }} title="Next page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <button className="p-1 rounded" style={{ color: "var(--th-text-muted)" }} title="Last page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7" /><line x1="18" y1="12" x2="18" y2="12" /></svg>
              </button>
            </div>
          </div>
        </div>
        </>
        ) : activeTab === "Unattended calls" ? (
        /* Unattended calls — list view */
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--th-border)" }}>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5 pl-2" style={{ color: "var(--th-text-muted)" }}>Recipient</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Location</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Caller</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Type</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Call Time</th>
                <th className="w-10 pb-2.5" />
              </tr>
            </thead>
            <tbody>
              {listViewData.map((row) => (
                <tr key={row.id} className="transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--th-border-light)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td className="py-3 pl-2">
                    <div className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{row.recipient}</div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-muted)" }}>{row.ext}</span>
                  </td>
                  <td className="py-3 text-[13px]" style={{ color: "var(--th-text-secondary)" }}>{row.location}</td>
                  <td className="py-3">
                    <div className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{row.caller}</div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-muted)" }}>{row.callerNum}</span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--th-text-primary)" }}>
                      <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 text-[13px]" style={{ color: "var(--th-text-secondary)" }}>
                    <div>{row.date}</div>
                    <div>{row.time}</div>
                  </td>
                  <td className="py-3 text-center">
                    <button className="p-1 rounded-lg transition-colors" title="More" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--th-text-muted)"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
        /* Parked — placeholder */
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm" style={{ color: "var(--th-text-muted)" }}>No parked calls</span>
        </div>
        )}
      </div>

      {calling && <CallPopup name={callingName || "Unknown"} initials="#" onEnd={() => setCalling(false)} />}
      {showAddContact && <AddContactDialog onClose={() => setShowAddContact(false)} />}
      </>
      )}
    </div>
  );
}

/* ── Edit Group View ── */
function EditGroupView({ groups, activeGroupId, setActiveGroupId, groupName, setGroupName, groupContacts, setGroupContacts, onBack }: {
  groups: { id: number; name: string }[];
  activeGroupId: number;
  setActiveGroupId: (id: number) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  groupContacts: EditGroupContact[];
  setGroupContacts: (c: EditGroupContact[]) => void;
  onBack: () => void;
}) {
  const toggleContact = (id: number) => {
    setGroupContacts(groupContacts.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  return (
    <div className="flex flex-col h-full flex-1" style={{ backgroundColor: "var(--th-bg)" }}>
      {/* Back link */}
      <div className="px-8 py-4" style={{ borderBottom: "1px solid var(--th-border)" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "var(--th-text-primary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to contacts
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — group list */}
        <div className="w-[260px] shrink-0 flex flex-col overflow-y-auto" style={{ borderRight: "1px solid var(--th-border)" }}>
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-xl font-semibold" style={{ color: "var(--th-text-primary)" }}>All groups</h2>
          </div>
          <div className="flex flex-col gap-0.5 px-4">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => { setActiveGroupId(g.id); setGroupName(g.name); }}
                className="text-left px-4 py-3 rounded-lg text-[15px] transition-colors"
                style={{
                  backgroundColor: activeGroupId === g.id ? "var(--th-bg-hover)" : "transparent",
                  color: activeGroupId === g.id ? "var(--th-text-primary)" : "var(--th-text-secondary)",
                  fontWeight: activeGroupId === g.id ? 600 : 400,
                }}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel — group edit */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden px-8 pt-6 pb-6">
          {/* + ADD NEW GROUP — same level as "All groups" title */}
          <div className="flex items-center justify-end mb-5">
            <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--th-tab-active)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add New Group
            </button>
          </div>
          {/* Group name + delete */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[15px] font-medium shrink-0" style={{ color: "var(--th-text-secondary)" }}>Group Name</span>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-[15px] outline-none transition-all"
              style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }}
            />
            <button className="flex items-center gap-1.5 text-sm font-bold text-[#EF4444]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              DELETE
            </button>
          </div>

          {/* Search + location filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search contact" className="flex-1 outline-none text-sm bg-transparent" style={{ color: "var(--th-text-primary)" }} />
            </div>
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--th-border)", color: "var(--th-text-primary)" }}>
              All locations
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
            </button>
          </div>

          {/* Count */}
          <div className="text-[15px] font-semibold mb-4" style={{ color: "var(--th-text-primary)" }}>
            Group has {groupContacts.filter(c => c.checked).length} contacts
          </div>

          {/* Contact list with checkboxes */}
          <div className="flex-1 overflow-y-auto">
            {groupContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 py-3 cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid var(--th-border-light)" }}
                onClick={() => toggleContact(contact.id)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: contact.checked ? "#001221" : "transparent",
                    border: contact.checked ? "none" : "2px solid var(--th-border)",
                  }}
                >
                  {contact.checked && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>

                {/* Avatar */}
                {contact.avatar ? (
                  <Image src={contact.avatar} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)" }}>
                    {contact.initials}
                  </div>
                )}

                {/* Name */}
                <span className="text-sm font-medium" style={{ color: "var(--th-text-primary)" }}>{contact.name}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Add New Contact Dialog ── */
function AddContactDialog({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("Maksym");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="modal-enter w-[480px] max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto" style={{ backgroundColor: "var(--th-bg-card)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--th-text-primary)" }}>Add new contact</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* First name + Avatar upload */}
          <div className="flex gap-6 mt-4">
            <div className="flex-1">
              <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "var(--th-text-primary)" }}><span className="text-[#EF4444]">*</span> First name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }} />
            </div>
            <div className="flex flex-col items-center gap-1.5 pt-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--th-tab-active)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload
              </button>
            </div>
          </div>

          {/* Last name */}
          <div className="mt-4">
            <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "var(--th-text-primary)" }}><span className="text-[#EF4444]">*</span> Last name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }} />
          </div>

          {/* Title */}
          <div className="mt-4">
            <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "var(--th-text-primary)" }}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }} />
          </div>

          {/* Company */}
          <div className="mt-4">
            <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "var(--th-text-primary)" }}>Company</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }} />
          </div>

          {/* Add links */}
          <div className="mt-6 space-y-3">
            {[
              { label: "ADD PHONE", icon: <svg width="16" height="16" viewBox="0 0 28 28" fill="var(--th-tab-active)"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg> },
              { label: "ADD EMAIL", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
              { label: "ADD ADDRESSES", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
            ].map((item) => (
              <button key={item.label} className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--th-tab-active)" }}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors" style={{ color: "var(--th-text-secondary)" }}>
              Cancel
            </button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider text-white transition-colors" style={{ backgroundColor: "#001221" }}>
              Create Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-xl transition-all duration-200"
      style={{
        border: "1px solid var(--th-border)",
        backgroundColor: hovered ? "var(--th-bg-hover)" : "var(--th-bg-card)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Star */}
        <button className="shrink-0 transition-transform hover:scale-110 active:scale-90" title={contact.favorite ? "Remove from favorites" : "Add to favorites"}>
          {contact.favorite ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBD00" stroke="#FBBD00" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCCFD2" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )}
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          {contact.avatar ? (
            <Image
              src={contact.avatar}
              alt={contact.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)" }}
            >
              {contact.initials}
            </div>
          )}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColors[contact.status], border: "2px solid var(--th-bg)" }}
          />
        </div>

        {/* Name & Call info */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold truncate block" style={{ color: "var(--th-text-primary)" }}>{contact.name}</span>
          {contact.callWith && (
            <div className="flex items-center gap-1 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444" stroke="none">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <span className="text-[12px] truncate" style={{ color: "var(--th-text-secondary)" }}>{contact.callWith}</span>
            </div>
          )}
        </div>

        {/* Phone icon */}
        <button className="p-1 shrink-0 rounded-full transition-all active:scale-90" title="Make a call">
          <svg width="18" height="18" viewBox="0 0 28 28" fill="var(--th-text-muted)"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>
        </button>
      </div>

      {/* Incoming Calls */}
      {contact.incomingCalls && contact.incomingCalls.length > 0 && (
        <div className="px-4 pb-3 pt-1" style={{ borderTop: "1px solid var(--th-border)" }}>
          <span className="text-[12px]" style={{ color: "var(--th-text-secondary)" }}>Incoming Calls</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {contact.incomingCalls.map((call, i) => (
              <button
                key={i}
                className="inline-flex items-center justify-between gap-2 text-xs px-3 py-1 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}
              >
                <span>{call}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
