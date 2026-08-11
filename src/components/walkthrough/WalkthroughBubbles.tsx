"use client";

import { useState, useEffect } from "react";

interface WalkthroughTip {
  id: string;
  title: string;
  text: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  arrowDirection: "up" | "down" | "left" | "right";
}

const tips: WalkthroughTip[] = [
  {
    id: "chats",
    title: "Chats",
    text: "Text with your colleagues in real time. Send messages, share files, and stay connected across teams.",
    position: { top: "130px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "talk",
    title: "Talk",
    text: "Make phone calls, transfer to other agents, or put callers on hold — all from one place.",
    position: { top: "178px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "ai-assist",
    title: "AI Assistant",
    text: "Your AI-powered helper! Get smart receptionist, tone analysis, meeting summaries, auto-responses and more.",
    position: { top: "52px", right: "140px" },
    arrowDirection: "up",
  },
  {
    id: "operator",
    title: "Operator Console",
    text: "Manage incoming calls, see caller details, transfer between departments, and monitor live queue activity.",
    position: { top: "270px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "meet",
    title: "Meet",
    text: "Start or join a video conference call. Use New Meeting, Join with a code, or Schedule for later.",
    position: { top: "224px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "sms",
    title: "SMS",
    text: "Send and receive SMS messages. Create new conversations, manage campaigns, and reach customers directly.",
    position: { top: "316px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "calendar",
    title: "Calendar",
    text: "Plan your schedule with day, week, month & agenda views. Add new events and never miss a meeting.",
    position: { top: "374px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "calendar-event",
    title: "Add Events",
    text: "Click any time slot to create a new event. Set reminders, invite colleagues, and sync across devices.",
    position: { top: "374px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "files",
    title: "Files",
    text: "Upload, organize and share files. Browse recordings, voicemails, meeting notes, and all shared documents.",
    position: { top: "422px", left: "68px" },
    arrowDirection: "left",
  },
  {
    id: "cx",
    title: "Contact Center (CX)",
    text: "Monitor agents, active calls, queues and performance. See real-time stats and manage your contact center.",
    position: { top: "478px", left: "68px" },
    arrowDirection: "left",
  },
];

export default function WalkthroughBubbles() {
  const [currentTip, setCurrentTip] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (dismissed || !visible) return null;

  const tip = tips[currentTip];
  const isLast = currentTip === tips.length - 1;

  const handleNext = () => {
    if (isLast) {
      setDismissed(true);
    } else {
      setCurrentTip(currentTip + 1);
    }
  };

  const handlePrev = () => {
    if (currentTip > 0) {
      setCurrentTip(currentTip - 1);
    }
  };

  const handleSkip = () => {
    setDismissed(true);
  };

  const arrowBaseClasses: Record<string, { position: string; borders: string }> = {
    up: { position: "bottom-full left-1/2 -translate-x-1/2 mb-0", borders: "border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]" },
    down: { position: "top-full left-1/2 -translate-x-1/2 mt-0", borders: "border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]" },
    left: { position: "right-full top-1/2 -translate-y-1/2 mr-0", borders: "border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px]" },
    right: { position: "left-full top-1/2 -translate-y-1/2 ml-0", borders: "border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px]" },
  };

  const arrowColorProp: Record<string, string> = {
    up: "borderBottomColor",
    down: "borderTopColor",
    left: "borderRightColor",
    right: "borderLeftColor",
  };

  return (
    <>
      {/* Subtle backdrop */}
      <div className="fixed inset-0 z-[998] pointer-events-none" />

      {/* Tooltip bubble */}
      <div
        className="fixed z-[999] animate-[fadeIn_0.3s_ease-out]"
        style={{ ...tip.position }}
        key={tip.id}
      >
        <div className="relative text-white rounded-2xl px-5 py-4 min-w-[300px] max-w-[320px]" style={{ backgroundColor: "var(--th-walkthrough-bg)", border: "1px solid var(--th-walkthrough-border)", boxShadow: "var(--th-dropdown-shadow)" }}>
          {/* Arrow */}
          <div className={`absolute w-0 h-0 ${arrowBaseClasses[tip.arrowDirection].position} ${arrowBaseClasses[tip.arrowDirection].borders}`} style={{ [arrowColorProp[tip.arrowDirection]]: "var(--th-walkthrough-bg)" }} />

          {/* Title */}
          <p className="text-[15px] font-semibold mb-1.5">{tip.title}</p>

          {/* Content */}
          <p className="text-[13px] leading-[1.6] text-white/80 mb-4">{tip.text}</p>

          {/* Controls — all inside the box */}
          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {tips.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${
                    i === currentTip ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={handleSkip}
                className="text-[12px] text-white/50 hover:text-white/80 transition-colors"
              >
                Skip
              </button>
              {currentTip > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 text-white/70 text-[12px] font-medium rounded-full hover:text-white hover:bg-white/10 transition-all"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-white text-[color:var(--th-text-primary)] text-[12px] font-semibold rounded-full hover:bg-white/90 active:scale-95 transition-all"
              >
                {isLast ? "Got it!" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
