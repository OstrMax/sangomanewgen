"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type SidebarStyle = "gradient" | "solid";

export interface WhiteLabelConfig {
  brandColor: string;     // primary accent (#2a1051 default)
  appName: string;        // displayed in topbar (TeamHub default)
  logoUrl: string;        // /icons/logo.png default
  sidebarStyle: SidebarStyle;
  sidebarSolidColor: string; // used when sidebarStyle === "solid"
}

export const DEFAULT_WHITE_LABEL: WhiteLabelConfig = {
  brandColor: "#2a1051",
  appName: "TeamHub",
  logoUrl: "/icons/logo.png",
  sidebarStyle: "gradient",
  sidebarSolidColor: "#2a1051",
};

const STORAGE_KEY = "th-white-label";

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  setConfig: (patch: Partial<WhiteLabelConfig>) => void;
  resetConfig: () => void;
}

const WhiteLabelContext = createContext<WhiteLabelContextType>({
  config: DEFAULT_WHITE_LABEL,
  setConfig: () => {},
  resetConfig: () => {},
});

/* ── Color helpers ── */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(value, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* List of all the document-level CSS custom properties that white-labeling
   may override. Used to clear them when reverting to the default brand
   so the CSS file defaults (including the original purple→magenta sidebar
   gradient) take effect again. */
const OVERRIDE_VARS = [
  "--th-tab-active",
  "--th-active-conv-border",
  "--th-shell-bg",
  "--th-topbar-bg",
  "--th-sidebar-active",
  "--th-sidebar-badge-border",
  "--th-walkthrough-bg",
  "--th-status-dot-border",
  "--th-quick-actions-bg",
];

/* ── Apply config to document root ── */
function applyToDocument(config: WhiteLabelConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const c = config.brandColor;

  const isDefault =
    c.toLowerCase() === DEFAULT_WHITE_LABEL.brandColor.toLowerCase() &&
    config.sidebarStyle === DEFAULT_WHITE_LABEL.sidebarStyle &&
    config.sidebarSolidColor.toLowerCase() === DEFAULT_WHITE_LABEL.sidebarSolidColor.toLowerCase();

  if (isDefault) {
    // Clear all overrides so the original CSS file defaults take effect —
    // this preserves the signature purple→magenta sidebar gradient,
    // the original --th-sidebar-active (#783a9b), etc.
    OVERRIDE_VARS.forEach((p) => root.style.removeProperty(p));
    return;
  }

  // Primary accent + dependent shades
  root.style.setProperty("--th-tab-active", c);
  root.style.setProperty("--th-active-conv-border", c);
  // Sidebar background
  if (config.sidebarStyle === "gradient") {
    // Build a 4-stop gradient based on the brand color
    const start = darken(c, 0.1);
    const mid1 = c;
    const mid2 = lighten(c, 0.05);
    const end = lighten(c, 0.4);
    root.style.setProperty("--th-shell-bg", `linear-gradient(180deg, ${start} 0%, ${mid1} 33%, ${mid2} 64.5%, ${end} 100%)`);
  } else {
    root.style.setProperty("--th-shell-bg", config.sidebarSolidColor);
  }
  // Topbar
  root.style.setProperty("--th-topbar-bg", c);
  // Sidebar accent for active tab
  root.style.setProperty("--th-sidebar-active", lighten(c, 0.25));
  root.style.setProperty("--th-sidebar-badge-border", lighten(c, 0.35));
  // Walkthrough bubble
  root.style.setProperty("--th-walkthrough-bg", c);
  // Status dot border (matches topbar)
  root.style.setProperty("--th-status-dot-border", c);
  // Quick actions tinted bg
  root.style.setProperty("--th-quick-actions-bg", rgba(c, 0.04));
}

export function WhiteLabelProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<WhiteLabelConfig>(DEFAULT_WHITE_LABEL);

  // Load from localStorage once mounted
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WhiteLabelConfig>;
        const merged = { ...DEFAULT_WHITE_LABEL, ...parsed };
        setConfigState(merged);
        applyToDocument(merged);
      }
    } catch { /* ignore */ }
  }, []);

  const setConfig = useCallback((patch: Partial<WhiteLabelConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      applyToDocument(next);
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setConfigState(DEFAULT_WHITE_LABEL);
    // Remove inline style overrides so the CSS file defaults take effect again
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      OVERRIDE_VARS.forEach((p) => root.style.removeProperty(p));
    }
  }, []);

  return (
    <WhiteLabelContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabel() {
  return useContext(WhiteLabelContext);
}
