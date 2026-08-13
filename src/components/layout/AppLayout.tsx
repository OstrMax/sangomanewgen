"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AIAssistPanel from "@/components/ai/AIAssistPanel";
import WalkthroughBubbles from "@/components/walkthrough/WalkthroughBubbles";
import { useWhiteLabel } from "@/contexts/WhiteLabelContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const pathname = usePathname();
  const { config } = useWhiteLabel();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top bar with logo */}
      <div
        className="flex items-center justify-center h-11 w-full shrink-0 rounded-t-xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--th-topbar-bg)",
          borderBottom: "1px solid var(--th-topbar-border)",
        }}
      >
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo.png" alt={config.appName} width={20} height={14} />
          <span className="text-white/90 font-normal text-[15px] tracking-[0.3px] font-[family-name:var(--font-inter)]">{config.appName}</span>
        </div>
      </div>

      <div
        className="flex flex-1 overflow-hidden transition-colors duration-300"
        style={{
          background: "var(--th-shell-bg)",
        }}
      >
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header aiPanelOpen={aiPanelOpen} onToggleAI={() => setAiPanelOpen(!aiPanelOpen)} />
          <div className="flex flex-1 overflow-hidden">
            {/* Main content */}
            <div
              className="flex-1 overflow-hidden transition-all duration-300 rounded-tl-xl"
              style={{ backgroundColor: "var(--th-bg)" }}
            >
              {children}
            </div>

            {/* AI Assist Panel */}
            <AIAssistPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} currentPage={pathname} />
          </div>
        </div>
      </div>

      {/* Walkthrough tooltips */}
      <WalkthroughBubbles />
    </div>
  );
}
