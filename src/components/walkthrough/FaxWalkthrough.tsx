"use client";

import { useEffect, useLayoutEffect, useState, useCallback } from "react";

interface FaxTourStep {
  id: string;
  target: string; // data-fax-tour value
  title: string;
  text: string;
  placement: "right" | "bottom";
}

const STEPS: FaxTourStep[] = [
  {
    id: "new-fax",
    target: "new-fax",
    title: "Send a new fax",
    text: "Click New fax to compose — pick a number, add recipients, attach documents and include a cover sheet.",
    placement: "bottom",
  },
  {
    id: "boxes",
    target: "boxes",
    title: "Inbox, Sent & Outbox",
    text: "Switch between faxes you've received, ones you've sent, and the outbox where queued or failed faxes wait.",
    placement: "right",
  },
  {
    id: "search",
    target: "search",
    title: "Find any fax fast",
    text: "Search by number or contact — or use advanced search to scan inside pages with OCR.",
    placement: "right",
  },
  {
    id: "list",
    target: "list",
    title: "Your faxes",
    text: "Select a fax to preview it. Use the checkboxes to move, forward, download or delete several at once.",
    placement: "right",
  },
  {
    id: "folders",
    target: "folders",
    title: "Stay organized",
    text: "Create custom folders and move faxes into them. Drafts and Trash live here too.",
    placement: "right",
  },
];

const STORAGE_KEY = "teamhub-fax-tour-done";
const BUBBLE_W = 320;
const GAP = 14;

interface Rect { top: number; left: number; width: number; height: number }

export default function FaxWalkthrough({ active, onClose }: { active: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const measure = useCallback(() => {
    if (!active) return;
    const el = document.querySelector<HTMLElement>(`[data-fax-tour="${current.target}"]`);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [active, current]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    if (!active) return;
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [active, measure]);

  useEffect(() => { if (active) setStep(0); }, [active]);

  if (!active || !rect) return null;

  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    onClose();
  };
  const next = () => (isLast ? finish() : setStep((s) => s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  // Spotlight cutout padding
  const pad = 6;
  const spotTop = rect.top - pad;
  const spotLeft = rect.left - pad;
  const spotW = rect.width + pad * 2;
  const spotH = rect.height + pad * 2;

  // Bubble placement
  let bubbleStyle: React.CSSProperties;
  let arrow: "left" | "up";
  if (current.placement === "right") {
    const top = Math.min(
      Math.max(rect.top + rect.height / 2, 90),
      window.innerHeight - 120
    );
    bubbleStyle = { top, left: rect.left + rect.width + GAP, transform: "translateY(-50%)" };
    arrow = "left";
  } else {
    // bottom
    const left = Math.min(
      Math.max(rect.left, 16),
      window.innerWidth - BUBBLE_W - 16
    );
    bubbleStyle = { top: rect.top + rect.height + GAP, left };
    arrow = "up";
  }

  return (
    <>
      {/* Dim backdrop with spotlight cutout */}
      <div
        className="fixed z-[997] rounded-xl pointer-events-none transition-all duration-300"
        style={{
          top: spotTop,
          left: spotLeft,
          width: spotW,
          height: spotH,
          boxShadow: "0 0 0 9999px rgba(0,10,20,0.55)",
          border: "2px solid rgba(255,255,255,0.9)",
        }}
      />
      {/* Click-catcher to advance / block interaction */}
      <div className="fixed inset-0 z-[997]" onClick={next} />

      {/* Bubble */}
      <div
        key={current.id}
        className="fixed z-[999] animate-[fadeIn_0.25s_ease-out]"
        style={{ ...bubbleStyle, width: BUBBLE_W }}
      >
        <div
          className="relative text-white rounded-2xl px-5 py-4"
          style={{
            backgroundColor: "var(--th-walkthrough-bg)",
            border: "1px solid var(--th-walkthrough-border)",
            boxShadow: "var(--th-dropdown-shadow)",
          }}
        >
          {/* Arrow */}
          {arrow === "left" ? (
            <div
              className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px]"
              style={{ borderRightColor: "var(--th-walkthrough-bg)" }}
            />
          ) : (
            <div
              className="absolute bottom-full left-6 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px]"
              style={{ borderBottomColor: "var(--th-walkthrough-bg)" }}
            />
          )}

          <p className="text-[15px] font-semibold mb-1.5">{current.title}</p>
          <p className="text-[13px] leading-[1.6] text-white/80 mb-4">{current.text}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${i === step ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button onClick={finish} className="text-[12px] text-white/50 hover:text-white/80 transition-colors">
                Skip
              </button>
              {step > 0 && (
                <button onClick={prev} className="px-3 py-1.5 text-white/70 text-[12px] font-medium rounded-full hover:text-white hover:bg-white/10 transition-all">
                  Back
                </button>
              )}
              <button onClick={next} className="px-4 py-1.5 bg-white text-[color:var(--th-text-primary)] text-[12px] font-semibold rounded-full hover:bg-white/90 active:scale-95 transition-all">
                {isLast ? "Got it!" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function shouldAutoStartFaxTour(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) !== "1"; } catch { return false; }
}
