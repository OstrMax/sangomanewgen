"use client";

import { useState, useRef, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  sub: string;
  date: string;
  time: string;
  done: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, text: "Voicemail received", sub: "Listen before EOD", date: "Jul 11, 2025", time: "12:30 PM", done: false },
  { id: 2, text: "Respond from urgent SMS", sub: "Call back the number +1(2...", date: "Jul 11, 2025", time: "01:00 PM", done: true },
  { id: 3, text: "Listen voicemail EOD", sub: "Sales department agreement...", date: "Jul 11, 2025", time: "02:30PM", done: false },
];

const allMeetings = [
  { title: "Weekly 1:1 (Maksym & Seti)", time: "11 – 11:30 at https://meet.sangoma.com/9", day: "WED", date: "12", avatars: ["LB"], more: null },
  { title: "Design Team Meeting", time: "12 – 13:30 at https://meet.sangoma.com/4", avatars: ["TC", "AW"], more: "+ 3 more" },
  { title: "Marketing ODS Meeting", time: "13 – 14:30 at https://meet.sangoma.com/4", avatars: ["LS", "CL"], more: "+ 4 more" },
  { title: "CPO Terry Microsoft Company", time: "14:00 – 15:30 at https://meet.sangoma.com/2", avatars: ["TW", "WW"], more: "+ 11 more" },
  { title: "Design Team Meeting", time: "15 – 16:30", avatars: ["TC"], more: "+ 3 more" },
  { title: "Sprint Review", time: "16 – 17:00", avatars: ["LB", "AW"], more: "+ 2 more" },
];

const allApps = [
  { name: "Sangoma AI-Agent", desc: "Set up call help based on what your business needs", action: "INSTALL", color: "#7C2870", iconType: "apps" as const },
  { name: "Appointment Scheduler", desc: "Schedule an easy and efficient way for you to schedule your...", action: "INSTALL", color: "#066A18", iconType: "curbside" as const },
  { name: "SMS Campaign Registry", desc: "Buy a number, register your brand and register your campaigns in app", action: "VIEW", color: "#142B53", iconType: "sms-campaign" as const },
  { name: "Call Recording Pro", desc: "Advanced recording with AI transcription and analytics", action: "INSTALL", color: "#3B82F6", iconType: "apps" as const },
  { name: "Contact Sync", desc: "Sync contacts across all your connected platforms", action: "VIEW", color: "#EC4899", iconType: "curbside" as const },
];

const recentCalls = [
  { name: "+1 (345) 333 3333", type: "Personal", duration: "00:00", time: "2/11/2025 8:32 AM", direction: "outgoing" as const },
  { name: "Kristin Watson", type: "Groups", duration: "00:00", time: "3/11/2025 12:11 AM", direction: "missed" as const },
  { name: "Wade Warren", type: "Personal", duration: "00:00", time: "3/11/2025 10:11 AM", direction: "missed" as const },
  { name: "Kristin Watson", type: "Groups", duration: "00:00", time: "3/11/2025 12:15 AM", direction: "outgoing" as const },
];

const news = [
  { date: "12 Jul 2025", title: "Enhance conversational IVR", desc: "New AI-transcription, visualisation, talk and much more", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=128&h=96&fit=crop" },
  { date: "11 Jul 2025", title: "Conversational IVR updates", desc: "New AI-transcription, visualisation, talk and much more", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&h=96&fit=crop" },
  { date: "10 Jul 2025", title: "Talk and Chat together", desc: "New AI-transcription, visualisation, talk and much more", img: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=128&h=96&fit=crop" },
];

const avatarColors: Record<string, string> = {
  LB: "#7C3AED", TC: "#2CAD43", AW: "#E85D04", LS: "#3B82F6", CL: "#EC4899", TW: "#F59E0B", WW: "#6366F1",
};

const dateRanges = ["Today", "Last 7 days", "Last 14 days", "Last 21 days", "Month", "2 Months", "3 Months", "6 Months", "12 Months", "Custom"];

const chartPoints = [
  { x: 0, y: 98, time: "10am", calls: 24 },
  { x: 55, y: 70, time: "11am", calls: 40 },
  { x: 110, y: 84, time: "12pm", calls: 32 },
  { x: 165, y: 56, time: "1pm", calls: 48 },
  { x: 220, y: 42, time: "2pm", calls: 56 },
  { x: 275, y: 63, time: "3pm", calls: 44 },
  { x: 330, y: 77, time: "4pm", calls: 36 },
  { x: 385, y: 49, time: "5pm", calls: 52 },
  { x: 440, y: 35, time: "6pm", calls: 60 },
  { x: 500, y: 56, time: "7pm", calls: 48 },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const meetingColors = ["#7C3AED", "#1D3E77", "#2CAD43"];

// More icon component - 20x20 with hover
function MoreIcon({ className = "" }: { className?: string }) {
  return (
    <button
      className={`w-7 h-7 flex items-center justify-center rounded-md cursor-pointer active:scale-95 transition-all ${className}`}
      style={{ backgroundColor: 'transparent' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#7F888F">
        <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
      </svg>
    </button>
  );
}

export default function Home() {
  const [callFilter, setCallFilter] = useState("All");
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Today");
  const [showAllMeetings, setShowAllMeetings] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const newTaskRef = useRef<HTMLInputElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const visibleMeetings = showAllMeetings ? allMeetings : allMeetings.slice(0, 4);
  const visibleApps = showAllApps ? allApps : allApps.slice(0, 4);

  useEffect(() => {
    if (editingId !== null && newTaskRef.current) {
      newTaskRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
        setShowDateDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTask = () => {
    const newId = Date.now();
    setTodos([...todos, { id: newId, text: "", sub: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), done: false }]);
    setEditingId(newId);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleUpdateTask = (id: number, text: string) => {
    setTodos(todos.map((t) => t.id === id ? { ...t, text } : t));
  };

  const handleFinishEdit = () => {
    setTodos(todos.filter((t) => t.text.trim() !== ""));
    setEditingId(null);
  };

  // For missed filter
  const filteredCalls = callFilter === "Missed"
    ? recentCalls.filter((c) => c.direction === "missed")
    : callFilter === "Recorded"
      ? recentCalls.filter((c) => c.direction === "outgoing")
      : recentCalls;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-5 gap-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal" style={{ color: 'var(--th-text-primary)' }}>Good day, Lora Benedict!</h1>
        <div className="relative" ref={dateDropdownRef}>
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
            style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)', color: 'var(--th-text-primary)', backgroundColor: 'var(--th-bg-card)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-card)'; }}
          >
            {selectedRange}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showDateDropdown ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {showDateDropdown && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg z-50 py-1 animate-[fadeIn_0.15s_ease-out]"
              style={{ backgroundColor: 'var(--th-dropdown-bg, var(--th-bg-card))', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-dropdown-border, var(--th-border))', boxShadow: 'var(--th-dropdown-shadow, 0 10px 15px -3px rgba(0,0,0,0.1))' }}
            >
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => { setSelectedRange(range); setShowDateDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: selectedRange === range ? 'var(--th-bg-hover)' : 'transparent',
                    color: selectedRange === range ? 'var(--th-text-primary)' : 'var(--th-text-secondary)',
                    fontWeight: selectedRange === range ? 500 : 400,
                  }}
                  onMouseEnter={(e) => { if (selectedRange !== range) e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                  onMouseLeave={(e) => { if (selectedRange !== range) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top row: To-do + Quick actions */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>To-do for today</h2>
            <button onClick={handleAddTask} className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--th-text-muted)' }}>+ New task</button>
          </div>
          <div className="flex flex-col gap-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-start gap-3 group rounded-lg px-1 py-1 -mx-1 transition-colors cursor-pointer"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className="w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-all active:scale-90"
                  style={{
                    borderWidth: 1,
                    borderStyle: 'solid',
                    backgroundColor: todo.done ? 'var(--th-text-primary)' : 'transparent',
                    borderColor: todo.done ? 'var(--th-text-primary)' : 'var(--th-border)',
                  }}
                >
                  {todo.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <input
                      ref={newTaskRef}
                      type="text"
                      value={todo.text}
                      onChange={(e) => handleUpdateTask(todo.id, e.target.value)}
                      onBlur={handleFinishEdit}
                      onKeyDown={(e) => e.key === "Enter" && handleFinishEdit()}
                      placeholder="Type task name..."
                      className="text-sm font-medium outline-none w-full bg-transparent pb-0.5"
                      style={{ color: 'var(--th-text-primary)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--th-tab-active)' }}
                    />
                  ) : (
                    <>
                      <p className="text-sm font-medium" style={{ color: todo.done ? 'var(--th-text-muted)' : 'var(--th-text-primary)', textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.text}</p>
                      {todo.sub && <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{todo.sub}</p>}
                    </>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{todo.date}</p>
                  <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{todo.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddTask} className="flex items-center gap-1 mt-4 text-sm transition-colors" style={{ color: 'var(--th-text-muted)' }}>+ New task</button>
        </div>

        {/* Quick Actions */}
        <div className="rounded-[16px] p-[24px]" style={{ backgroundColor: 'var(--th-quick-actions-bg, rgba(29,62,119,0.04))' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--th-text-primary)' }}>Quick actions</h2>
            <MoreIcon />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Create new\ntask",
                iconStyle: { background: "transparent", border: "1.5px solid #CCCFD2" },
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
              },
              {
                label: "Send SMS",
                iconStyle: { background: "rgba(44,173,67,0.12)" },
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a7a2b"><path d="M11.99 3C8.65 3 5.75 4.12 3.83 6.15C1.58 8.54 1 11.5 2.11 14.98C2.68 16.76 3.81 19.26 5.96 21.08C6.13 21.22 6.33 21.29 6.54 21.29C6.76 21.29 6.98 21.21 7.15 21.06C7.64 20.62 8.11 19.98 8.6 19.13C9.76 19.38 10.88 19.5 12 19.5C17.97 19.5 22.47 15.91 22.47 11.14C22.47 6.5 17.97 3 11.99 3ZM8.62 12.75C8 12.75 7.5 12.25 7.5 11.63C7.5 11 8 10.5 8.62 10.5C9.25 10.5 9.75 11 9.75 11.63C9.75 12.25 9.25 12.75 8.62 12.75ZM12.37 12.75C11.75 12.75 11.25 12.25 11.25 11.63C11.25 11 11.75 10.5 12.37 10.5C13 10.5 13.5 11 13.5 11.63C13.5 12.25 13 12.75 12.37 12.75ZM16.12 12.75C15.5 12.75 15 12.25 15 11.63C15 11 15.5 10.5 16.12 10.5C16.75 10.5 17.25 11 17.25 11.63C17.25 12.25 16.75 12.75 16.12 12.75Z"/></svg>,
              },
              {
                label: "Make a call",
                iconStyle: { background: "rgba(29,62,119,0.12)" },
                icon: <svg width="16" height="16" viewBox="0 0 28 28" fill="#1D3E77"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>,
              },
              {
                label: "Start video\nmeeting",
                iconStyle: { background: "rgba(156,50,140,0.12)" },
                icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="#7C2870"><path d="M23.2 7.95C22.89 7.28 22.15 6.89 21.44 7.07C20.9 7.2 20.33 7.52 19.72 7.92C19.45 8.1 19.33 8.44 19.42 8.75C20.01 10.91 20.01 13.09 19.42 15.25C19.33 15.56 19.45 15.9 19.72 16.08C20.33 16.49 20.9 16.8 21.44 16.93C22.15 17.11 22.89 16.71 23.2 16.05C24.24 13.77 24.24 10.23 23.2 7.95ZM3.7 5.92C7.85 4.35 12.01 4.35 16.16 5.92C16.53 6.06 16.84 6.34 17.02 6.7C18.8 10.23 18.8 13.77 17.02 17.3C16.84 17.66 16.53 17.94 16.16 18.08C12.01 19.65 7.85 19.65 3.7 18.08C3.33 17.94 3.02 17.66 2.84 17.3C1.05 13.77 1.05 10.23 2.84 6.7C3.02 6.34 3.33 6.06 3.7 5.92Z"/></svg>,
              },
            ].map((action) => (
              <button
                key={action.label}
                className="card-lift flex items-center gap-3 p-4 rounded-[12px] shadow-[0px_1px_12px_0px_rgba(0,0,0,0.06)]"
                style={{ backgroundColor: 'var(--th-bg-card)' }}
                title={action.label.replace('\n', ' ')}
              >
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={action.iconStyle}>{action.icon}</span>
                <span className="text-[14px] font-medium text-left whitespace-pre-wrap leading-[1.3]" style={{ color: 'var(--th-text-primary)' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle row: Upcoming meeting + Apps - equal height */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>Upcoming meeting</h2>
            <button className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--th-text-muted)' }}>View all &rarr;</button>
          </div>
          <div className="flex flex-col gap-1">
            {visibleMeetings.map((meeting, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-1.5 rounded-lg px-1 -mx-1 transition-colors cursor-pointer group"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {i === 0 && (
                  <div className="flex flex-col items-center w-10 shrink-0">
                    <span className="text-[10px] uppercase" style={{ color: 'var(--th-text-muted)' }}>{meeting.day}</span>
                    <span className="text-xl font-semibold" style={{ color: 'var(--th-text-primary)' }}>{meeting.date}</span>
                  </div>
                )}
                {i !== 0 && <div className="w-10 shrink-0" />}
                <div className="flex-1 p-3 rounded-lg transition-colors" style={{ backgroundColor: hexToRgba(meetingColors[i % meetingColors.length], 0.08), borderLeft: `3px solid ${meetingColors[i % meetingColors.length]}` }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--th-text-primary)' }}>{meeting.title}</p>
                  <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{meeting.time}</p>
                </div>
                <div className="flex items-center -space-x-2">
                  {meeting.avatars.map((a) => (
                    <div key={a} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-secondary)", borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--th-bg-card)' }}>{a}</div>
                  ))}
                </div>
                {meeting.more && <span className="text-xs whitespace-nowrap" style={{ color: 'var(--th-text-muted)' }}>{meeting.more}</span>}
              </div>
            ))}
          </div>
          {allMeetings.length > 4 && (
            <button onClick={() => setShowAllMeetings(!showAllMeetings)} className="flex items-center gap-1 mt-3 text-sm transition-colors" style={{ color: 'var(--th-text-muted)' }}>
              {showAllMeetings ? "Show less" : `Show more (${allMeetings.length - 4})`} &rarr;
            </button>
          )}
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>Apps</h2>
            <button className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--th-text-muted)' }}>View all &rarr;</button>
          </div>
          <div className="flex flex-col gap-3">
            {visibleApps.map((app) => (
              <div
                key={app.name}
                className="flex items-center gap-3 rounded-lg px-1 py-1 -mx-1 transition-colors cursor-pointer"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${app.color}1A` }}>
                  {/* apps.svg - 3x3 dot grid */}
                  {app.iconType === "apps" && <svg width="18" height="18" viewBox="0 0 24 24" fill={app.color}><path d="M5.6 3.2C4.964 3.2 4.353 3.453 3.903 3.903C3.453 4.353 3.2 4.963 3.2 5.6C3.2 6.236 3.453 6.847 3.903 7.297C4.353 7.747 4.964 8 5.6 8C6.237 8 6.847 7.747 7.297 7.297C7.747 6.847 8 6.236 8 5.6C8 4.963 7.747 4.353 7.297 3.903C6.847 3.453 6.237 3.2 5.6 3.2ZM12 3.2C11.364 3.2 10.753 3.453 10.303 3.903C9.853 4.353 9.6 4.963 9.6 5.6C9.6 6.236 9.853 6.847 10.303 7.297C10.753 7.747 11.364 8 12 8C12.637 8 13.247 7.747 13.697 7.297C14.147 6.847 14.4 6.236 14.4 5.6C14.4 4.963 14.147 4.353 13.697 3.903C13.247 3.453 12.637 3.2 12 3.2ZM18.4 3.2C17.764 3.2 17.153 3.453 16.703 3.903C16.253 4.353 16 4.963 16 5.6C16 6.236 16.253 6.847 16.703 7.297C17.153 7.747 17.764 8 18.4 8C19.037 8 19.647 7.747 20.097 7.297C20.547 6.847 20.8 6.236 20.8 5.6C20.8 4.963 20.547 4.353 20.097 3.903C19.647 3.453 19.037 3.2 18.4 3.2ZM5.6 9.6C4.964 9.6 4.353 9.853 3.903 10.303C3.453 10.753 3.2 11.363 3.2 12C3.2 12.636 3.453 13.247 3.903 13.697C4.353 14.147 4.964 14.4 5.6 14.4C6.237 14.4 6.847 14.147 7.297 13.697C7.747 13.247 8 12.636 8 12C8 11.363 7.747 10.753 7.297 10.303C6.847 9.853 6.237 9.6 5.6 9.6ZM12 9.6C11.364 9.6 10.753 9.853 10.303 10.303C9.853 10.753 9.6 11.363 9.6 12C9.6 12.636 9.853 13.247 10.303 13.697C10.753 14.147 11.364 14.4 12 14.4C12.637 14.4 13.247 14.147 13.697 13.697C14.147 13.247 14.4 12.636 14.4 12C14.4 11.363 14.147 10.753 13.697 10.303C13.247 9.853 12.637 9.6 12 9.6ZM18.4 9.6C17.764 9.6 17.153 9.853 16.703 10.303C16.253 10.753 16 11.363 16 12C16 12.636 16.253 13.247 16.703 13.697C17.153 14.147 17.764 14.4 18.4 14.4C19.037 14.4 19.647 14.147 20.097 13.697C20.547 13.247 20.8 12.636 20.8 12C20.8 11.363 20.547 10.753 20.097 10.303C19.647 9.853 19.037 9.6 18.4 9.6ZM5.6 16C4.964 16 4.353 16.253 3.903 16.703C3.453 17.153 3.2 17.763 3.2 18.4C3.2 19.036 3.453 19.647 3.903 20.097C4.353 20.547 4.964 20.8 5.6 20.8C6.237 20.8 6.847 20.547 7.297 20.097C7.747 19.647 8 19.036 8 18.4C8 17.763 7.747 17.153 7.297 16.703C6.847 16.253 6.237 16 5.6 16ZM12 16C11.364 16 10.753 16.253 10.303 16.703C9.853 17.153 9.6 17.763 9.6 18.4C9.6 19.036 9.853 19.647 10.303 20.097C10.753 20.547 11.364 20.8 12 20.8C12.637 20.8 13.247 20.547 13.697 20.097C14.147 19.647 14.4 19.036 14.4 18.4C14.4 17.763 14.147 17.153 13.697 16.703C13.247 16.253 12.637 16 12 16ZM18.4 16C17.764 16 17.153 16.253 16.703 16.703C16.253 17.153 16 17.763 16 18.4C16 19.036 16.253 19.647 16.703 20.097C17.153 20.547 17.764 20.8 18.4 20.8C19.037 20.8 19.647 20.547 20.097 20.097C20.547 19.647 20.8 19.036 20.8 18.4C20.8 17.763 20.547 17.153 20.097 16.703C19.647 16.253 19.037 16 18.4 16Z"/></svg>}
                  {/* curbside.svg - vehicle/car */}
                  {app.iconType === "curbside" && <svg width="18" height="18" viewBox="0 0 24 24" fill={app.color}><path d="M12 2.621C10.225 2.621 8.452 2.87 6.726 3.372C6.721 3.374 6.719 3.378 6.714 3.379C6.655 3.397 6.602 3.433 6.547 3.466C6.517 3.485 6.481 3.497 6.454 3.52C6.449 3.525 6.441 3.524 6.436 3.529C5.212 4.606 4.289 5.974 3.792 7.318C3.686 7.607 3.951 7.892 4.248 7.811C4.551 7.728 4.85 7.65 5.143 7.578C5.251 7.551 5.334 7.48 5.381 7.38C5.806 6.465 6.472 5.538 7.309 4.771C10.382 3.91 13.618 3.91 16.692 4.771C17.528 5.537 18.193 6.463 18.618 7.378C18.664 7.479 18.749 7.551 18.857 7.578C19.15 7.65 19.448 7.727 19.752 7.811C20.049 7.892 20.315 7.606 20.209 7.317C19.712 5.973 18.788 4.607 17.565 3.53C17.558 3.525 17.551 3.525 17.546 3.52C17.519 3.498 17.483 3.485 17.453 3.466C17.399 3.432 17.345 3.397 17.285 3.379C17.281 3.378 17.278 3.374 17.273 3.372C15.547 2.87 13.774 2.621 12 2.621ZM12 8.177C9.232 8.177 6.464 8.678 3.162 9.68C2.624 9.858 2.042 10.374 1.922 10.818C1.466 12.457 1.466 14.193 1.922 15.832C2.043 16.277 2.623 16.792 3.162 16.97C9.766 18.974 14.233 18.974 20.837 16.97C21.376 16.792 21.959 16.276 22.079 15.832C22.534 14.193 22.534 12.457 22.079 10.818C21.959 10.373 21.376 9.857 20.837 9.68C17.535 8.678 14.768 8.177 12 8.177ZM5.257 12.574H5.264C5.679 12.574 6.014 12.91 6.014 13.324C6.014 13.739 5.678 14.074 5.264 14.074C4.85 14.074 4.511 13.739 4.511 13.324C4.511 12.91 4.843 12.574 5.257 12.574ZM18.757 12.574H18.764C19.179 12.574 19.514 12.91 19.514 13.324C19.514 13.739 19.178 14.074 18.764 14.074C18.35 14.074 18.011 13.739 18.011 13.324C18.011 12.91 18.343 12.574 18.757 12.574ZM9.268 12.583C9.364 12.569 9.465 12.572 9.565 12.598C11.157 13.008 12.842 13.008 14.434 12.598C14.837 12.496 15.245 12.737 15.348 13.138C15.451 13.54 15.208 13.948 14.808 14.051C13.889 14.287 12.945 14.405 12 14.405C11.055 14.405 10.11 14.287 9.192 14.051C8.791 13.947 8.549 13.539 8.651 13.138C8.729 12.837 8.979 12.627 9.268 12.583ZM3.193 18.554C3.056 18.551 2.929 18.631 2.865 18.75C2.791 18.886 2.824 19.039 2.853 19.182C2.983 19.816 3.523 20.598 4.273 20.798C4.837 20.943 5.415 21.018 5.997 21.018C6.579 21.018 7.164 20.943 7.733 20.796C8.017 20.72 8.294 20.562 8.522 20.339C8.593 20.273 8.636 20.178 8.636 20.071C8.636 19.879 8.488 19.724 8.301 19.696C6.778 19.476 5.091 19.087 3.31 18.573C3.27 18.562 3.235 18.555 3.193 18.554ZM20.817 18.554C20.775 18.555 20.738 18.562 20.698 18.573C18.917 19.087 17.23 19.476 15.707 19.696C15.52 19.724 15.372 19.879 15.372 20.071C15.372 20.178 15.416 20.273 15.486 20.339C15.714 20.562 15.991 20.72 16.276 20.796C16.844 20.943 17.429 21.018 18.011 21.018C18.593 21.018 19.172 20.943 19.736 20.798C20.486 20.598 21.025 19.816 21.155 19.182C21.184 19.039 21.217 18.886 21.143 18.75C21.079 18.631 20.954 18.551 20.817 18.554Z"/></svg>}
                  {/* sms-campaign.svg - megaphone */}
                  {app.iconType === "sms-campaign" && <svg width="18" height="18" viewBox="0 0 24 24" fill={app.color}><path d="M19.688 3.81C17.724 3.788 11.318 4.051 6.138 8.062C6.014 8.158 5.922 8.293 5.877 8.443C5.647 9.211 5.288 10.63 5.288 12C5.288 13.486 5.706 14.987 5.873 15.549C5.918 15.702 6.01 15.836 6.136 15.935C6.64 16.326 7.158 16.673 7.68 16.997C7.17 19.062 8.331 20.952 10.046 21.53C11.783 22.116 13.825 21.385 14.703 19.69C16.765 20.104 18.517 20.197 19.478 20.197C19.553 20.197 19.628 20.197 19.688 20.19C20.31 20.19 20.881 19.875 21.226 19.358C21.983 18.195 23.25 15.697 23.25 12C23.25 8.302 21.983 5.805 21.226 4.642C20.881 4.125 20.31 3.81 19.688 3.81ZM3.171 8.279C2.815 8.283 2.485 8.364 2.183 8.527C1.53 8.879 0.75 9.765 0.75 12C0.75 14.235 1.53 15.12 2.183 15.472C2.581 15.688 3.034 15.763 3.536 15.697C3.96 15.642 4.221 15.205 4.126 14.788C3.943 13.978 3.788 12.989 3.788 12C3.788 11.011 3.943 10.021 4.126 9.211C4.221 8.795 3.961 8.357 3.538 8.301C3.412 8.285 3.29 8.278 3.171 8.279ZM9.056 17.779C10.448 18.487 11.851 18.986 13.175 19.343C12.572 20.171 11.487 20.432 10.525 20.108C9.614 19.801 8.922 18.953 9.056 17.779Z"/></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--th-text-primary)' }}>{app.name}</p>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--th-text-muted)' }}>{app.desc}</p>
                </div>
                <button
                  className="px-3 py-1 rounded text-xs font-medium shrink-0 transition-colors"
                  style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)', color: 'var(--th-text-primary)', backgroundColor: 'var(--th-bg-card)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-card)'; }}
                >{app.action}</button>
              </div>
            ))}
          </div>
          {allApps.length > 4 && (
            <button onClick={() => setShowAllApps(!showAllApps)} className="flex items-center gap-1 mt-3 text-sm transition-colors" style={{ color: 'var(--th-text-muted)' }}>
              {showAllApps ? "Show less" : `Show more (${allApps.length - 4})`} &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Recent calls + Stats */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>Recent calls</h2>
            <div className="flex items-center gap-1">
              {["All", "Missed", "Recorded"].map((f) => (
                <button
                  key={f}
                  onClick={() => setCallFilter(f)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: callFilter === f ? 'var(--th-text-primary)' : 'transparent',
                    color: callFilter === f ? 'var(--th-bg-card)' : 'var(--th-text-muted)',
                  }}
                  onMouseEnter={(e) => { if (callFilter !== f) e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                  onMouseLeave={(e) => { if (callFilter !== f) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >{f}</button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs" style={{ color: 'var(--th-text-muted)' }}>
                <th className="text-left font-medium pb-2">To / From</th>
                <th className="text-left font-medium pb-2">Type</th>
                <th className="text-left font-medium pb-2">Duration</th>
                <th className="text-left font-medium pb-2">Call time</th>
                <th className="text-left font-medium pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((call, i) => {
                const isMissedFilter = callFilter === "Missed";
                const iconColor = isMissedFilter ? "#EF4444" : (call.direction === "missed" ? "#EF4444" : "#2CAD43");
                return (
                  <tr
                    key={i}
                    className="transition-colors cursor-pointer"
                    style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--th-border-light)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td className="py-2.5 flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
                        {(isMissedFilter || call.direction === "missed") ? <><line x1="18" y1="6" x2="6" y2="18"/><polyline points="8 6 18 6 18 16"/></> : <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>}
                      </svg>
                      <span style={{ color: 'var(--th-text-primary)' }}>{call.name}</span>
                    </td>
                    <td className="py-2.5" style={{ color: 'var(--th-text-muted)' }}>{call.type}</td>
                    <td className="py-2.5" style={{ color: 'var(--th-text-muted)' }}>{call.duration}</td>
                    <td className="py-2.5" style={{ color: 'var(--th-text-muted)' }}>{call.time}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 rounded transition-colors"
                          style={{ color: 'var(--th-text-muted)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; e.currentTarget.style.color = 'var(--th-text-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--th-text-muted)'; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        </button>
                        <MoreIcon />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>Stats</h2>
            <MoreIcon />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Missed calls", value: "3", color: "#EF4444" },
              { label: "Voicemails", value: "2", color: "#F59E0B" },
              { label: "Unread SMS", value: "22", color: "#3B82F6" },
              { label: "Chat mentioned", value: "8", color: "#7C3AED" },
              { label: "Upcoming meeting", value: "4", color: "#2CAD43" },
              { label: "Active calls", value: "1", color: "#0097A7" },
              { label: "Total calls today", value: "47", color: "#1D3E77" },
              { label: "Avg call duration", value: "3:42", color: "#F97316" },
              { label: "Transfer rate", value: "12%", color: "#6366F1" },
            ].map((stat) => (
              <button
                key={stat.label}
                className="text-left group rounded-lg p-2 -m-2 transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{stat.label}</p>
                <p className="text-2xl font-semibold transition-colors" style={{ color: 'var(--th-text-primary)' }}>{stat.value}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Last row: Calls chart + News */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>Calls</h2>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--th-text-primary)' }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <button className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--th-text-muted)' }}>Learn more &rarr;</button>
          </div>
          {/* Accurate chart */}
          <div className="relative h-44">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] w-6 pointer-events-none" style={{ color: 'var(--th-text-muted)' }}>
              <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            {/* Grid lines */}
            <svg className="absolute left-8 right-0 top-0 bottom-6" viewBox="0 0 500 140" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="500" y2="0" stroke="var(--th-border-light)" strokeWidth="1"/>
              <line x1="0" y1="35" x2="500" y2="35" stroke="var(--th-border-light)" strokeWidth="1"/>
              <line x1="0" y1="70" x2="500" y2="70" stroke="var(--th-border-light)" strokeWidth="1"/>
              <line x1="0" y1="105" x2="500" y2="105" stroke="var(--th-border-light)" strokeWidth="1"/>
              <line x1="0" y1="140" x2="500" y2="140" stroke="var(--th-border-light)" strokeWidth="1"/>
            </svg>
            {/* Chart line */}
            <svg className="absolute left-8 right-0 top-0 bottom-6" viewBox="0 0 500 140" preserveAspectRatio="none">
              <polyline points="0,98 55,70 110,84 165,56 220,42 275,63 330,77 385,49 440,35 500,56" fill="none" stroke="var(--th-text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Data points */}
            <svg className="absolute left-8 right-0 top-0 bottom-6" viewBox="0 0 500 140">
              {chartPoints.map((p, i) => (
                <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                  <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? 6 : 4} fill="var(--th-text-primary)" className="transition-all duration-150"/>
                  <circle cx={p.x} cy={p.y} r="12" fill="transparent" className="cursor-pointer"/>
                </g>
              ))}
            </svg>
            {/* Tooltip */}
            {hoveredPoint !== null && (
              <div className="absolute left-8 right-0 top-0 bottom-6 pointer-events-none z-10">
                <div
                  className="absolute bg-[#001221] text-white text-xs rounded-lg px-3 py-2 shadow-lg -translate-x-1/2 -translate-y-full -mt-2"
                  style={{
                    left: `${(chartPoints[hoveredPoint].x / 500) * 100}%`,
                    top: `${(chartPoints[hoveredPoint].y / 140) * 100}%`,
                  }}
                >
                  <div className="font-semibold">{chartPoints[hoveredPoint].calls} calls</div>
                  <div className="text-white/60">{chartPoints[hoveredPoint].time}</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between pl-8 mt-1 text-[10px]" style={{ color: 'var(--th-text-muted)' }}>
            {["10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm"].map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--th-bg-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--th-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--th-text-primary)' }}>News</h2>
            <button className="text-sm flex items-center gap-1 transition-colors" style={{ color: 'var(--th-text-muted)' }}>View all &rarr;</button>
          </div>
          <div className="flex flex-col gap-4">
            {news.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg px-1 py-1 -mx-1 transition-colors cursor-pointer"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px]" style={{ color: 'var(--th-text-muted)' }}>{item.date}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--th-text-primary)' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--th-text-muted)' }}>{item.desc}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.title} className="w-16 h-12 rounded-lg shrink-0 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
