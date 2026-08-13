"use client";

import { useState } from "react";
import CallPopup from "./CallPopup";

type Contact = {
  id: number;
  name: string;
  type: "Internal" | "External";
  extension: string;
  phone?: string;
  avatar?: string;
  initials?: string;
  isFavorite?: boolean;
  isUnknown?: boolean;
};

const contacts: Contact[] = [
  { id: 1, name: "Terry Crews", type: "Internal", extension: "X1512", avatar: "/avatars/terry.jpg" },
  { id: 2, name: "Ashley Warren", type: "External", extension: "X2122", avatar: "/avatars/ashley.jpg" },
  { id: 3, name: "Lora Sellicon", type: "External", extension: "X2000", avatar: "/avatars/lora.jpg" },
  { id: 4, name: "Cameron Lopez", type: "External", extension: "X9421", avatar: "/avatars/cameron.jpg" },
  { id: 5, name: "Anneta Walson", type: "External", extension: "X9001", phone: "(647) 782-3231", initials: "AW", isFavorite: true },
  { id: 6, name: "Unknown", type: "External", extension: "X9111", phone: "(431) 1345-3604", isUnknown: true },
];

const filterTabs = ["ALL", "FAVORITES", "INTERNAL", "EXTERNAL"] as const;

export default function ContactsList() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [callingContact, setCallingContact] = useState<Contact | null>(null);

  const filtered = contacts.filter((c) => {
    if (activeFilter === "FAVORITES") return c.isFavorite;
    if (activeFilter === "INTERNAL") return c.type === "Internal";
    if (activeFilter === "EXTERNAL") return c.type === "External";
    return true;
  }).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {callingContact && (
        <CallPopup
          name={callingContact.name}
          initials={callingContact.initials || callingContact.name.split(" ").map(n => n[0]).join("")}
          onEnd={() => setCallingContact(null)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Filter tabs */}
        <div
          className="flex items-center gap-4 px-6 py-3 border-b"
          style={{ borderColor: 'var(--th-border)' }}
        >
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25px] transition-all"
                style={{
                  backgroundColor: activeFilter === tab ? 'var(--th-bg-hover)' : 'transparent',
                  color: activeFilter === tab ? 'var(--th-tab-active)' : 'var(--th-text-secondary)',
                }}
              >
                {activeFilter === tab && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {tab}
              </button>
            ))}
          </div>
          <button className="text-xs font-semibold tracking-wider hover:opacity-80" title="Add new contact" style={{ color: 'var(--th-tab-active)' }}>
            + ADD CONTACT
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--th-search-bg)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search contacts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#7F888F]"
              style={{ color: 'var(--th-text-primary)' }}
            />
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 px-6 py-3 transition-colors cursor-pointer group"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Favorite star */}
              <button className="shrink-0 -mr-1" title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={contact.isFavorite ? "#FBBD00" : "none"} stroke={contact.isFavorite ? "#FBBD00" : "#CCCFD2"} strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: 'var(--th-bg-hover)' }}
              >
                {contact.isUnknown ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: "var(--th-text-secondary)" }}>{contact.initials || contact.name.split(" ").map(n => n[0]).join("")}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--th-text-primary)' }}>{contact.name}</p>
                <p className="text-xs text-[color:var(--th-text-muted)]">{contact.phone || contact.type}</p>
              </div>

              {/* Extension badge */}
              <span
                className="text-xs text-[color:var(--th-text-secondary)] px-2 py-0.5 rounded border"
                style={{ backgroundColor: 'var(--th-badge-bg)', borderColor: 'var(--th-border)' }}
              >
                {contact.extension}
              </span>

              {/* Call button */}
              <button
                onClick={(e) => { e.stopPropagation(); setCallingContact(contact); }}
                className="p-1.5 rounded transition-colors active:scale-90"
                title="Make a call"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="18" height="18" viewBox="0 0 28 28" fill="#4C5863"><path d="M21.76 18.2c-1.3-1.1-2.61-1.78-3.89-.67l-.77.67c-.56.49-1.56 2.76-5.58-1.87-4.02-4.62-1.61-5.34-1.15-5.82l.77-.67c1.27-1.11.79-2.51-.13-3.94l-.55-.87c-.74-1.15-1.75-2.1-3.02-.99l-.7.6c-.56.41-2.14 1.75-2.52 4.29-.46 3.04.72 6.53 4.05 10.36 3.32 3.83 6.58 5.75 9.66 5.72 2.56-.03 4.11-1.4 4.6-1.9l.69-.61c1.28-1.1.49-2.24-.79-3.35l-.78-.63z"/></svg>
              </button>

              {/* More */}
              <button
                className="p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="More options"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4C5863">
                  <circle cx="12" cy="5" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
