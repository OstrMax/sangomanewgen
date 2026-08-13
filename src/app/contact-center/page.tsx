"use client";

import { useState } from "react";
import Image from "next/image";

const queues = [
  { name: "Sales", waiting: 3, active: 5, avgWait: "1:24", sla: 92 },
  { name: "Support", waiting: 7, active: 8, avgWait: "2:45", sla: 78 },
  { name: "Billing", waiting: 1, active: 3, avgWait: "0:32", sla: 96 },
  { name: "Technical", waiting: 4, active: 6, avgWait: "3:12", sla: 71 },
];

const agents = [
  { name: "Sarah Chen", status: "available", queue: "Sales", calls: 12, avgHandle: "3:45", img: 5 },
  { name: "Mike Ross", status: "on-call", queue: "Support", calls: 8, avgHandle: "5:12", img: 12 },
  { name: "Laura Kim", status: "available", queue: "Sales", calls: 15, avgHandle: "2:58", img: 9 },
  { name: "David Park", status: "wrap-up", queue: "Technical", calls: 6, avgHandle: "7:30", img: 11 },
  { name: "Ava Singh", status: "on-call", queue: "Support", calls: 10, avgHandle: "4:20", img: 32 },
  { name: "Tom Blake", status: "break", queue: "Billing", calls: 9, avgHandle: "3:05", img: 53 },
  { name: "Chris Lee", status: "available", queue: "Technical", calls: 11, avgHandle: "6:15", img: 68 },
  { name: "Kerry James", status: "on-call", queue: "Sales", calls: 7, avgHandle: "4:50", img: 33 },
];

const activeCalls = [
  { caller: "+1 (416) 555-0123", agent: "Mike Ross", queue: "Support", duration: "3:42", topic: "Account access issue" },
  { caller: "+1 (905) 555-0456", agent: "Ava Singh", queue: "Support", duration: "1:15", topic: "Billing inquiry" },
  { caller: "+1 (647) 555-0789", agent: "Kerry James", queue: "Sales", duration: "5:30", topic: "Enterprise plan demo" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Available", color: "#2CAD43", bg: hexToRgba("#2CAD43", 0.15) },
  "on-call": { label: "On Call", color: "#3B82F6", bg: hexToRgba("#3B82F6", 0.15) },
  "wrap-up": { label: "Wrap-up", color: "#F59E0B", bg: hexToRgba("#F59E0B", 0.15) },
  break: { label: "Break", color: "#7F888F", bg: hexToRgba("#7F888F", 0.15) },
};

/* Hourly call data with inbound/outbound split */
const hourlyData = [
  { hour: 8, inbound: 6, outbound: 2, missed: 1 },
  { hour: 9, inbound: 12, outbound: 3, missed: 2 },
  { hour: 10, inbound: 18, outbound: 4, missed: 3 },
  { hour: 11, inbound: 24, outbound: 6, missed: 4 },
  { hour: 12, inbound: 20, outbound: 5, missed: 2 },
  { hour: 13, inbound: 14, outbound: 4, missed: 1 },
  { hour: 14, inbound: 28, outbound: 7, missed: 5 },
  { hour: 15, inbound: 22, outbound: 6, missed: 3 },
  { hour: 16, inbound: 16, outbound: 4, missed: 2 },
  { hour: 17, inbound: 10, outbound: 2, missed: 1 },
  { hour: 18, inbound: 6, outbound: 2, missed: 0 },
  { hour: 19, inbound: 3, outbound: 2, missed: 0 },
];

const maxTotal = Math.max(...hourlyData.map(d => d.inbound + d.outbound));

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function CXPage() {
  const [tab, setTab] = useState<"dashboard" | "agents" | "calls">("dashboard");

  return (
    <div className="flex h-full">
      {/* Left sidebar — same pattern as Meet page */}
      <div className="w-[220px] shrink-0 border-r flex flex-col" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg)" }}>
        <div className="px-4 pt-5 pb-3">
          {([
            { key: "dashboard" as const, label: "Dashboard", icon: (active: boolean) => (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1.5" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/>
                <rect x="9" y="2" width="5" height="5" rx="1.5" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/>
                <rect x="2" y="9" width="5" height="5" rx="1.5" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/>
                <rect x="9" y="9" width="5" height="5" rx="1.5" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/>
              </svg>
            )},
            { key: "agents" as const, label: "Agents", icon: (active: boolean) => (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5.5" r="2.5" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/>
                <path d="M3 13.5c0-2 3.33-3 5-3s5 1 5 3" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            )},
            { key: "calls" as const, label: "Active Calls", icon: (active: boolean) => (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10.67v1.66a1.11 1.11 0 01-1.21 1.11 11 11 0 01-4.8-1.7 10.83 10.83 0 01-3.33-3.33A11 11 0 012.96 3.6 1.11 1.11 0 014.07 2.4h1.66a1.11 1.11 0 011.11.96c.07.53.2 1.05.39 1.56a1.11 1.11 0 01-.25 1.17l-.7.7a8.89 8.89 0 003.33 3.33l.7-.7a1.11 1.11 0 011.17-.25c.51.19 1.03.32 1.56.39a1.11 1.11 0 01.96 1.11z" stroke={active ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/>
              </svg>
            )},
          ]).map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all mt-1 first:mt-0"
              style={{
                backgroundColor: tab === item.key ? "var(--th-bg-hover)" : "transparent",
                color: tab === item.key ? "var(--th-tab-active)" : "var(--th-text-secondary)",
              }}
            >
              {item.icon(tab === item.key)}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {tab === "dashboard" && <DashboardView />}
          {tab === "agents" && <AgentsView />}
          {tab === "calls" && <CallsView />}
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Calls Today", value: "142", change: "+12%", icon: "calls" },
          { label: "Calls in Queue", value: "15", change: "", icon: "queue" },
          { label: "Active Agents", value: "8", change: "", icon: "agents" },
          { label: "Avg. Wait Time", value: "2:05", change: "-18%", icon: "time" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 hover:shadow-sm transition-shadow"
            style={{ animation: `fadeIn 0.2s ease-out ${0.05 * i}s both`, backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12px] font-medium" style={{ color: "var(--th-text-muted)" }}>{stat.label}</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ border: "1px solid var(--th-border)" }}>
                {stat.icon === "calls" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="var(--th-text-muted)" strokeWidth="1.5"/></svg>}
                {stat.icon === "queue" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                {stat.icon === "agents" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--th-text-muted)" strokeWidth="1.5"/><path d="M4 20c0-2.67 5.33-4 8-4s8 1.33 8 4" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                {stat.icon === "time" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--th-text-muted)" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[28px] font-semibold leading-none" style={{ color: "var(--th-text-primary)" }}>{stat.value}</span>
              {stat.change && (
                <span className={`text-[12px] font-medium mb-0.5 ${stat.change.startsWith("+") ? "text-[#2CAD43]" : "text-[#3B82F6]"}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Queue Overview + Agents side by side */}
      <div className="grid grid-cols-3 gap-5">
        {/* Queues */}
        <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: "var(--th-text-primary)" }}>Queue Overview</h2>
            <button className="text-sm transition-colors" style={{ color: "var(--th-text-muted)" }}>View all →</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--th-border)" }}>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Queue</th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Waiting</th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Active</th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>Avg. Wait</th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider pb-2.5" style={{ color: "var(--th-text-muted)" }}>SLA %</th>
                <th className="text-right text-[11px] font-semibold uppercase tracking-wider pb-2.5 w-28" style={{ color: "var(--th-text-muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((q) => (
                <tr key={q.name} className="last:border-0 transition-colors group" style={{ borderBottom: "1px solid var(--th-border-light)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td className="py-3 text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{q.name}</td>
                  <td className="py-3 text-center">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-semibold"
                      style={{
                        border: "1px solid var(--th-border)",
                        color: "var(--th-text-primary)",
                      }}
                    >{q.waiting}</span>
                  </td>
                  <td className="py-3 text-center text-[13px]" style={{ color: "var(--th-text-primary)" }}>{q.active}</td>
                  <td className="py-3 text-center text-[13px]" style={{ color: "var(--th-text-muted)" }}>{q.avgWait}</td>
                  <td className="py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--th-border-light)" }}>
                        <div className="h-full rounded-full" style={{ width: `${q.sla}%`, background: "var(--th-text-muted)" }} />
                      </div>
                      <span className="text-[12px] font-medium" style={{ color: "var(--th-text-primary)" }}>{q.sla}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="Hold" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="4" y="3" width="2.5" height="10" rx="1" fill="var(--th-text-muted)"/><rect x="9.5" y="3" width="2.5" height="10" rx="1" fill="var(--th-text-muted)"/></svg>
                      </button>
                      <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="Transfer" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 8h8m0 0l-3-3m3 3l-3 3M3 3v10" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="End" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agents overview on dashboard */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: "var(--th-text-primary)" }}>Agents</h2>
            <button className="text-sm transition-colors" style={{ color: "var(--th-text-muted)" }}>View all →</button>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: "Available", count: agents.filter(a => a.status === "available").length, color: "#2CAD43" },
              { label: "On Call", count: agents.filter(a => a.status === "on-call").length, color: "#3B82F6" },
              { label: "Wrap-up", count: agents.filter(a => a.status === "wrap-up").length, color: "#F59E0B" },
              { label: "Break", count: agents.filter(a => a.status === "break").length, color: "#7F888F" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ border: "1px solid var(--th-border)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[11px] font-medium" style={{ color: "var(--th-text-secondary)" }}>{s.count} {s.label}</span>
              </div>
            ))}
          </div>

          {/* Agent list */}
          <div className="space-y-1.5">
            {agents.slice(0, 6).map((agent, i) => {
              const st = statusConfig[agent.status];
              return (
                <div key={i} className="flex items-center gap-2.5 py-1.5 rounded-lg px-1 -mx-1 transition-colors cursor-pointer" style={{}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div className="relative">
                    <Image src={`https://i.pravatar.cc/64?img=${agent.img}`} alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: st.color, borderColor: "var(--th-bg-card)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate" style={{ color: "var(--th-text-primary)" }}>{agent.name}</div>
                    <div className="text-[10px]" style={{ color: "var(--th-text-muted)" }}>{agent.queue} · {agent.calls} calls</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calls per Hour - bar chart with black + gradient opacity */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold" style={{ color: "var(--th-text-primary)" }}>Calls per Hour</h2>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-primary)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <button className="text-sm flex items-center gap-1 transition-colors" style={{ color: "var(--th-text-muted)" }}>Learn more →</button>
        </div>

        {/* Totals */}
        <div className="flex items-center gap-6 mb-4">
          <div>
            <span className="text-[24px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{hourlyData.reduce((a, d) => a + d.inbound + d.outbound, 0)}</span>
            <span className="text-[12px] ml-1.5" style={{ color: "var(--th-text-muted)" }}>total calls</span>
          </div>
          <div className="h-6 w-px" style={{ backgroundColor: "var(--th-border)" }} />
          <div className="text-[13px]" style={{ color: "var(--th-text-muted)" }}>
            <span className="font-medium" style={{ color: "var(--th-text-primary)" }}>{hourlyData.reduce((a, d) => a + d.inbound, 0)}</span> inbound
          </div>
          <div className="text-[13px]" style={{ color: "var(--th-text-muted)" }}>
            <span className="font-medium" style={{ color: "var(--th-text-secondary)" }}>{hourlyData.reduce((a, d) => a + d.outbound, 0)}</span> outbound
          </div>
          <div className="text-[13px]" style={{ color: "var(--th-text-muted)" }}>
            <span className="font-medium text-[#EF4444]">{hourlyData.reduce((a, d) => a + d.missed, 0)}</span> missed
          </div>
        </div>

        {/* Bar chart with black bars + opacity gradient */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] w-6 pointer-events-none" style={{ color: "var(--th-text-muted)" }}>
            <span>{maxTotal}</span><span>{Math.round(maxTotal * 0.66)}</span><span>{Math.round(maxTotal * 0.33)}</span><span>0</span>
          </div>
          {/* Grid lines */}
          <div className="ml-8 relative">
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ height: i < 3 ? 40 : 0, borderTop: "1px solid var(--th-border-light)" }} />
            ))}
            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-1.5 pb-0">
              {hourlyData.map((d, i) => {
                const inH = (d.inbound / maxTotal) * 120;
                const outH = (d.outbound / maxTotal) * 120;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-stretch gap-px relative cursor-pointer"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                        style={{ animation: "fadeIn 0.15s ease-out" }}
                      >
                        <div className="text-white rounded-lg px-3 py-2.5 shadow-lg whitespace-nowrap text-left min-w-[130px]" style={{ backgroundColor: "var(--th-text-primary)" }}>
                          <div className="text-[11px] font-semibold mb-1.5 text-white/60">{d.hour > 12 ? d.hour - 12 : d.hour}:00 {d.hour >= 12 ? "PM" : "AM"}</div>
                          <div className="flex items-center gap-2 text-[12px] mb-1">
                            <span className="w-2 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.85)" }} />
                            <span className="text-white/70">Inbound</span>
                            <span className="ml-auto font-semibold">{d.inbound}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] mb-1">
                            <span className="w-2 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.5)" }} />
                            <span className="text-white/70">Outbound</span>
                            <span className="ml-auto font-semibold">{d.outbound}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[12px]">
                            <span className="w-2 h-2 rounded-sm bg-[#EF4444]" />
                            <span className="text-white/70">Missed</span>
                            <span className="ml-auto font-semibold">{d.missed}</span>
                          </div>
                        </div>
                        <div className="w-2 h-2 rotate-45 mx-auto -mt-1" style={{ backgroundColor: "var(--th-text-primary)" }} />
                      </div>
                    )}
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${outH}px`,
                        background: hoveredBar === i ? "var(--th-chart-bar-light-hover)" : "var(--th-chart-bar-light)",
                      }}
                    />
                    <div
                      className="w-full rounded-b-sm transition-all"
                      style={{
                        height: `${inH}px`,
                        background: hoveredBar === i ? "var(--th-chart-bar-hover)" : "var(--th-chart-bar)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* X-axis */}
          <div className="flex ml-8 mt-1">
            {hourlyData.map((d, i) => (
              <div key={i} className="flex-1 text-center text-[10px]" style={{ color: "var(--th-text-muted)" }}>{d.hour > 12 ? d.hour - 12 : d.hour}{d.hour >= 12 ? "p" : "a"}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentsView() {
  return (
    <div className="px-6 py-5">
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--th-border)", backgroundColor: "var(--th-bg-hover)" }}>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Agent</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Status</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Queue</th>
              <th className="text-center text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Calls Today</th>
              <th className="text-center text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Avg. Handle</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => {
              const st = statusConfig[agent.status];
              return (
                <tr
                  key={agent.name}
                  className="last:border-0 transition-colors cursor-pointer"
                  style={{ animation: `fadeIn 0.2s ease-out ${0.03 * i}s both`, borderBottom: "1px solid var(--th-border-light)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <Image src={`https://i.pravatar.cc/64?img=${agent.img}`} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" unoptimized />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: st.color, borderColor: "var(--th-bg-card)" }} />
                      </div>
                      <span className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ border: "1px solid var(--th-border)", color: "var(--th-text-secondary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: "var(--th-text-secondary)" }}>{agent.queue}</td>
                  <td className="px-4 py-3 text-center text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{agent.calls}</td>
                  <td className="px-4 py-3 text-center text-[13px]" style={{ color: "var(--th-text-muted)" }}>{agent.avgHandle}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CallsView() {
  return (
    <div className="px-6 py-5">
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--th-border)", backgroundColor: "var(--th-bg-hover)" }}>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Caller</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Agent</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Queue</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Duration</th>
              <th className="text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5" style={{ color: "var(--th-text-muted)" }}>Topic</th>
              <th className="text-center text-[11px] font-semibold uppercase tracking-wider px-4 py-2.5 w-28" style={{ color: "var(--th-text-muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeCalls.map((call, i) => (
              <tr
                key={i}
                className="last:border-0 transition-colors group"
                style={{ animation: `fadeIn 0.2s ease-out ${0.05 * i}s both`, borderBottom: "1px solid var(--th-border-light)" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{call.caller}</td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--th-text-secondary)" }}>{call.agent}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ border: "1px solid var(--th-border)", color: "var(--th-text-secondary)" }}>{call.queue}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-mono" style={{ color: "var(--th-text-primary)" }}>{call.duration}</span>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--th-text-muted)" }}>{call.topic}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="Listen" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7v2a6 6 0 0012 0V7" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round"/><rect x="1" y="7" width="3" height="5" rx="1" stroke="var(--th-text-muted)" strokeWidth="1.3"/><rect x="12" y="7" width="3" height="5" rx="1" stroke="var(--th-text-muted)" strokeWidth="1.3"/></svg>
                    </button>
                    <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="Hold" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="4" y="3" width="2.5" height="10" rx="1" fill="var(--th-text-muted)"/><rect x="9.5" y="3" width="2.5" height="10" rx="1" fill="var(--th-text-muted)"/></svg>
                    </button>
                    <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="Transfer" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 8h8m0 0l-3-3m3 3l-3 3M3 3v10" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="p-1.5 rounded-lg transition-colors active:scale-90" title="End" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Waiting queue */}
      <div className="mt-5 rounded-xl p-5" style={{ backgroundColor: "var(--th-bg-card)", border: "1px solid var(--th-border)" }}>
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--th-text-primary)" }}>Callers Waiting</h2>
        <div className="space-y-2">
          {[
            { number: "+1 (416) 555-1234", queue: "Support", wait: "2:45" },
            { number: "+1 (905) 555-5678", queue: "Support", wait: "1:32" },
            { number: "+1 (647) 555-9012", queue: "Sales", wait: "0:48" },
            { number: "+1 (416) 555-3456", queue: "Technical", wait: "3:15" },
          ].map((caller, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg group transition-colors" style={{ border: "1px solid var(--th-border-light)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--th-text-muted)" }} />
                <span className="text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{caller.number}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ border: "1px solid var(--th-border)", color: "var(--th-text-secondary)" }}>{caller.queue}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono" style={{ color: "var(--th-text-muted)" }}>Waiting {caller.wait}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded transition-colors active:scale-90" title="Answer" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M14 10.67v2a1.33 1.33 0 01-1.45 1.33A13.2 13.2 0 016.8 12a13 13 0 01-4-4 13.2 13.2 0 01-2-5.72A1.33 1.33 0 012.13 1H4.13a1.33 1.33 0 011.34 1.15c.08.64.24 1.27.47 1.87a1.33 1.33 0 01-.3 1.4L4.8 6.27a10.67 10.67 0 004 4l.85-.85a1.33 1.33 0 011.4-.3c.6.23 1.23.39 1.87.47A1.33 1.33 0 0114 10.93z" stroke="var(--th-text-muted)" strokeWidth="1.2"/></svg>
                  </button>
                  <button className="p-1 rounded transition-colors active:scale-90" title="Transfer" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M5 8h8m0 0l-3-3m3 3l-3 3M3 3v10" stroke="var(--th-text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
