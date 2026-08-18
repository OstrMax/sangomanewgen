"use client";

import { useState } from "react";

/* A template is just the reusable *stationery* — its name and its header /
   footer artwork.  The per-fax wording (attention, subject, message) is typed
   in the send dialog, because it changes with every fax. */
type Tpl = { id: string; name: string; header: boolean; footer: boolean };

const seedTemplates: Tpl[] = [
  { id: "legal", name: "Cover for legal", header: true, footer: false },
  { id: "medical", name: "Cover for medical", header: true, footer: true },
];

/* `openTemplate` names the cover sheet a fax dialog wants opened, landing the
   user on that exact template — adding another is the "+ New" button already
   sitting beside it, so one link covers both jobs.  `returnTo` names the dialog
   waiting underneath ("New fax"), which adds the breadcrumb back to it and
   turns Save into a save-and-go-back. */
export default function FaxSettingsDialog({ onClose, openTemplate, returnTo }: { onClose: () => void; openTemplate?: string; returnTo?: string }) {
  const [section, setSection] = useState<"alerts" | "cover">(openTemplate ? "cover" : "alerts");

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
  const [templates, setTemplates] = useState<Tpl[]>(seedTemplates);
  const [currentId, setCurrentId] = useState<string>(seedTemplates.find((t) => t.name === openTemplate)?.id ?? seedTemplates[0].id);
  const [mode, setMode] = useState<"edit" | "new">("edit");
  /* Previewing sits *on top of* whichever mode you were in, so backing out of it
     returns to the same template — a saved one or the draft you were writing. */
  const [previewing, setPreviewing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draft, setDraft] = useState<Omit<Tpl, "id" | "name">>({ header: false, footer: false });

  const current = templates.find((t) => t.id === currentId);

  /* Only the deep-linked dialog gets a task-specific title — opened from the
     gear it is just the settings screen. */
  const headerTitle = !openTemplate ? "Fax settings" : previewing ? "Cover sheet preview" : mode === "new" ? "New custom template" : `Edit “${current?.name ?? "template"}”`;

  const editing = mode === "new" ? { name: draftName, ...draft } : { name: current?.name ?? "", header: current?.header ?? true, footer: current?.footer ?? false };
  /* One piece of artwork is already worth looking at — only a completely empty
     sheet has nothing to show. */
  const canPreview = editing.header || editing.footer;

  const patch = (p: Partial<Omit<Tpl, "id" | "name">>) => {
    if (mode === "new") setDraft((d) => ({ ...d, ...p }));
    else setTemplates((ts) => ts.map((t) => (t.id === currentId ? { ...t, ...p } : t)));
  };

  const startNew = () => {
    setDraftName("");
    setDraft({ header: false, footer: false });
    setPreviewing(false);
    setMode("new");
  };

  /* Dropping a template falls back to whatever is left; emptying the list drops
     the screen into its own empty state, which offers to create the first one. */
  const remove = () => {
    const rest = templates.filter((t) => t.id !== currentId);
    setTemplates(rest);
    if (rest.length) setCurrentId(rest[0].id);
  };

  const save = () => {
    if (mode === "new") {
      const name = draftName.trim() || "Untitled template";
      const id = `t${Date.now()}`;
      setTemplates((ts) => [...ts, { id, name, ...draft }]);
      setCurrentId(id);
      setMode("edit");
      /* Came from a half-written fax — hand control straight back to it. */
      if (returnTo) onClose();
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
        {/* Header — a fax waiting underneath gets a back link above the title,
            since there is only one way out of this detour. */}
        <div className={`flex justify-between px-6 shrink-0 border-b ${returnTo ? "py-3" : "h-[60px] items-center"}`} style={{ borderColor: "var(--th-border)" }}>
          <div className="min-w-0">
            {returnTo && (
              <button onClick={onClose} className="flex items-center gap-1 mb-0.5 text-[12px] font-semibold transition-opacity hover:opacity-70 hover:underline underline-offset-2" style={{ color: "#142B53" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 18 5 12 11 6" /></svg>
                Back to {returnTo.toLowerCase()}
              </button>
            )}
            <h2 className="text-[17px] font-bold truncate" style={{ color: "var(--th-text-primary)" }}>{headerTitle}</h2>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)] ${returnTo ? "self-start" : ""}`} data-tip={returnTo ? `Back to ${returnTo.toLowerCase()}` : "Close"}>
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
                <SectionHead title="Cover sheet" sub="Choose or edit your custom cover sheets" />

                {previewing ? (
                  <CoverPreview name={editing.name} header={editing.header} footer={editing.footer} />
                ) : templates.length === 0 && mode !== "new" ? (
                  <div className="flex flex-col items-center justify-center text-center py-14">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                    </div>
                    <p className="text-[14px] font-bold" style={{ color: "var(--th-text-primary)" }}>No custom templates yet</p>
                    <p className="text-[12px] leading-relaxed mt-1.5 max-w-[330px]" style={{ color: "var(--th-text-muted)" }}>
                      Create a cover sheet with your own header &amp; footer artwork. It&apos;ll show up here and under &ldquo;Custom template&rdquo; whenever you send or forward a fax.
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
                        {/* Back out of authoring only once there is a list to go
                            back to — on a first template it would lead nowhere.
                            A quiet text link above the title, matching the one in
                            the dialog header, so it reads as navigation. */}
                        <div className="space-y-1.5">
                          {templates.length > 0 && (
                            <button
                              onClick={() => setMode("edit")}
                              className="flex items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-70 hover:underline underline-offset-2"
                              style={{ color: "#142B53" }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 18 5 12 11 6" /></svg>
                              Back to my templates
                            </button>
                          )}
                          <p className="text-[15px] font-bold" style={{ color: "var(--th-text-primary)" }}>New custom template</p>
                        </div>
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
                          <button onClick={startNew} className="flex items-center gap-1 px-3 h-[42px] rounded-lg text-[12px] font-bold uppercase tracking-wider shrink-0 transition-colors hover:bg-[var(--th-bg-hover)]" style={{ color: "#142B53" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add new
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

                    {/* An empty sheet has nothing to preview, so the button stays
                        out of reach and says what is missing. */}
                    <div>
                      <button
                        onClick={() => setPreviewing(true)}
                        disabled={!canPreview}
                        data-tip={canPreview ? undefined : "Upload a header or footer image first"}
                        className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold border border-dashed transition-colors ${canPreview ? "hover:opacity-80" : "cursor-not-allowed"}`}
                        style={{ backgroundColor: "var(--th-bg-hover)", borderColor: "var(--th-border)", color: canPreview ? "var(--th-text-primary)" : "var(--th-text-muted)", opacity: canPreview ? 1 : 0.6 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        Preview cover sheet
                      </button>
                      {!canPreview && (
                        <p className="text-[11px] mt-1.5 text-center" style={{ color: "var(--th-text-muted)" }}>
                          Add a header or footer image to preview this cover sheet.
                        </p>
                      )}
                    </div>

                    {/* Only an existing template can be deleted — in create mode
                        there is nothing saved yet, and Cancel already backs out. */}
                    {mode === "edit" && (
                      <button onClick={remove} className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold border border-dashed transition-colors hover:opacity-80" style={{ backgroundColor: "var(--th-bg-hover)", borderColor: "var(--th-border)", color: "#C70816" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                        Delete cover sheet
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-hover)" }}>
          {previewing ? (
            <button onClick={() => setPreviewing(false)} className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider transition-opacity hover:opacity-70" style={{ color: "var(--th-text-secondary)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 18 5 12 11 6" /></svg>
              Back to edit
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
              <button onClick={save} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "#142B53", color: "#fff" }}>
                {returnTo ? "Save & return" : "Save"}
              </button>
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

/* The stationery, filled with sample wording — the real attention, subject and
   message are typed per fax in the send dialog, so they can only be stand-ins
   here. */
function CoverPreview({ name, header, footer }: { name: string; header: boolean; footer: boolean }) {
  return (
    <div className="rounded-xl mx-auto max-w-[420px] p-10" style={{ backgroundColor: "#fff", border: "1px solid var(--th-border)", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
      {/* Only the artwork that was actually uploaded shows up, so the preview
          never promises a band that won't be printed. */}
      {header ? <PreviewBand className="pb-8" /> : <div className="pb-4" />}
      <div className="grid grid-cols-2 gap-x-4 text-[9px] border-t border-b py-2" style={{ borderColor: "#22262B", color: "#22262B" }}>
        <PreviewRow k="From:" v="(555) 555-5555" />
        <PreviewRow k="To:" v="(555) 555-5555" />
        <PreviewRow k="Sender:" v="Billing Folks" />
        <PreviewRow k="Attention:" v="Legal Team" />
        <PreviewRow k="Company:" v="EasyGoing Inc." />
        <PreviewRow k="Date:" v="10/21/2015" />
        <PreviewRow k="Subject:" v={name || "—"} />
        <PreviewRow k="Pages:" v="1" />
      </div>
      <div className="mt-2 text-[9px]" style={{ color: "#22262B" }}>
        <p className="font-bold">Message:</p>
        <p className="mt-1 pl-3">Your payment is due in 5 days</p>
      </div>
      {footer ? <PreviewBand className="pt-16" /> : <div className="pt-10" />}
    </div>
  );
}

function PreviewBand({ className }: { className: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider text-white" style={{ backgroundColor: "#22262B" }}>SANGOMA</span>
      <span className="text-[11px]" style={{ color: "#3C4650" }}>Scalable Cloud Communications</span>
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
