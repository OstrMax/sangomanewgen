"use client";

import { useState } from "react";
import ConversationList from "@/components/sms/ConversationList";
import ChatArea from "@/components/sms/ChatArea";

export default function SmsPage() {
  const [activeConversation, setActiveConversation] = useState(1);

  return (
    <div className="flex h-full">
      <ConversationList activeId={activeConversation} onSelect={setActiveConversation} />
      <ChatArea />
    </div>
  );
}
