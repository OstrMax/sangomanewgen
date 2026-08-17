"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface Tip {
  /* data-tour value of the element this tip talks about */
  target: string;
  title: string;
  text: string;
  placement: "right" | "below-end";
}

/* Each tip names a real element rather than a screen coordinate, so the tour
   still lands on the right tab after the user reorders their sidebar. */
const TIPS: Tip[] = [
  {
    target: "/chats",
    title: "Chats",
    text: "Text with your colleagues in real time. Send messages, share files, and stay connected across teams.",
    placement: "right",
  },
  {
    target: "/talk",
    title: "Talk",
    text: "Make phone calls, transfer to other agents, or put callers on hold — all from one place.",
    placement: "right",
  },
  {
    target: "/operator",
    title: "Operator Console",
    text: "Manage incoming calls, see caller details, transfer between departments, and monitor live queue activity.",
    placement: "right",
  },
  {
    target: "/meet",
    title: "Meet",
    text: "Start or join a video conference call. Use New Meeting, Join with a code, or Schedule for later.",
    placement: "right",
  },
  {
    target: "/sms",
    title: "SMS",
    text: "Send and receive SMS messages. Create new conversations, manage campaigns, and reach customers directly.",
    placement: "right",
  },
  {
    target: "/fax",
    title: "Fax",
    text: "Send and receive faxes with cover sheets, folders and OCR search. Opening Fax starts its own short tour.",
    placement: "right",
  },
  {
    target: "/calendar",
    title: "Calendar",
    text: "Plan your schedule with day, week, month & agenda views. Click any slot to add an event.",
    placement: "right",
  },
  {
    target: "/files",
    title: "Files",
    text: "Upload, organize and share files. Browse recordings, voicemails, meeting notes, and all shared documents.",
    placement: "right",
  },
  {
    target: "/contact-center",
    title: "Contact Center (CX)",
    text: "Monitor agents, active calls, queues and performance. See real-time stats and manage your contact center.",
    placement: "right",
  },
  {
    target: "ai-assist",
    title: "AI Assistant",
    text: "Your AI-powered helper! Get smart receptionist, tone analysis, meeting summaries, auto-responses and more.",
    placement: "below-end",
  },
];

const STORAGE_KEY = "teamhub-app-tour-done";
const BUBBLE_W = 320;
const GAP = 14;

interface Rect { top: number; left: number; width: number; height: number }

const find = (target: string) => document.querySelector<HTMLElement>(`[data-tour="${target}"]`);

export default function WalkthroughBubbles() {
  const pathname = usePathname();
  const [steps, setSteps] = useState<Tip[] | null>(null);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  /* Bubbles vary in height with their copy, so the viewport clamp has to work
     off the real one — guessing is what pushed the last tabs off screen. */
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleH, setBubbleH] = useState(180);

  /* The tour introduces the app shell, so it belongs on the home screen only —
     anywhere else it would talk over a page that has its own guidance. */
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) { setSteps(null); return; }
    try { if (localStorage.getItem(STORAGE_KEY) === "1") return; } catch { return; }

    const t = setTimeout(() => {
      /* Keep only tips whose element is actually on screen, and follow the
         sidebar top-to-bottom however the user has arranged it. */
      const present = TIPS.map((tip) => ({ tip, el: find(tip.target) })).filter((s) => s.el);
      const tabs = present
        .filter((s) => s.tip.placement === "right")
        .sort((a, b) => a.el!.getBoundingClientRect().top - b.el!.getBoundingClientRect().top);
      const rest = present.filter((s) => s.tip.placement !== "right");
      const ordered = [...tabs, ...rest].map((s) => s.tip);
      if (ordered.length) { setStep(0); setSteps(ordered); }
    }, 1500);
    return () => clearTimeout(t);
  }, [onHome]);

  const current = steps?.[step];

  const measure = useCallback(() => {
    if (!current) return;
    const el = find(current.target);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [current]);

  useLayoutEffect(() => { measure(); }, [measure]);
  useLayoutEffect(() => {
    if (bubbleRef.current) setBubbleH(bubbleRef.current.offsetHeight);
  });

  useEffect(() => {
    if (!current) return;
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [current, measure]);

  if (!steps || !current || !rect) return null;

  const isLast = step === steps.length - 1;
  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setSteps(null);
  };
  const next = () => (isLast ? finish() : setStep((s) => s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const pad = 6;

  /* Anchored placement, clamped to the viewport so a bubble never runs off the
     edge.  When the clamp shifts a bubble, its arrow slides to keep pointing at
     the thing being explained. */
  const centered = rect.top + rect.height / 2;
  const isRight = current.placement === "right";
  const bubbleTop = isRight
    ? Math.min(Math.max(centered - bubbleH / 2, 16), window.innerHeight - bubbleH - 16)
    : rect.top + rect.height + GAP;
  const bubbleLeft = isRight
    ? rect.left + rect.width + GAP
    : Math.min(Math.max(rect.left + rect.width - BUBBLE_W, 16), window.innerWidth - BUBBLE_W - 16);
  const arrowOffset = isRight
    ? Math.min(Math.max(centered - bubbleTop, 18), bubbleH - 18)
    : Math.min(Math.max(rect.left + rect.width / 2 - bubbleLeft, 18), BUBBLE_W - 18);

  return (
    <>
      {/* Ring the element being explained.  No backdrop and nothing covering the
          app — the tour points things out, it doesn't take the screen hostage. */}
      <div
        className="fixed z-[997] rounded-xl pointer-events-none transition-all duration-300"
        style={{
          top: rect.top - pad,
          left: rect.left - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
          border: "2px solid rgba(255,255,255,0.9)",
          /* Thin dark ring outside the white one so the highlight reads on the
             light page as well as on the dark sidebar. */
          boxShadow: "0 0 0 2px rgba(0,10,20,0.35)",
        }}
      />

      <div
        key={current.target}
        className="fixed z-[999] animate-[fadeIn_0.25s_ease-out]"
        style={{ top: bubbleTop, left: bubbleLeft, width: BUBBLE_W }}
      >
        <div
          ref={bubbleRef}
          className="relative text-white rounded-2xl px-5 py-4"
          style={{
            backgroundColor: "var(--th-walkthrough-bg)",
            border: "1px solid var(--th-walkthrough-border)",
            boxShadow: "var(--th-dropdown-shadow)",
          }}
        >
          {isRight ? (
            <div
              className="absolute right-full -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px]"
              style={{ top: arrowOffset, borderRightColor: "var(--th-walkthrough-bg)" }}
            />
          ) : (
            <div
              className="absolute bottom-full -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px]"
              style={{ left: arrowOffset, borderBottomColor: "var(--th-walkthrough-bg)" }}
            />
          )}

          <p className="text-[15px] font-semibold mb-1.5">{current.title}</p>
          <p className="text-[13px] leading-[1.6] text-white/80 mb-4">{current.text}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {steps.map((_, i) => (
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
