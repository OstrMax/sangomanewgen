"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ProfileDropdown from "@/components/profile/ProfileDropdown";
import SettingsDropdown from "@/components/layout/SettingsDropdown";
import CustomizeTabsDialog from "@/components/layout/CustomizeTabsDialog";
import WhiteLabelDialog from "@/components/layout/WhiteLabelDialog";
import { PassiveAIIcon, ActiveAIIcon } from "@/components/ai/AIAssistPanel";

export default function Header({
  aiPanelOpen,
  onToggleAI,
}: {
  aiPanelOpen: boolean;
  onToggleAI: () => void;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomizeTabs, setShowCustomizeTabs] = useState(false);
  const [showBranding, setShowBranding] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1 px-3 py-1 w-full h-11 shrink-0">
      {/* Grid/channels icon */}
      <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
        <Image src="/icons/channels.svg" alt="Apps" width={22} height={22} />
      </button>

      <div className="flex-1" />

      {/* Search bar */}
      <button
        className="flex items-center h-8 w-[365px] rounded-lg px-4 transition-all duration-200 group"
        style={{
          backgroundColor: "var(--th-search-bg)",
          border: "1px solid var(--th-search-border)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <Image src="/icons/search.svg" alt="Search" width={16} height={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
        <span className="ml-2 text-sm" style={{ color: "var(--th-text-muted)" }}>Search</span>
      </button>

      <div className="flex-1" />

      {/* Right icons */}
      <div className="flex items-center gap-2">
        {/* AI Assist toggle */}
        <button
          onClick={onToggleAI}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            aiPanelOpen
              ? "bg-white/20 hover:bg-white/30"
              : "hover:bg-white/10"
          }`}
          title="AI Assist"
        >
          {aiPanelOpen ? (
            <ActiveAIIcon />
          ) : (
            <PassiveAIIcon />
          )}
        </button>

        {/* Help */}
        <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Image src="/icons/help.svg" alt="Help" width={24} height={24} />
        </button>

        {/* Mentions */}
        <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Image src="/icons/mentions.svg" alt="Mentions" width={24} height={24} />
        </button>

        {/* Notifications */}
        <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Image src="/icons/notifications.svg" alt="Notifications" width={24} height={24} />
        </button>

        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <Image src="/icons/settings.svg" alt="Settings" width={24} height={24} />
          </button>
          {showSettings && (
            <SettingsDropdown
              onClose={() => setShowSettings(false)}
              onOpenCustomizeTabs={() => { setShowSettings(false); setShowCustomizeTabs(true); }}
              onOpenBranding={() => { setShowSettings(false); setShowBranding(true); }}
            />
          )}
        </div>
        {showCustomizeTabs && (
          <CustomizeTabsDialog onClose={() => setShowCustomizeTabs(false)} />
        )}
        {showBranding && (
          <WhiteLabelDialog onClose={() => setShowBranding(false)} />
        )}

        {/* Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="relative w-9 h-9"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/30 hover:border-white/60 transition-colors bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
              BH
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#34C759] rounded-full z-10" style={{ border: "2.5px solid var(--th-status-dot-border)" }} />
          </button>
          {showProfile && (
            <ProfileDropdown onClose={() => setShowProfile(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
