"use client";

import { useState } from "react";

const inputStyle = { border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" } as const;

export default function FaxSettingsDialog({ onClose, onSave }: { onClose: () => void; onSave?: () => void }) {
  const [s, setS] = useState({ email: true, pdf: true, sms: false, deliveredPop: true, receivedPop: true, failedPop: false, sound: false, badge: true });
  const [limit, setLimit] = useState("99");
  const set = (k: keyof typeof s) => setS({ ...s, [k]: !s[k] });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="modal-enter rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]" style={{ backgroundColor: "var(--th-bg-card)", width: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--th-border)" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--th-text-primary)" }}>Fax settings</h2>
          <button onClick={onClose} className="btn-icon p-1 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          <h3 className="text-[16px] font-bold" style={{ color: "var(--th-text-primary)" }}>Alerts &amp; Display</h3>
          <p className="text-[13px] mb-5" style={{ color: "var(--th-text-secondary)" }}>Choose how you&apos;re notified about faxes and how they&apos;re displayed.</p>

          <SettingsGroup title="Email alerts" desc="Configure email notifications for incoming faxes">
            <SettingRow title="Email me for inbound faxes" desc="Send an email whenever a new fax arrives" on={s.email} onToggle={() => set("email")} />
            <SettingRow title="Attach the fax as a PDF" desc="Include the received fax as a PDF attachment" on={s.pdf} onToggle={() => set("pdf")} />
          </SettingsGroup>

          <SettingsGroup title="Text alerts" desc="Configure SMS notifications for incoming faxes">
            <SettingRow title="Text me for inbound faxes" desc="Deliver an SMS whenever a new fax arrives" on={s.sms} onToggle={() => set("sms")} />
          </SettingsGroup>

          <SettingsGroup title="In-app notifications" desc="Control alerts shown while you're using the app">
            <SettingRow title="Delivered fax popups" desc="Show when an outbound fax has been delivered" on={s.deliveredPop} onToggle={() => set("deliveredPop")} />
            <SettingRow title="Received fax popups" desc="Show when a new fax arrives in your inbox" on={s.receivedPop} onToggle={() => set("receivedPop")} />
            <SettingRow title="Failed fax popups" desc="Show when an outbound fax fails to deliver" on={s.failedPop} onToggle={() => set("failedPop")} />
            <SettingRow title="Play a sound for new faxes" desc="Play a chime when a new fax arrives" on={s.sound} onToggle={() => set("sound")} />
            <SettingRow title="Show unread badge count" desc="Display the number of unread faxes on the tab" on={s.badge} onToggle={() => set("badge")} />
          </SettingsGroup>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-[14px] font-bold" style={{ color: "var(--th-text-primary)" }}>Fax display limit</div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--th-text-secondary)" }}>Maximum number of faxes shown in your inbox (max 99)</div>
            </div>
            <input value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, "").slice(0, 2))} className="w-24 px-4 py-2.5 rounded-xl text-[14px] outline-none text-center" style={{ ...inputStyle, borderColor: "#142B53" }} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
          <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
          <button onClick={() => (onSave ? onSave() : onClose())} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="pb-5 mb-5 border-b" style={{ borderColor: "var(--th-border)" }}>
      <div className="text-[14px] font-bold" style={{ color: "var(--th-text-primary)" }}>{title}</div>
      <div className="text-[12px] mb-3" style={{ color: "var(--th-text-secondary)" }}>{desc}</div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function SettingRow({ title, desc, on, onToggle }: { title: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{title}</div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{desc}</div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ backgroundColor: on ? "#142B53" : "#CCCFD2" }}>
      <div className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all" style={{ left: on ? "auto" : "3px", right: on ? "3px" : "auto" }} />
    </button>
  );
}
