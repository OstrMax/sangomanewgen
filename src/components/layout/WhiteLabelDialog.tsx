"use client";

import { useEffect, useState, useRef } from "react";
import { useWhiteLabel, DEFAULT_WHITE_LABEL, type SidebarStyle } from "@/contexts/WhiteLabelContext";
import { asset } from "@/lib/asset";

interface Preset {
  name: string;
  brandColor: string;
}

const PRESETS: Preset[] = [
  { name: "Sangoma", brandColor: "#2a1051" },
  { name: "Indigo",  brandColor: "#4338CA" },
  { name: "Ocean",   brandColor: "#0E7490" },
  { name: "Emerald", brandColor: "#047857" },
  { name: "Sunset",  brandColor: "#C2410C" },
  { name: "Crimson", brandColor: "#9F1239" },
  { name: "Slate",   brandColor: "#1E293B" },
  { name: "Graphite",brandColor: "#27272A" },
];

export default function WhiteLabelDialog({ onClose }: { onClose: () => void }) {
  const { config, setConfig, resetConfig } = useWhiteLabel();
  const [draft, setDraft] = useState(config);

  // Reflect external config updates while dialog is open (e.g. live preview applied via setConfig)
  useEffect(() => { setDraft(config); }, [config]);

  // Apply each draft change immediately for live preview, persist on Save
  const update = (patch: Partial<typeof draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setConfig(next);
  };

  const handleSave = () => {
    setConfig(draft);
    onClose();
  };

  const handleCancel = () => {
    // Restore the original config snapshot we had on open
    setConfig(snapshot.current);
    onClose();
  };

  const handleReset = () => {
    resetConfig();
    setDraft(DEFAULT_WHITE_LABEL);
  };

  const snapshot = useRef(config);
  // Snapshot only on first mount
  useEffect(() => { snapshot.current = config; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const styleOptions: { value: SidebarStyle; label: string }[] = [
    { value: "gradient", label: "Gradient" },
    { value: "solid",    label: "Solid" },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={handleCancel}>
      <div className="modal-enter w-[600px] max-h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "var(--th-bg-card)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--th-text-primary)" }}>Branding & theme</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>White-label the app — changes apply live</p>
          </div>
          <button onClick={handleCancel} className="btn-icon p-1.5 rounded-lg" data-tip="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2 space-y-6">
          {/* Brand color presets */}
          <section>
            <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--th-text-primary)" }}>Brand color</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESETS.map((p) => {
                const isActive = draft.brandColor.toLowerCase() === p.brandColor.toLowerCase();
                return (
                  <button
                    key={p.name}
                    onClick={() => update({ brandColor: p.brandColor })}
                    className="card-lift flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium text-left transition-all"
                    style={{
                      backgroundColor: "var(--th-bg-card)",
                      border: isActive ? `2px solid ${p.brandColor}` : "1px solid var(--th-border)",
                      color: "var(--th-text-primary)",
                    }}
                  >
                    <span className="w-5 h-5 rounded-full shrink-0 ring-1 ring-black/5" style={{ backgroundColor: p.brandColor }} />
                    {p.name}
                  </button>
                );
              })}
            </div>
            {/* Custom color */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer" style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)" }}>
                <input
                  type="color"
                  value={draft.brandColor}
                  onChange={(e) => update({ brandColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-none p-0"
                  style={{ background: "transparent" }}
                />
                <span className="text-[12px] font-medium" style={{ color: "var(--th-text-primary)" }}>Custom</span>
              </label>
              <input
                type="text"
                value={draft.brandColor}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update({ brandColor: v });
                }}
                onBlur={(e) => {
                  if (!/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                    update({ brandColor: snapshot.current.brandColor });
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl text-[13px] font-mono outline-none"
                style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }}
              />
            </div>
          </section>

          {/* Sidebar style */}
          <section>
            <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--th-text-primary)" }}>Sidebar style</label>
            <div className="flex items-center rounded-xl p-1" style={{ backgroundColor: "var(--th-bg-hover)" }}>
              {styleOptions.map((opt) => {
                const isActive = draft.sidebarStyle === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => update({ sidebarStyle: opt.value })}
                    className="flex-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--th-bg-card)" : "transparent",
                      color: isActive ? "var(--th-text-primary)" : "var(--th-text-secondary)",
                      boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* App name */}
          <section>
            <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--th-text-primary)" }}>App name</label>
            <input
              type="text"
              value={draft.appName}
              onChange={(e) => update({ appName: e.target.value })}
              maxLength={32}
              placeholder="TeamHub"
              className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none"
              style={{ border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" }}
            />
            <p className="text-[11px] mt-1" style={{ color: "var(--th-text-muted)" }}>Shown in the topbar next to the logo · max 32 characters</p>
          </section>

          {/* Live preview */}
          <section>
            <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--th-text-primary)" }}>Preview</label>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--th-border)" }}>
              {/* Mock topbar */}
              <div className="h-9 flex items-center justify-center gap-2" style={{ backgroundColor: draft.brandColor }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/icons/logo.png")} alt="" width={16} height={11} style={{ objectFit: "contain" }} />
                <span className="text-white/90 text-[12px] font-normal tracking-[0.3px]">{draft.appName}</span>
              </div>
              {/* Mock body */}
              <div className="flex h-32">
                <div
                  className="w-12 shrink-0"
                  style={{
                    background: draft.sidebarStyle === "gradient"
                      ? `linear-gradient(180deg, ${shade(draft.brandColor, -0.1)} 0%, ${draft.brandColor} 33%, ${shade(draft.brandColor, 0.05)} 64.5%, ${shade(draft.brandColor, 0.4)} 100%)`
                      : draft.sidebarSolidColor,
                  }}
                />
                <div className="flex-1 p-3" style={{ backgroundColor: "var(--th-bg)" }}>
                  <div className="text-[12px] font-semibold mb-1.5" style={{ color: "var(--th-text-primary)" }}>Sample heading</div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-md text-[11px] font-medium text-white" style={{ backgroundColor: draft.brandColor }}>Action</button>
                    <span className="text-[11px]" style={{ color: draft.brandColor, fontWeight: 600 }}>Link style</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--th-border)" }}>
          <button onClick={handleReset} className="text-[13px] font-medium transition-colors" style={{ color: "var(--th-text-secondary)" }}>
            Reset to default
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleCancel} className="px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors" style={{ color: "var(--th-text-secondary)" }}>
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: draft.brandColor }}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Local helper that mirrors the lighten/darken used in the context — keeps the
   dialog's mini preview in sync with the actual sidebar gradient. */
function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const v = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return hex;
  const num = parseInt(v, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const adjust = (n: number) => amount >= 0
    ? Math.round(n + (255 - n) * amount)
    : Math.round(n * (1 + amount));
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}
