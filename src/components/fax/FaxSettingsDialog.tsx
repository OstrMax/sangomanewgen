"use client";

import { useState } from "react";

type Tpl = { id: string; name: string; attention: string; subject: string; message: string; header: boolean; footer: boolean };

const seedTemplates: Tpl[] = [
  { id: "legal", name: "Legal", attention: "Legal Team", subject: "", message: "", header: true, footer: false },
  { id: "medical", name: "Medical", attention: "Records Dept", subject: "", message: "", header: true, footer: false },
];

const defaultCovers = ["Confidential", "Contempo", "Elegant", "Express", "Formal", "Jazzy", "Modern", "Urgent"];

/* `newTemplate` deep-links straight into Cover sheet › Custom template › new,
   so "New template" inside a compose dialog lands on the create form. */
export default function FaxSettingsDialog({ onClose, newTemplate = false }: { onClose: () => void; newTemplate?: boolean }) {
  const [section, setSection] = useState<"alerts" | "cover">(newTemplate ? "cover" : "alerts");

  /* alerts state */
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [email, setEmail] = useState("");
  const [attachPdf, setAttachPdf] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [mobile, setMobile] = useState("");
  const [delivered, setDelivered] = useState(true);
  const [received, setReceived] = useState(true);
  const [failed, setFailed] = useState(false);
  const [sound, setSound] = useState(false);
  const [badge, setBadge] = useState(true);

  /* cover sheet state */
  const [coverTab, setCoverTab] = useState<"default" | "custom">(newTemplate ? "custom" : "default");
  const [defaultCover, setDefaultCover] = useState("Modern");
  const [templates, setTemplates] = useState<Tpl[]>(seedTemplates);
  const [currentId, setCurrentId] = useState<string>(seedTemplates[0].id);
  const [mode, setMode] = useState<"edit" | "new" | "preview">(newTemplate ? "new" : "edit");
  const [draftName, setDraftName] = useState("");
  const [draft, setDraft] = useState<Omit<Tpl, "id" | "name">>(
    newTemplate ? { attention: "", subject: "", message: "", header: true, footer: false } : { attention: "Legal Team", subject: "", message: "", header: true, footer: false },
  );

  const current = templates.find((t) => t.id === currentId);
  const editing = mode === "new" ? { name: draftName, ...draft } : { name: current?.name ?? "", attention: current?.attention ?? "", subject: current?.subject ?? "", message: current?.message ?? "", header: current?.header ?? true, footer: current?.footer ?? false };

  const patch = (p: Partial<Omit<Tpl, "id" | "name">>) => {
    if (mode === "new") setDraft((d) => ({ ...d, ...p }));
    else setTemplates((ts) => ts.map((t) => (t.id === currentId ? { ...t, ...p } : t)));
  };

  const startNew = () => {
    setDraftName("");
    setDraft({ attention: "", subject: "", message: "", header: true, footer: false });
    setMode("new");
  };

  const save = () => {
    if (mode === "new") {
      const name = draftName.trim() || "Untitled template";
      const id = `t${Date.now()}`;
      setTemplates((ts) => [...ts, { id, name, ...draft }]);
      setCurrentId(id);
      setMode("edit");
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div
        className="modal-enter w-[760px] h-[86vh] max-h-[860px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--th-bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] shrink-0 border-b" style={{ borderColor: "var(--th-border)" }}>
          <h2 className="text-[17px] font-bold" style={{ color: "var(--th-text-primary)" }}>Fax settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]" data-tip="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left nav */}
          <div className="w-[190px] shrink-0 border-r py-4 px-3 space-y-1" style={{ borderColor: "var(--th-border)" }}>
            <NavItem
              active={section === "alerts"}
              onClick={() => setSection("alerts")}
              label="Alerts and display"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>}
            />
            <NavItem
              active={section === "cover"}
              onClick={() => setSection("cover")}
              label="Cover sheet"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 overflow-y-auto px-6 py-5">
            {section === "alerts" ? (
              <>
                <SectionHead title="Alerts & Display" sub="Choose how you're notified about faxes and how they're displayed." />

                <GroupHead title="Email alerts" sub="Configure email notifications for incoming faxes" />
                <ToggleRow label="Email me for inbound faxes" sub="Send an email whenever a new fax arrives" on={emailAlerts} onToggle={() => setEmailAlerts((v) => !v)} />
                {emailAlerts && (
                  <NestedField label="Email address" required helper="Fax notifications are delivered to this address.">
                    <IconInput
                      value={email}
                      onChange={setEmail}
                      placeholder="you@company.com"
                      type="email"
                      icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.6"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22 6 12 13 2 6" /></svg>}
                    />
                  </NestedField>
                )}
                <ToggleRow label="Attach the fax as a PDF" sub="Include the received fax as a PDF attachment" on={attachPdf} onToggle={() => setAttachPdf((v) => !v)} />

                <Divider />
                <GroupHead title="Text alerts" sub="Configure SMS notifications for incoming faxes" />
                <ToggleRow label="Text me for inbound faxes" sub="Deliver an SMS whenever a new fax arrives" on={smsAlerts} onToggle={() => setSmsAlerts((v) => !v)} />
                {smsAlerts && (
                  <NestedField label="Mobile number" required helper="SMS alerts are sent to this number. Standard message rates may apply.">
                    <IconInput
                      value={mobile}
                      onChange={setMobile}
                      placeholder="+1 (555) 000-0000"
                      icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.6"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.2 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>}
                    />
                  </NestedField>
                )}

                <Divider />
                <GroupHead title="In-app notifications" sub="Control alerts shown while you're using the app" />
                <ToggleRow label="Delivered fax popups" sub="Show when an outbound fax has been delivered" on={delivered} onToggle={() => setDelivered((v) => !v)} divided />
                <ToggleRow label="Received fax popups" sub="Show when a new fax arrives in your inbox" on={received} onToggle={() => setReceived((v) => !v)} divided />
                <ToggleRow label="Failed fax popups" sub="Show when an outbound fax fails to deliver" on={failed} onToggle={() => setFailed((v) => !v)} divided />
                <ToggleRow label="Play a sound for new faxes" sub="Play a short chime when a fax arrives" on={sound} onToggle={() => setSound((v) => !v)} divided />
                <ToggleRow label="Show unread badge count" sub="Display the number of unread faxes on the Fax tab" on={badge} onToggle={() => setBadge((v) => !v)} divided />
              </>
            ) : (
              <>
                <SectionHead title="Cover sheet" sub="Choose or edit your cover sheets" />

                {mode !== "preview" && (
                  <div className="flex items-center gap-6 border-b mb-5" style={{ borderColor: "var(--th-border)" }}>
                    {([["default", "Default cover"], ["custom", "Custom template"]] as const).map(([id, label]) => (
                      <button key={id} onClick={() => setCoverTab(id)} className="pb-2.5 text-[14px] font-semibold transition-colors relative" style={{ color: coverTab === id ? "var(--th-text-primary)" : "var(--th-text-muted)" }}>
                        {label}
                        {coverTab === id && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "#142B53" }} />}
                      </button>
                    ))}
                  </div>
                )}

                {mode === "preview" ? (
                  <CoverPreview name={editing.name || draftName} attention={editing.attention} subject={editing.subject} message={editing.message} />
                ) : coverTab === "default" ? (
                  <div className="grid grid-cols-3 gap-4">
                    {defaultCovers.map((name) => {
                      const selected = defaultCover === name;
                      return (
                        <button
                          key={name}
                          onClick={() => setDefaultCover(name)}
                          className="rounded-xl p-3 transition-all text-left group"
                          style={{ border: selected ? "2px solid #142B53" : "1px solid var(--th-border)", backgroundColor: "var(--th-bg-card)" }}
                        >
                          <div className="relative rounded-lg overflow-hidden mb-2.5" style={{ border: "1px solid var(--th-border)", backgroundColor: "#fff" }}>
                            <CoverThumb variant={name} />
                            <span
                              className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all"
                              style={{ backgroundColor: selected ? "#142B53" : "rgba(255,255,255,0.9)", border: selected ? "none" : "1px solid #CCCFD2" }}
                            >
                              {selected && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                            </span>
                          </div>
                          <div className="text-[13px] font-semibold text-center" style={{ color: "var(--th-text-primary)" }}>{name}</div>
                        </button>
                      );
                    })}
                  </div>
                ) : templates.length === 0 && mode !== "new" ? (
                  <div className="flex flex-col items-center justify-center text-center py-14">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                    </div>
                    <p className="text-[14px] font-bold" style={{ color: "var(--th-text-primary)" }}>No custom templates yet</p>
                    <p className="text-[12px] leading-relaxed mt-1.5 max-w-[330px]" style={{ color: "var(--th-text-muted)" }}>
                      Create a cover sheet with your own logo, header &amp; footer images, and a saved message. It&apos;ll show up here and in the &ldquo;Default cover&rdquo; tab.
                    </p>
                    <button onClick={startNew} className="btn-primary mt-5 px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ backgroundColor: "#142B53", color: "#fff" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Create custom template
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mode === "new" ? (
                      <>
                        <p className="text-[13px] font-bold" style={{ color: "var(--th-text-primary)" }}>New custom template</p>
                        <Field label="Template name">
                          <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g. Cover for legal" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={inputStyle} />
                        </Field>
                      </>
                    ) : (
                      <Field label="Template" hint="(choose one)">
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex-1">
                            <select value={currentId} onChange={(e) => setCurrentId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none appearance-none cursor-pointer" style={inputStyle}>
                              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                          </div>
                          <button onClick={startNew} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold shrink-0 transition-colors" style={{ border: "1px solid var(--th-border)", color: "var(--th-text-primary)" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            New
                          </button>
                        </div>
                      </Field>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[13px] font-bold mb-1.5" style={{ color: "var(--th-text-primary)" }}>Header image</p>
                        <ImageSlot filled={editing.header} onToggle={() => patch({ header: !editing.header })} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold mb-1.5" style={{ color: "var(--th-text-primary)" }}>Footer image (PNG/JPG)</p>
                        <ImageSlot filled={editing.footer} onToggle={() => patch({ footer: !editing.footer })} />
                      </div>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>
                      <span className="font-bold" style={{ color: "var(--th-text-primary)" }}>Please note:</span> (Header and footer images must be 1500px x 500px max, PNG/JPG only)
                    </p>

                    <Field label="Attention">
                      <input value={editing.attention} onChange={(e) => patch({ attention: e.target.value })} placeholder="Who is this for?" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={inputStyle} />
                    </Field>
                    <Field label="Subject">
                      <input value={editing.subject} onChange={(e) => patch({ subject: e.target.value })} placeholder="Write a subject here" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={inputStyle} />
                    </Field>
                    <Field label="Message">
                      <textarea value={editing.message} onChange={(e) => patch({ message: e.target.value })} rows={3} placeholder="Write a short message for the cover sheet…" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none resize-none placeholder:text-[#9AA3AB]" style={inputStyle} />
                    </Field>

                    <button onClick={() => setMode("preview")} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      Preview cover sheet
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-hover)" }}>
          <span className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>
            {section === "cover" && coverTab === "default" && mode !== "preview" && (
              <>Default cover sheet: <span className="font-bold" style={{ color: "var(--th-text-primary)" }}>{defaultCover}</span></>
            )}
          </span>
          {mode === "preview" ? (
            <button onClick={() => setMode(templates.some((t) => t.id === currentId) && draftName === "" ? "edit" : "new")} className="btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "#142B53", color: "#fff" }}>Back to edit</button>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
              <button onClick={save} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "#142B53", color: "#fff" }}>Save</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--th-bg)",
  border: "1px solid var(--th-border)",
  color: "var(--th-text-primary)",
};

function NavItem({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors"
      style={{ backgroundColor: active ? "var(--th-icon-active-bg)" : "transparent", color: active ? "var(--th-text-primary)" : "var(--th-text-secondary)" }}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="pb-4 mb-5 border-b" style={{ borderColor: "var(--th-border)" }}>
      <h3 className="text-[19px] font-bold" style={{ color: "var(--th-text-primary)" }}>{title}</h3>
      <p className="text-[13px] mt-1" style={{ color: "var(--th-text-secondary)" }}>{sub}</p>
    </div>
  );
}

function GroupHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-3">
      <p className="text-[14px] font-bold" style={{ color: "var(--th-text-primary)" }}>{title}</p>
      <p className="text-[13px] mt-0.5" style={{ color: "var(--th-text-secondary)" }}>{sub}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-6 border-t" style={{ borderColor: "var(--th-border)" }} />;
}

function ToggleRow({ label, sub, on, onToggle, divided }: { label: string; sub: string; on: boolean; onToggle: () => void; divided?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={divided ? { borderTop: "1px solid var(--th-border)" } : undefined}>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{sub}</p>
      </div>
      <Switch on={on} onToggle={onToggle} />
    </div>
  );
}

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="relative w-11 h-6 rounded-full transition-colors shrink-0" style={{ backgroundColor: on ? "#142B53" : "#CCCFD2" }} aria-pressed={on}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: on ? "22px" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

function NestedField({ label, required, helper, children }: { label: string; required?: boolean; helper: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 mb-1" style={{ backgroundColor: "var(--th-bg-hover)", border: "1px solid var(--th-border)" }}>
      <p className="text-[12px] font-bold mb-1.5" style={{ color: "var(--th-text-primary)" }}>
        {required && <span style={{ color: "#EF4444" }}>* </span>}{label}
      </p>
      {children}
      <p className="text-[11px] mt-1.5" style={{ color: "var(--th-text-muted)" }}>{helper}</p>
    </div>
  );
}

function IconInput({ value, onChange, placeholder, icon, type = "text" }: { value: string; onChange: (v: string) => void; placeholder: string; icon: React.ReactNode; type?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">{icon}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={{ ...inputStyle, backgroundColor: "var(--th-bg-card)" }} />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[13px] font-bold mb-1.5" style={{ color: "var(--th-text-primary)" }}>
        {label}{hint && <span className="font-normal ml-1" style={{ color: "var(--th-text-muted)" }}>{hint}</span>}
      </p>
      {children}
    </div>
  );
}

function ImageSlot({ filled, onToggle }: { filled: boolean; onToggle: () => void }) {
  if (filled) {
    return (
      <div className="rounded-xl flex flex-col items-center justify-center gap-2 h-[68px]" style={{ backgroundColor: "var(--th-bg-hover)", border: "1px solid var(--th-border)" }}>
        <span className="px-2.5 py-1 rounded text-[9px] font-bold tracking-wider text-white" style={{ backgroundColor: "#3C4650" }}>SANGOMA</span>
        <button onClick={onToggle} className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--th-text-secondary)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
          Replace
        </button>
      </div>
    );
  }
  return (
    <button onClick={onToggle} className="w-full rounded-xl flex flex-col items-center justify-center gap-1 h-[68px] border-2 border-dashed transition-colors" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg)" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
      <span className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>Click to upload</span>
    </button>
  );
}

/* Abstract skeleton thumbnails for the built-in cover designs */
function CoverThumb({ variant }: { variant: string }) {
  const bar = (w: string, dark?: boolean) => (
    <div className="h-[3px] rounded-full" style={{ width: w, backgroundColor: dark ? "#3C4650" : "#D5D8DC" }} />
  );
  return (
    <div className="w-full aspect-[3/4] p-3 flex flex-col gap-1.5" style={{ backgroundColor: "#fff" }}>
      {variant === "Confidential" && (
        <>
          <div className="flex flex-col gap-1">{bar("55%")}{bar("35%")}</div>
          <div className="flex-1 border border-dashed rounded mt-1 flex items-center justify-center" style={{ borderColor: "#D5D8DC" }}>
            <span className="text-[5px] tracking-[1px] font-semibold" style={{ color: "#9AA3AB" }}>CONFIDENTIAL</span>
          </div>
        </>
      )}
      {variant === "Contempo" && (
        <>
          <div className="flex gap-1.5 items-start"><div className="w-[38%] h-3 rounded-sm" style={{ backgroundColor: "#22262B" }} /><div className="flex-1 flex flex-col gap-1 pt-0.5">{bar("100%")}{bar("70%")}</div></div>
          <div className="flex flex-col gap-1 mt-1">{bar("80%")}{bar("60%")}</div>
          <div className="flex-1" />
        </>
      )}
      {variant === "Elegant" && (
        <>
          <div className="flex flex-col gap-1 items-end">{bar("45%")}{bar("70%")}</div>
          <div className="flex flex-col gap-1 mt-1">{bar("100%")}{bar("90%")}{bar("75%")}</div>
          <div className="flex-1" />
        </>
      )}
      {variant === "Express" && (
        <>
          <div className="flex items-center justify-between"><div className="flex flex-col gap-1 w-[55%]">{bar("100%")}{bar("60%")}</div><span className="text-[7px] font-bold" style={{ color: "#22262B" }}>FAX</span></div>
          <div className="flex-1 border rounded mt-1" style={{ borderColor: "#D5D8DC" }} />
        </>
      )}
      {variant === "Formal" && (
        <>
          <div className="text-[4px] tracking-[0.5px] text-center font-semibold" style={{ color: "#3C4650" }}>FACSIMILE TRANSMISSION</div>
          <div className="flex flex-col gap-1 items-center">{bar("60%")}{bar("40%")}</div>
          <div className="flex-1 border rounded mt-1" style={{ borderColor: "#D5D8DC" }} />
          <div className="flex justify-center">{bar("30%")}</div>
        </>
      )}
      {variant === "Jazzy" && (
        <>
          <div className="flex items-start gap-1.5"><span className="text-[8px] font-extrabold leading-none" style={{ color: "#22262B" }}>FAX</span><div className="flex-1 flex flex-col gap-1">{bar("100%")}{bar("80%")}</div></div>
          <div className="flex flex-col gap-1 mt-1">{bar("90%")}{bar("65%")}</div>
          <div className="flex-1" />
        </>
      )}
      {variant === "Modern" && (
        <>
          <div className="flex flex-col gap-1">{bar("70%", true)}{bar("50%")}</div>
          <div className="flex flex-col gap-1 mt-1.5">{bar("100%")}{bar("85%")}{bar("60%")}</div>
          <div className="flex-1" />
        </>
      )}
      {variant === "Urgent" && (
        <>
          <div className="text-[4px] tracking-[0.5px] text-center font-bold py-0.5 rounded-sm" style={{ backgroundColor: "#F2F3F5", color: "#3C4650" }}>URGENT FAX MESSAGE</div>
          <div className="flex flex-col gap-1 mt-0.5">{bar("85%")}{bar("65%")}</div>
          <div className="flex-1 border rounded mt-1" style={{ borderColor: "#D5D8DC" }} />
        </>
      )}
    </div>
  );
}

function CoverPreview({ name, attention, subject, message }: { name: string; attention: string; subject: string; message: string }) {
  return (
    <div className="rounded-xl mx-auto max-w-[420px] p-10" style={{ backgroundColor: "#fff", border: "1px solid var(--th-border)", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-3 pb-8">
        <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider text-white" style={{ backgroundColor: "#22262B" }}>SANGOMA</span>
        <span className="text-[11px]" style={{ color: "#3C4650" }}>Scalable Cloud Communications</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 text-[9px] border-t border-b py-2" style={{ borderColor: "#22262B", color: "#22262B" }}>
        <PreviewRow k="From:" v="(555) 555-5555" />
        <PreviewRow k="To:" v="(555) 555-5555" />
        <PreviewRow k="Sender:" v="Billing Folks" />
        <PreviewRow k="Attention:" v={attention || "—"} />
        <PreviewRow k="Company:" v="EasyGoing Inc." />
        <PreviewRow k="Date:" v="10/21/2015" />
        <PreviewRow k="Subject:" v={subject || name || "—"} />
        <PreviewRow k="Pages:" v="1" />
      </div>
      <div className="mt-2 text-[9px]" style={{ color: "#22262B" }}>
        <p className="font-bold">Message:</p>
        <p className="mt-1 pl-3">{message || "Your payment is due in 5 days"}</p>
      </div>
      <div className="flex items-center gap-3 pt-16">
        <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider text-white" style={{ backgroundColor: "#22262B" }}>SANGOMA</span>
        <span className="text-[11px]" style={{ color: "#3C4650" }}>Scalable Cloud Communications</span>
      </div>
    </div>
  );
}

function PreviewRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="font-bold w-[52px] shrink-0">{k}</span>
      <span className="truncate">{v}</span>
    </div>
  );
}
