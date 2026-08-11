"use client";

import { useState, useMemo } from "react";

/* ── Types ── */
type ViewMode = "Day" | "Week" | "Month" | "Agenda";

interface CalendarEvent {
  title: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  color: string;
  borderColor: string;
  url: string;
  icon?: string;
}

/* ── Hex to RGBA helper ── */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ── Fake events for the selected day ── */
const dayEvents: CalendarEvent[] = [
  { title: "All-Team kickoff", startHour: 9, startMin: 0, endHour: 10, endMin: 0, color: "#F3F0FF", borderColor: "#7C3AED", url: "https://meet.sangoma.com/9", icon: "team" },
  { title: "Dev/Design sync", startHour: 10, startMin: 30, endHour: 11, endMin: 0, color: "#E0F7FA", borderColor: "#0097A7", url: "https://meet.sangoma.com/9" },
  { title: "Design team meeting", startHour: 12, startMin: 0, endHour: 12, endMin: 30, color: "#E8F5E9", borderColor: "#2CAD43", url: "https://meet.sangoma.com/9" },
  { title: "Control Panel project kick-off meeting", startHour: 13, startMin: 0, endHour: 14, endMin: 0, color: "#FFF3E0", borderColor: "#F59E0B", url: "https://meet.sangoma.com/9", icon: "star" },
];

/* ── Mini calendar data ── */
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/* ── Calendar event dots for mini calendar ── */
const eventDots: Record<number, string[]> = {
  2: ["#7C3AED"],
  5: ["#3B82F6"],
  9: ["#F59E0B", "#2CAD43"],
  11: ["#7C3AED"],
  14: ["#3B82F6", "#F59E0B"],
  18: ["#7C3AED", "#3B82F6"],
  22: ["#7C3AED", "#0097A7", "#2CAD43", "#F59E0B"],
  25: ["#3B82F6"],
};

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("Day");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 22)); // Aug 22, 2025 (matching Figma)
  const [calMonth, setCalMonth] = useState(7); // August (0-indexed)
  const [calYear, setCalYear] = useState(2025);

  const selectedDay = currentDate.getDate();
  const dayOfWeek = DAY_NAMES[currentDate.getDay()];

  /* Mini calendar grid */
  const calendarGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const prevMonthDays = getDaysInMonth(calYear, calMonth - 1);

    const cells: { day: number; currentMonth: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, currentMonth: false });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, currentMonth: true });
    }
    // Next month leading days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false });
    }
    return cells;
  }, [calYear, calMonth]);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    setCurrentDate(new Date(calYear, calMonth, day));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2025, 7, 22));
    setCalMonth(7);
    setCalYear(2025);
  };

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  /* ── Current time position for indicator ── */
  const nowHour = 11;
  const nowMin = 0;
  const timeIndicatorTop = (nowHour - 7) * 64 + (nowMin / 60) * 64;

  return (
    <div className="flex h-full bg-[var(--th-bg)]">
      {/* Left sidebar - Mini calendar */}
      <div className="w-[260px] shrink-0 border-r border-[var(--th-border)] bg-[var(--th-bg)] flex flex-col p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-[var(--th-text-primary)]">
            {MONTH_NAMES[calMonth]}, {calYear}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3.5L5 7l3.5 3.5" stroke="var(--th-text-primary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={handleNextMonth} className="p-1 rounded hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3.5L9 7l-3.5 3.5" stroke="var(--th-text-primary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-[10px] font-semibold text-[var(--th-text-muted)] text-center py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0">
          {calendarGrid.map((cell, i) => {
            const isSelected = cell.currentMonth && cell.day === selectedDay && calMonth === currentDate.getMonth() && calYear === currentDate.getFullYear();
            const dots = cell.currentMonth ? eventDots[cell.day] : undefined;
            return (
              <button
                key={i}
                onClick={() => cell.currentMonth && handleSelectDay(cell.day)}
                className={`relative flex flex-col items-center justify-center h-9 text-[12px] font-medium rounded-full transition-all ${
                  !cell.currentMonth
                    ? "text-[var(--th-text-disabled)]"
                    : isSelected
                      ? "text-white"
                      : "text-[var(--th-text-primary)] hover:bg-[var(--th-bg-hover)]"
                }`}
                style={isSelected ? { backgroundColor: "var(--th-tab-active)" } : undefined}
              >
                {cell.day}
                {dots && dots.length > 0 && (
                  <div className="flex items-center gap-[2px] absolute bottom-0.5">
                    {dots.slice(0, 3).map((c, di) => (
                      <span key={di} className="w-[3px] h-[3px] rounded-full" style={{ background: isSelected ? "white" : c }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main calendar content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--th-border)]">
          {/* Left: nav + date */}
          <div className="flex items-center gap-3 shrink-0">
            <button style={{ backgroundColor: "var(--th-tab-active)" }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#3d1a6e] active:scale-95 transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button onClick={handlePrevDay} className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={handleToday} className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all" data-tip="Today">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="var(--th-text-primary)" strokeWidth="1.3"/>
                <path d="M2 6h12" stroke="var(--th-text-primary)" strokeWidth="1.3"/>
              </svg>
            </button>
            <button onClick={handleNextDay} className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="var(--th-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h2 className="text-[16px] font-semibold text-[var(--th-text-primary)] ml-1">
              {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
            </h2>
          </div>

          {/* Center: view mode tabs */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center bg-[var(--th-bg-hover)] rounded-lg p-0.5" style={{ height: 28 }}>
              {(["Day", "Week", "Month", "Agenda"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3.5 h-full rounded-lg text-[13px] font-semibold transition-all ${
                    viewMode === mode
                      ? "bg-[var(--th-text-primary)] text-[var(--th-bg)]"
                      : "text-[var(--th-text-muted)] hover:text-[var(--th-text-secondary)]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Right: search */}
          <div className="shrink-0">
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <circle cx="7" cy="7" r="4.5" stroke="#7F888F" strokeWidth="1.3"/>
                <path d="M10.5 10.5L13.5 13.5" stroke="#7F888F" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-1.5 w-40 text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-lg bg-[var(--th-bg-input)] focus:outline-none focus:border-[color:var(--th-tab-active)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* View content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "Day" && <DayView dayOfWeek={dayOfWeek} selectedDay={selectedDay} dayEvents={dayEvents} timeIndicatorTop={timeIndicatorTop} />}
          {viewMode === "Week" && <WeekView currentDate={currentDate} />}
          {viewMode === "Month" && <MonthView currentDate={currentDate} />}
          {viewMode === "Agenda" && <AgendaView />}
        </div>
      </div>
    </div>
  );
}

/* ── Day View ── */
function DayView({ dayOfWeek, selectedDay, dayEvents: events, timeIndicatorTop }: { dayOfWeek: string; selectedDay: number; dayEvents: CalendarEvent[]; timeIndicatorTop: number }) {
  return (
    <>
      <div className="px-5 pt-4 pb-2 text-center">
        <div className="text-[11px] text-[var(--th-text-muted)] uppercase tracking-wider font-medium">{dayOfWeek}</div>
        <div className="text-[28px] font-semibold text-[var(--th-text-primary)] leading-none mt-0.5">{selectedDay}</div>
      </div>
      <div className="relative px-5 pb-10">
        {Array.from({ length: 11 }, (_, i) => i + 7).map((hour) => (
          <div key={hour} className="flex items-start h-16 border-t border-[var(--th-border-light)]">
            <span className="text-[11px] text-[var(--th-text-muted)] w-14 shrink-0 -mt-[7px] font-medium">
              {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </span>
            <div className="flex-1 relative" />
          </div>
        ))}
        <div className="absolute left-[4.5rem] right-5 top-0">
          {events.map((event, i) => {
            const top = (event.startHour - 7) * 64 + (event.startMin / 60) * 64;
            const height = ((event.endHour - event.startHour) * 60 + (event.endMin - event.startMin)) / 60 * 64;
            const startStr = `${event.startHour > 12 ? event.startHour - 12 : event.startHour}:${String(event.startMin).padStart(2, "0")} ${event.startHour >= 12 ? "PM" : "AM"}`;
            const endStr = `${event.endHour > 12 ? event.endHour - 12 : event.endHour}:${String(event.endMin).padStart(2, "0")} ${event.endHour >= 12 ? "PM" : "AM"}`;
            return (
              <div key={i} className="absolute left-0 right-0 rounded-lg px-3 py-2 cursor-pointer hover:shadow-md transition-shadow" style={{ top: `${top}px`, height: `${height}px`, backgroundColor: hexToRgba(event.borderColor, 0.15), borderLeft: `3px solid ${event.borderColor}`, animation: `fadeIn 0.25s ease-out ${0.05 * i}s both` }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-[var(--th-text-primary)]">{event.title}</span>
                  {event.icon === "team" && <svg width="14" height="14" viewBox="0 0 14 14" fill={event.borderColor}><circle cx="7" cy="7" r="5"/><path d="M5 7l1.5 1.5L9 5.5" stroke="white" strokeWidth="1.2"/></svg>}
                  {event.icon === "star" && <span className="text-[13px]">&#9733;</span>}
                </div>
                <div className="text-[11px] text-[var(--th-text-muted)] mt-0.5">{startStr} - {endStr} at {event.url}</div>
              </div>
            );
          })}
          <div className="absolute left-0 right-0" style={{ top: `${timeIndicatorTop}px` }}>
            <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-[5px] shrink-0" /><div className="flex-1 h-[2px] bg-red-500" /></div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Week View ── */
const weekEvents: Record<number, { title: string; time: string; color: string; borderColor: string }[]> = {
  0: [{ title: "Team standup", time: "9:00 AM", color: "#F3F0FF", borderColor: "#7C3AED" }],
  1: [{ title: "Design review", time: "10:30 AM", color: "#E0F7FA", borderColor: "#0097A7" }, { title: "Sprint planning", time: "2:00 PM", color: "#FFF3E0", borderColor: "#F59E0B" }],
  2: [{ title: "All-Team kickoff", time: "9:00 AM", color: "#F3F0FF", borderColor: "#7C3AED" }, { title: "Dev/Design sync", time: "10:30 AM", color: "#E0F7FA", borderColor: "#0097A7" }],
  3: [{ title: "Client demo", time: "11:00 AM", color: "#E8F5E9", borderColor: "#2CAD43" }],
  4: [{ title: "Weekly retro", time: "3:00 PM", color: "#FFF3E0", borderColor: "#F59E0B" }, { title: "1:1 with manager", time: "4:00 PM", color: "#F3F0FF", borderColor: "#7C3AED" }],
};

function WeekView({ currentDate }: { currentDate: Date }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  return (
    <div className="px-5 pt-4 pb-10">
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAY_NAMES.map((dayName, i) => {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          const isToday = d.getDate() === currentDate.getDate();
          return (
            <div key={dayName} className="text-center">
              <div className="text-[10px] text-[var(--th-text-muted)] uppercase tracking-wider font-medium">{dayName}</div>
              <div className={`text-[20px] font-semibold leading-none mt-1 w-9 h-9 mx-auto flex items-center justify-center rounded-full ${isToday ? "text-white" : "text-[var(--th-text-primary)]"}`} style={isToday ? { backgroundColor: "var(--th-tab-active)" } : undefined}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid with events */}
      <div className="relative">
        {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
          <div key={hour} className="flex items-start border-t border-[var(--th-border-light)]" style={{ height: 52 }}>
            <span className="text-[10px] text-[var(--th-text-muted)] w-12 shrink-0 -mt-[6px] font-medium">
              {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </span>
            <div className="flex-1 grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const evts = weekEvents[dayIdx]?.filter(e => {
                  const h = parseInt(e.time);
                  const isPM = e.time.includes("PM");
                  const eventHour = isPM && h !== 12 ? h + 12 : h;
                  return eventHour === hour;
                }) || [];
                return (
                  <div key={dayIdx} className="relative">
                    {evts.map((evt, ei) => (
                      <div key={ei} className="absolute inset-x-0 top-0 rounded px-1.5 py-1 text-[10px] font-medium cursor-pointer hover:shadow-sm transition-shadow overflow-hidden" style={{ backgroundColor: hexToRgba(evt.borderColor, 0.15), borderLeft: `2px solid ${evt.borderColor}`, height: 44 }}>
                        <div className="text-[var(--th-text-primary)] truncate">{evt.title}</div>
                        <div className="text-[var(--th-text-muted)] text-[9px]">{evt.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Month View ── */
const monthEventsMap: Record<number, { title: string; color: string }[]> = {
  1: [{ title: "Team standup", color: "#7C3AED" }],
  4: [{ title: "Sprint planning", color: "#F59E0B" }],
  7: [{ title: "Design review", color: "#0097A7" }],
  11: [{ title: "Client meeting", color: "#2CAD43" }],
  14: [{ title: "All-hands", color: "#3B82F6" }, { title: "1:1 sync", color: "#7C3AED" }],
  18: [{ title: "Sprint retro", color: "#F59E0B" }],
  20: [{ title: "Product demo", color: "#EF4444" }],
  22: [{ title: "All-Team kickoff", color: "#7C3AED" }, { title: "Dev sync", color: "#0097A7" }, { title: "Design meeting", color: "#2CAD43" }],
  25: [{ title: "Board meeting", color: "#3B82F6" }],
  28: [{ title: "Month review", color: "#F59E0B" }],
};

function MonthView({ currentDate }: { currentDate: Date }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1);

  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false });

  return (
    <div className="px-5 pt-4 pb-6">
      <div className="grid grid-cols-7 gap-px bg-[var(--th-border)] rounded-xl overflow-hidden">
        {/* Day headers */}
        {DAY_NAMES.map((d) => (
          <div key={d} className="bg-[var(--th-bg-hover)] text-center py-2 text-[10px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider">{d}</div>
        ))}
        {/* Cells */}
        {cells.map((cell, i) => {
          const isToday = cell.current && cell.day === currentDate.getDate();
          const events = cell.current ? monthEventsMap[cell.day] : undefined;
          return (
            <div key={i} className={`bg-[var(--th-bg)] min-h-[90px] p-1.5 ${!cell.current ? "opacity-40" : ""}`}>
              <div className={`text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "text-white" : "text-[var(--th-text-primary)]"}`} style={isToday ? { backgroundColor: "var(--th-tab-active)" } : undefined}>
                {cell.day}
              </div>
              {events && events.slice(0, 3).map((evt, ei) => (
                <div key={ei} className="flex items-center gap-1 mb-0.5 cursor-pointer hover:bg-[var(--th-bg-hover)] rounded px-1 py-0.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: evt.color }} />
                  <span className="text-[10px] text-[var(--th-text-primary)] truncate">{evt.title}</span>
                </div>
              ))}
              {events && events.length > 3 && (
                <span className="text-[9px] text-[var(--th-text-muted)] px-1">+{events.length - 3} more</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Agenda View ── */
const agendaEvents = [
  { date: "Monday, August 18", events: [
    { title: "Sprint retro", time: "2:00 - 3:00 PM", color: "#F59E0B", url: "https://meet.sangoma.com/9" },
  ]},
  { date: "Wednesday, August 20", events: [
    { title: "Product demo", time: "11:00 AM - 12:00 PM", color: "#EF4444", url: "https://meet.sangoma.com/4" },
  ]},
  { date: "Friday, August 22", events: [
    { title: "All-Team kickoff", time: "9:00 - 10:00 AM", color: "#7C3AED", url: "https://meet.sangoma.com/9" },
    { title: "Dev/Design sync", time: "10:30 - 11:00 AM", color: "#0097A7", url: "https://meet.sangoma.com/9" },
    { title: "Design team meeting", time: "12:00 - 12:30 PM", color: "#2CAD43", url: "https://meet.sangoma.com/9" },
    { title: "Control Panel project kick-off", time: "1:00 - 2:00 PM", color: "#F59E0B", url: "https://meet.sangoma.com/9" },
  ]},
  { date: "Monday, August 25", events: [
    { title: "Board meeting", time: "10:00 - 11:30 AM", color: "#3B82F6", url: "https://meet.sangoma.com/2" },
  ]},
  { date: "Thursday, August 28", events: [
    { title: "Month review", time: "3:00 - 4:00 PM", color: "#F59E0B", url: "https://meet.sangoma.com/7" },
  ]},
];

function AgendaView() {
  return (
    <div className="px-5 pt-4 pb-10">
      {agendaEvents.map((group, gi) => (
        <div key={gi} className="mb-6" style={{ animation: `fadeIn 0.2s ease-out ${0.05 * gi}s both` }}>
          <div className="text-[13px] font-semibold text-[var(--th-text-primary)] mb-2 sticky top-0 bg-[var(--th-bg)] py-1">{group.date}</div>
          <div className="space-y-2">
            {group.events.map((evt, ei) => (
              <div key={ei} className="flex items-center gap-3 px-4 py-3 border border-[var(--th-border)] rounded-xl hover:border-[#C5C7CA] hover:shadow-sm transition-all cursor-pointer">
                <span className="w-1 h-10 rounded-full shrink-0" style={{ background: evt.color }} />
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[var(--th-text-primary)]">{evt.title}</div>
                  <div className="text-[11px] text-[var(--th-text-muted)] mt-0.5">{evt.time} · {evt.url}</div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] transition-colors active:scale-90 opacity-0 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="4" r="1" fill="#7F888F"/><circle cx="8" cy="8" r="1" fill="#7F888F"/><circle cx="8" cy="12" r="1" fill="#7F888F"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
