"use client";

import { useState } from "react";
import Image from "next/image";
import CallPopup from "./CallPopup";

/* ── Speaker / Volume icon ── */
const SpeakerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="var(--th-text-muted)"/>
    <path d="M15.54 8.46a5 5 0 010 7.07" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const keys = [
  { num: "1", sub: "" },
  { num: "2", sub: "ABC" },
  { num: "3", sub: "DEF" },
  { num: "4", sub: "GHI" },
  { num: "5", sub: "JKL" },
  { num: "6", sub: "NMO" },
  { num: "7", sub: "PQRS" },
  { num: "8", sub: "TUV" },
  { num: "9", sub: "WXYZ" },
  { num: "*", sub: "" },
  { num: "0", sub: "+" },
  { num: "#", sub: "" },
];

export default function DialPad() {
  const [input, setInput] = useState("");
  const [calling, setCalling] = useState(false);
  const [volume, setVolume] = useState(50);

  const handleCall = () => {
    if (input.length > 0) setCalling(true);
  };

  return (
    <>
      {calling && (
        <CallPopup
          name={input || "Unknown"}
          initials="#"
          onEnd={() => { setCalling(false); }}
        />
      )}
      <div className="flex flex-col items-center w-[300px] shrink-0 border-r border-[var(--th-border)] h-full bg-[var(--th-bg)] p-6">
        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a name or number"
          className="w-full text-center text-[14px] text-[var(--th-text-primary)] mb-4 pb-2 outline-none placeholder:text-[var(--th-text-muted)] placeholder:text-[13px] bg-transparent"
        />

        {/* Volume slider */}
        <div className="flex items-center gap-2.5 w-full mb-5 px-1">
          <SpeakerIcon />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-[3px] rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--th-text-muted) 0%, var(--th-text-muted) ${volume}%, var(--th-border) ${volume}%, var(--th-border) 100%)`,
            }}
          />
          <button className="text-[11px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider whitespace-nowrap hover:text-[var(--th-text-primary)] transition-colors">
            Phone Settings
          </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {keys.map((key) => (
            <button
              key={key.num}
              onClick={() => setInput((prev) => prev + key.num)}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-full border border-[var(--th-border)] hover:bg-[var(--th-bg-hover)] transition-colors"
            >
              <span className="text-2xl font-medium text-[var(--th-text-primary)]">{key.num}</span>
              {key.sub && (
                <span className="text-[10px] font-medium text-[var(--th-text-muted)] tracking-wider">{key.sub}</span>
              )}
            </button>
          ))}
        </div>

        {/* Call button */}
        <button
          onClick={handleCall}
          className={`w-14 h-14 rounded-full bg-[#2CAD43] hover:bg-[#259c3a] flex items-center justify-center transition-all shadow-lg ${input.length > 0 ? "active:scale-90" : "opacity-60 cursor-not-allowed"}`}
        >
          <Image src="/icons/call-button.svg" alt="Call" width={22} height={23} />
        </button>
      </div>
    </>
  );
}
