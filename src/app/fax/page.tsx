"use client";

import { useState, useMemo, useEffect } from "react";
import FaxWalkthrough, { shouldAutoStartFaxTour } from "@/components/walkthrough/FaxWalkthrough";

/* ────────────────────────────────────────────────────────────
   Types & data
──────────────────────────────────────────────────────────── */
type FaxDirection = "inbound" | "outbound";
type FaxStatus = "inbound" | "outbound" | "queued" | "failed";
type SystemBox = "inbox" | "sent" | "outbox";

interface FaxItem {
  id: number;
  box: SystemBox;
  direction: FaxDirection;
  status: FaxStatus;
  contact: string;
  number: string;
  subject: string;
  pages: number;
  date: string;
  time: string;
  unread?: boolean;
  preview: string;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  kind: "custom" | "trash";
}

const faxes: FaxItem[] = [
  { id: 1, box: "inbox", direction: "inbound", status: "inbound", contact: "+1 (416) 555-0144", number: "+1 (416) 555-0144", subject: "Policy Renewal Documents", pages: 4, date: "7/29/2026", time: "10:32 AM", unread: true, preview: "Please find enclosed the renewal documents for policy #AX-2024-8821...", folderId: "clients" },
  { id: 2, box: "inbox", direction: "inbound", status: "inbound", contact: "+16044996088", number: "+1 (604) 499-6088", subject: "Lab Results — Patient #4523", pages: 82, date: "12/25/2025", time: "9:15 AM", unread: true, preview: "Lab results for patient ID 4523. All values within normal range..." },
  { id: 3, box: "inbox", direction: "inbound", status: "inbound", contact: "+3512444735", number: "+35 124 447 35", subject: "Contract Amendment #3", pages: 5, date: "12/25/2025", time: "4:45 PM", preview: "Amendment to the original contract dated March 15, 2024. Section 4.2...", folderId: "legal" },
  { id: 4, box: "inbox", direction: "inbound", status: "inbound", contact: "+1 (416) 555-0998", number: "+1 (416) 555-0998", subject: "Invoice #INV-9821", pages: 13, date: "12/25/2025", time: "2:18 PM", preview: "Invoice for services rendered. Total amount due: $1,250.00..." },
  { id: 5, box: "inbox", direction: "inbound", status: "inbound", contact: "+1123567856", number: "+1 (123) 567-856", subject: "Patient Referral", pages: 1, date: "12/25/2025", time: "11:00 AM", preview: "Referring patient for specialist consultation. Medical history attached..." },
  { id: 6, box: "sent", direction: "outbound", status: "outbound", contact: "+1 (800) 555-0100", number: "+1 (800) 555-0100", subject: "Tax Form Submission", pages: 5, date: "7/29/2026", time: "11:45 AM", preview: "Q1 2026 tax forms as requested. Please confirm receipt...", folderId: "tax2026" },
  { id: 7, box: "sent", direction: "outbound", status: "outbound", contact: "+1 (416) 555-0011", number: "+1 (416) 555-0011", subject: "Loan Application", pages: 1, date: "12/25/2025", time: "8:30 AM", preview: "Application for business loan. Supporting documents enclosed..." },
  { id: 8, box: "sent", direction: "outbound", status: "outbound", contact: "+1 (647) 555-0888", number: "+1 (647) 555-0888", subject: "NDA Signed Copy", pages: 1, date: "12/25/2025", time: "5:22 PM", preview: "Signed NDA agreement as discussed in our meeting...", folderId: "legal" },
  { id: 9, box: "sent", direction: "outbound", status: "outbound", contact: "+1 (905) 555-0421", number: "+1 (905) 555-0421", subject: "Quote Request Response", pages: 1, date: "12/25/2025", time: "10:00 AM", preview: "Response to quote request. Please find the proposed pricing..." },
  { id: 10, box: "sent", direction: "outbound", status: "outbound", contact: "+1123567856", number: "+1 (123) 567-856", subject: "Signed agreement", pages: 1, date: "12/25/2025", time: "9:41 AM", preview: "Signed agreement returned as requested..." },
  { id: 11, box: "outbox", direction: "outbound", status: "queued", contact: "+1 (416) 555-0144", number: "+1 (416) 555-0144", subject: "Policy Renewal Documents", pages: 4, date: "Today, 13:42 PM", time: "1:42 PM", preview: "Please find enclosed the renewal documents for policy #AX-2024-8821..." },
  { id: 12, box: "outbox", direction: "outbound", status: "failed", contact: "+16044996088", number: "+1 (604) 499-6088", subject: "Lab Results — Patient #4523", pages: 82, date: "Today, 13:42 PM", time: "1:42 PM", preview: "Lab results for patient ID 4523. Delivery failed after 3 attempts..." },
];

const initialFolders: Folder[] = [
  { id: "clients", name: "Clients", count: 12, kind: "custom" },
  { id: "legal", name: "Legal", count: 5, kind: "custom" },
  { id: "tax2026", name: "Tax 2026", count: 3, kind: "custom" },
  { id: "insurance", name: "Insurance", count: 8, kind: "custom" },
  { id: "trash", name: "Trash", count: 3, kind: "trash" },
];

const senderNumbers = ["+1 (416) 555-0100", "+1 (905) 555-0200", "+1 (647) 555-0300"];

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */
export default function FaxPage() {
  const [view, setView] = useState<string>("inbox"); // "inbox" | "sent" | "outbox" | folderId
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [readIds, setReadIds] = useState<Set<number>>(new Set([1]));
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [showMoreFolders, setShowMoreFolders] = useState(false);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [faxFilter, setFaxFilter] = useState<"all" | "unread">("all");
  const [sortOpen, setSortOpen] = useState(false);

  // dialogs / overlays
  const [compose, setCompose] = useState<null | { mode: "new" }>(null);
  const [composeVersion, setComposeVersion] = useState<1 | 2>(2);
  const [forwardFax, setForwardFax] = useState<FaxItem | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [moveMenu, setMoveMenu] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<null | { kind: "single"; fax: FaxItem } | { kind: "bulk"; count: number }>(null);
  const [folderMenu, setFolderMenu] = useState<string | null>(null);
  const [renameFolder, setRenameFolder] = useState<Folder | null>(null);
  const [deleteFolder, setDeleteFolder] = useState<Folder | null>(null);
  const [toast, setToast] = useState<{ title: string; sub: string; kind: ToastKind } | null>(null);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    if (shouldAutoStartFaxTour()) {
      const t = setTimeout(() => setTourActive(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const isSystem = view === "inbox" || view === "sent" || view === "outbox";
  const activeFolder = folders.find((f) => f.id === view) || null;

  const fireToast = (title: string, sub: string, kind: ToastKind = "success") => {
    setToast({ title, sub, kind });
    setTimeout(() => setToast(null), 4000);
  };

  const visibleFaxes = useMemo(() => {
    let list: FaxItem[];
    if (isSystem) list = faxes.filter((f) => f.box === view);
    else list = faxes.filter((f) => f.folderId === view);
    return list
      .filter(
        (f) =>
          f.contact.toLowerCase().includes(search.toLowerCase()) ||
          f.number.toLowerCase().includes(search.toLowerCase()) ||
          f.subject.toLowerCase().includes(search.toLowerCase())
      )
      .filter((f) => (faxFilter === "unread" ? !!f.unread && !readIds.has(f.id) : true));
  }, [view, isSystem, search, faxFilter, readIds]);

  const selected = faxes.find((f) => f.id === selectedId) || null;
  const unreadCount = faxes.filter((f) => f.box === "inbox" && f.unread && !readIds.has(f.id)).length;

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const clearChecks = () => { setCheckedIds(new Set()); setMoveMenu(false); };

  const switchView = (v: string) => {
    setView(v);
    setSelectedId(null);
    setMoveMenu(false);
    setKebabOpen(false);
    clearChecks();
  };

  const createFolder = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setFolders((prev) => {
      const custom = prev.filter((f) => f.kind === "custom");
      const rest = prev.filter((f) => f.kind !== "custom");
      return [...custom, { id, name, count: 0, kind: "custom" }, ...rest];
    });
    setShowNewFolder(false);
    fireToast("Folder created", `“${name}” is ready to use`);
  };

  const doRenameFolder = (id: string, name: string) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
    setRenameFolder(null);
    fireToast("Folder renamed", `Renamed to “${name}”`);
  };
  const doDeleteFolder = (f: Folder) => {
    setFolders((prev) => prev.filter((x) => x.id !== f.id));
    if (view === f.id) switchView("inbox");
    setDeleteFolder(null);
    fireToast("Folder deleted", `“${f.name}” was removed`);
  };

  const customFolders = folders.filter((f) => f.kind === "custom");
  const trashFolder = folders.find((f) => f.kind === "trash");
  const visibleCustom = showMoreFolders ? customFolders : customFolders.slice(0, 4);
  const visibleFolders = trashFolder ? [...visibleCustom, trashFolder] : visibleCustom;

  const headerTitle = isSystem ? "Fax" : activeFolder?.name ?? "Fax";

  return (
    <div className="flex h-full relative">
      {/* ───────── Left panel ───────── */}
      <div
        className="w-[340px] shrink-0 flex flex-col h-full relative"
        style={{ backgroundColor: "var(--th-bg)", borderRight: "1px solid var(--th-border)" }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          {!isSystem && (
            <button
              onClick={() => switchView("inbox")}
              className="flex items-center gap-1.5 text-[13px] font-medium mb-3 transition-colors"
              style={{ color: "var(--th-text-secondary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Back to inbox
            </button>
          )}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold leading-tight" style={{ color: "var(--th-text-primary)" }}>{headerTitle}</h1>
              {isSystem ? (
                <button className="flex items-center gap-1 text-[13px] mt-0.5 transition-colors" style={{ color: "var(--th-text-secondary)" }}>
                  {senderNumbers[0]}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              ) : (
                <div className="text-[13px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>{activeFolder?.kind === "custom" ? "Custom folder" : activeFolder?.name}</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setCompose({ mode: "new" })}
                data-fax-tour="new-fax"
                className="btn-icon flex items-center justify-center w-9 h-9 rounded-full"
                style={{ border: "1px solid var(--th-border)" }}
                data-tip="New fax"
                data-tip-pos="bottom"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z" fill="url(#faxPlusGrad)" />
                  <defs>
                    <linearGradient id="faxPlusGrad" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#B30B84" />
                      <stop offset="1" stopColor="#46126F" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2" data-fax-tour="search">
            <div className="fax-search flex items-center gap-2 px-3 h-9 rounded-lg flex-1" style={{ backgroundColor: "var(--th-search-field-bg)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Search faxes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm placeholder:text-[#7F888F] w-full"
                style={{ color: "var(--th-text-primary)" }}
              />
              {/* Advanced search — inside the search field */}
              <button
                onClick={() => setShowSearch(true)}
                className="btn-icon flex items-center justify-center w-5 h-5 shrink-0 -mr-0.5"
                data-tip="Advanced search"
                data-tip-pos="bottom"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
              </button>
            </div>
            {/* Filter by */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="btn-icon flex items-center justify-center w-9 h-9 rounded-lg relative"
                style={{ backgroundColor: sortOpen || faxFilter !== "all" ? "var(--th-icon-active-bg)" : "var(--th-bg-hover)" }}
                data-tip="Filter by"
                data-tip-pos="bottom"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                {faxFilter !== "all" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--th-fax-cta-bg)", border: "2px solid var(--th-bg)" }} />
                )}
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 rounded-xl overflow-hidden z-50 py-1" style={{ backgroundColor: "var(--th-dropdown-bg)", border: "1px solid var(--th-dropdown-border)", boxShadow: "var(--th-dropdown-shadow)" }}>
                    <div className="px-3.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-muted)" }}>Filter by</div>
                    {([["all", "All faxes"], ["unread", "Unread only"]] as const).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => { setFaxFilter(id); setSortOpen(false); }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-[13px] font-medium transition-colors"
                        style={{ color: "var(--th-text-primary)", backgroundColor: faxFilter === id ? "var(--th-bg-hover)" : "transparent" }}
                      >
                        {label}
                        {faxFilter === id && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-fax-cta-bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Folder pills (system boxes) */}
        {isSystem && (
          <div className="flex items-center gap-1 px-5 pb-3" data-fax-tour="boxes">
            {(["inbox", "sent", "outbox"] as SystemBox[]).map((box) => {
              const active = view === box;
              return (
                <button
                  key={box}
                  onClick={() => switchView(box)}
                  className="chip-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.25px] transition-all"
                  style={{
                    backgroundColor: active ? "var(--th-icon-active-bg)" : "transparent",
                    color: active ? "var(--th-icon-hover-fg)" : "var(--th-text-secondary)",
                  }}
                >
                  {active && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                  {box}
                  {box === "inbox" && unreadCount > 0 && (
                    <span className="ml-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: "var(--th-tab-active)", color: "var(--th-bg)" }}>{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Active filter chip */}
        {faxFilter !== "all" && (
          <div className="px-4 pt-1 pb-1">
            <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "var(--th-icon-active-bg)", color: "var(--th-text-primary)" }}>
              Unread only
              <button onClick={() => setFaxFilter("all")} className="flex items-center justify-center w-4 h-4 rounded-full transition-colors hover:opacity-70" data-tip="Clear filter">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </span>
          </div>
        )}

        {/* Select all */}
        {visibleFaxes.length > 0 && (() => {
          const allChecked = visibleFaxes.every((f) => checkedIds.has(f.id));
          const selectedCount = visibleFaxes.filter((f) => checkedIds.has(f.id)).length;
          return (
            <div className="px-4 pb-2 pt-1">
              <button
                onClick={() => setCheckedIds((prev) => {
                  const next = new Set(prev);
                  if (allChecked) visibleFaxes.forEach((f) => next.delete(f.id));
                  else visibleFaxes.forEach((f) => next.add(f.id));
                  return next;
                })}
                className="flex items-center gap-2.5 group"
              >
                <span
                  className="w-[18px] h-[18px] shrink-0 rounded-[5px] flex items-center justify-center transition-colors"
                  style={{ border: allChecked ? "none" : "1.5px solid var(--th-checkbox-border)", backgroundColor: allChecked ? "var(--th-fax-cta-bg)" : "transparent" }}
                >
                  {allChecked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-fax-cta-text)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.4px] transition-colors group-hover:opacity-80" style={{ color: "var(--th-text-secondary)" }}>
                  Select all ({selectedCount})
                </span>
              </button>
            </div>
          );
        })()}

        {/* Fax list */}
        <div className="flex-1 overflow-y-auto" data-fax-tour="list">
          {visibleFaxes.length === 0 ? (
            <EmptyList label={`No ${isSystem ? view : "faxes"}`} sub="Faxes will appear here" />
          ) : (
            visibleFaxes.map((fax) => (
              <FaxRow
                key={fax.id}
                fax={fax}
                unread={!!fax.unread && !readIds.has(fax.id)}
                checked={checkedIds.has(fax.id)}
                onSelect={() => { setSelectedId(fax.id); setReadIds((prev) => prev.has(fax.id) ? prev : new Set(prev).add(fax.id)); }}
                onCheck={() => toggleCheck(fax.id)}
              />
            ))
          )}
        </div>

        {/* Folders section */}
        <div className="border-t px-5 py-4" data-fax-tour="folders" style={{ borderColor: "var(--th-border)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--th-text-muted)" }}>Folders</span>
            <button onClick={() => setShowNewFolder(true)} className="btn-icon w-6 h-6 flex items-center justify-center rounded-md" data-tip="New folder">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
          <div className="space-y-0.5">
            {visibleFolders.map((f) => {
              const active = view === f.id;
              const canManage = f.kind === "custom";
              return (
                <div key={f.id} className="relative group">
                  <div
                    onClick={() => switchView(f.id)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer"
                    style={{ backgroundColor: active ? "var(--th-icon-active-bg)" : "transparent" }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--th-icon-hover-bg)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <FolderIcon kind={f.kind} active={active} />
                    <span className="flex-1 text-[13px] font-medium truncate" style={{ color: active ? "var(--th-icon-hover-fg)" : "var(--th-text-primary)" }}>{f.name}</span>
                    {canManage ? (
                      <>
                        <span className={`text-[12px] ${folderMenu === f.id ? "hidden" : "group-hover:hidden"}`} style={{ color: "var(--th-text-muted)" }}>{f.count}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFolderMenu(folderMenu === f.id ? null : f.id); }}
                          className={`w-6 h-6 items-center justify-center rounded-md ${folderMenu === f.id ? "flex" : "hidden group-hover:flex"}`}
                          data-tip="Manage folder"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--th-text-secondary)" stroke="none"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
                        </button>
                      </>
                    ) : (
                      <span className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>{f.count}</span>
                    )}
                  </div>
                  {folderMenu === f.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setFolderMenu(null)} />
                      <div className="absolute right-1 top-9 z-50 w-40 rounded-xl py-1.5 modal-enter" style={{ backgroundColor: "var(--th-bg-card)", boxShadow: "0 8px 24px rgba(0,0,0,0.16)", border: "1px solid var(--th-border)" }}>
                        <MenuItem label="Rename" onClick={() => { setFolderMenu(null); setRenameFolder(f); }} />
                        <MenuItem label="Delete" danger onClick={() => { setFolderMenu(null); setDeleteFolder(f); }} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {customFolders.length > 4 && (
            <button onClick={() => setShowMoreFolders(!showMoreFolders)} className="w-full text-center text-[11px] font-bold uppercase tracking-wider mt-3 transition-colors" style={{ color: "var(--th-tab-active)" }}>
              {showMoreFolders ? "Show fewer folders" : "Show more folders"}
            </button>
          )}
        </div>
      </div>

      {/* ───────── Right panel ───────── */}
      <div className="flex-1 flex flex-col h-full relative" style={{ backgroundColor: "var(--th-bg)" }}>
        {selected ? (
          <>
            {/* Preview header */}
            <div className="px-6 py-4 flex items-start justify-between" style={{ borderBottom: "1px solid var(--th-border)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 relative">
                  <h2 className="text-lg font-bold" style={{ color: "var(--th-text-primary)" }}>{selected.number}</h2>
                  <button onClick={() => setKebabOpen((v) => !v)} className="btn-icon w-6 h-6 flex items-center justify-center rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--th-text-secondary)" stroke="none"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
                  </button>
                  <StatusBadge status={selected.status} />
                  {kebabOpen && (
                    <div className="absolute top-8 left-0 z-50 w-44 rounded-xl py-1.5 modal-enter" style={{ backgroundColor: "var(--th-bg-card)", boxShadow: "0 8px 24px rgba(0,0,0,0.16)", border: "1px solid var(--th-border)" }}>
                      <MenuItem label="Copy number" onClick={() => { setKebabOpen(false); fireToast("Copied", selected.number); }} />
                      <MenuItem label="Block number" danger onClick={() => { setKebabOpen(false); fireToast("Number blocked", selected.number, "error"); }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--th-text-muted)" }}>
                  <span>July 29, 2026, {selected.time}</span>
                  <span>·</span>
                  <span>{selected.pages} {selected.pages === 1 ? "page" : "pages"}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <IconBtn tip="Download" onClick={() => fireToast("Download started", selected.subject)}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></IconBtn>
                <IconBtn tip="Forward" onClick={() => setForwardFax(selected)}><polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 014-4h12" /></IconBtn>
                <IconBtn tip="Move to folder" onClick={() => setMoveMenu(true)}><path d="M3 7h6l2 2h10v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1z" /></IconBtn>
                <IconBtn tip="Delete" danger onClick={() => setConfirmDelete({ kind: "single", fax: selected })}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></IconBtn>
                {moveMenu && !checkedIds.size && (
                  <div className="absolute top-16 right-6 z-50">
                    <MoveToMenu folders={folders.filter((f) => f.kind === "custom")} onPick={(name) => { setMoveMenu(false); fireToast("Fax moved", `Moved to “${name}”`); }} onCreate={() => { setMoveMenu(false); setShowNewFolder(true); }} anchor="down" />
                  </div>
                )}
              </div>
            </div>

            {/* Document preview */}
            <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: "var(--th-bg-hover)" }}>
              <div className="max-w-[620px] mx-auto space-y-5">
                {Array.from({ length: Math.min(selected.pages, 4) }).map((_, i) => (
                  <div key={i} className="rounded-lg shadow-sm p-12 aspect-[8.5/11]" style={{ backgroundColor: "#FFFFFF", border: "1px solid var(--th-border)" }}>
                    <div className="text-center mb-8">
                      <div className="text-[10px] uppercase tracking-[1.5px] mb-2" style={{ color: "#9AA3AB" }}>Page {i + 1} of {selected.pages}</div>
                      <div className="h-px w-16 mx-auto" style={{ backgroundColor: "#E5E6E8" }} />
                    </div>
                    <div className="space-y-4 text-[13px]" style={{ color: "#4C5863" }}>
                      <p className="font-bold text-[15px]" style={{ color: "#001221" }}>{selected.subject}</p>
                      <p>{selected.preview}</p>
                      <p>This is a fax document preview. The full content includes multiple pages of detailed information related to the subject.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptyPreview />
        )}
      </div>

      {/* ───────── Bulk action bar (floats over full content) ───────── */}
      {checkedIds.size > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-40 flex items-center gap-1 px-3 py-2 rounded-xl shadow-2xl modal-enter" style={{ backgroundColor: "var(--th-walkthrough-bg)", border: "1px solid var(--th-walkthrough-border)" }}>
          <span className="text-[12px] font-semibold text-white px-2">{checkedIds.size} selected</span>
          <div className="relative">
            <BulkBtn label="Move" onClick={() => setMoveMenu((v) => !v)} icon={<><path d="M3 7h6l2 2h10v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1z" /></>} />
            {moveMenu && <MoveToMenu folders={folders.filter((f) => f.kind === "custom")} onPick={(name) => { setMoveMenu(false); clearChecks(); fireToast("Fax moved", `Moved to “${name}”`); }} onCreate={() => { setMoveMenu(false); setShowNewFolder(true); }} anchor="up" />}
          </div>
          <BulkBtn label="Forward" onClick={() => { const f = faxes.find((x) => checkedIds.has(x.id)); if (f) setForwardFax(f); }} icon={<><polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 014-4h12" /></>} />
          <BulkBtn label="Download" onClick={() => { const n = checkedIds.size; clearChecks(); fireToast("Download started", `${n} fax(es) downloading`); }} icon={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} />
          <BulkBtn label="Delete" danger onClick={() => setConfirmDelete({ kind: "bulk", count: checkedIds.size })} icon={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /></>} />
          <button onClick={clearChecks} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      {/* ───────── Dialogs / overlays ───────── */}
      {compose && composeVersion === 1 && <ComposeFaxDialog onClose={() => setCompose(null)} onSent={(sub, sub2) => { setCompose(null); fireToast("Fax sent", sub2); }} onNotify={fireToast} />}
      {compose && composeVersion === 2 && <ComposeFaxDialogV2 onClose={() => setCompose(null)} onSent={(sub, sub2) => { setCompose(null); fireToast("Fax sent", sub2); }} />}
      {forwardFax && <ForwardFaxDialog fax={forwardFax} onClose={() => setForwardFax(null)} onForward={() => { setForwardFax(null); fireToast("Fax forwarded", forwardFax.subject); }} onNotify={fireToast} />}
      {showNewFolder && <NewFolderDialog onClose={() => setShowNewFolder(false)} onCreate={createFolder} />}
      {renameFolder && <RenameFolderDialog folder={renameFolder} onClose={() => setRenameFolder(null)} onRename={(name) => doRenameFolder(renameFolder.id, name)} />}
      {deleteFolder && (
        <ConfirmDialog
          title="Delete folder"
          message={`Are you sure you want to delete “${deleteFolder.name}”? Faxes inside won’t be deleted — they’ll return to your inbox.`}
          onClose={() => setDeleteFolder(null)}
          onConfirm={() => doDeleteFolder(deleteFolder)}
        />
      )}
      {showSearch && <AdvancedSearchDialog onClose={() => setShowSearch(false)} />}
      {confirmDelete && (
        <ConfirmDialog
          title={confirmDelete.kind === "bulk" && confirmDelete.count > 1 ? `Delete ${confirmDelete.count} faxes` : "Delete a fax"}
          message={confirmDelete.kind === "bulk" && confirmDelete.count > 1
            ? `Are you sure you want to delete these ${confirmDelete.count} faxes? They will be moved to the Trash folder`
            : "Are you sure you want to delete this fax? It will be moved to the Trash folder"}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => {
            if (confirmDelete.kind === "single") {
              setSelectedId(null);
              fireToast("Moved to Trash", confirmDelete.fax.subject);
            } else {
              const n = confirmDelete.count;
              clearChecks();
              fireToast("Moved to Trash", `${n} fax(es) deleted`);
            }
            setConfirmDelete(null);
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast title={toast.title} sub={toast.sub} kind={toast.kind} onClose={() => setToast(null)} />}

      {/* Contextual tutorial */}
      <FaxWalkthrough active={tourActive} onClose={() => setTourActive(false)} />

      {/* A/B version switch — floats OUTSIDE the app chrome for user testing */}
      <div
        className="fixed bottom-5 right-5 z-[1100] flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full shadow-2xl"
        style={{ backgroundColor: "#17171c", border: "1px solid rgba(255,255,255,0.14)" }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/45 mr-1">New fax</span>
        {([[1, "A", "Inline"], [2, "B", "2-step"]] as const).map(([v, letter, label]) => (
          <button
            key={v}
            onClick={() => setComposeVersion(v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: composeVersion === v ? "#ffffff" : "transparent",
              color: composeVersion === v ? "#17171c" : "rgba(255,255,255,0.6)",
            }}
          >
            <span className="font-extrabold">{letter}</span>
            <span className="text-[11px] font-medium opacity-90">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Sub-components
──────────────────────────────────────────────────────────── */
function FaxRow({ fax, unread, checked, onSelect, onCheck }: { fax: FaxItem; unread: boolean; checked: boolean; onSelect: () => void; onCheck: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="w-full text-left px-4 py-3 flex gap-3 cursor-pointer group transition-colors"
      style={{ backgroundColor: unread ? "var(--th-unread-bg)" : "transparent", borderBottom: "1px solid var(--th-border-light)" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = unread ? "var(--th-unread-bg)" : "transparent"; }}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onCheck(); }}
        className="mt-0.5 w-[18px] h-[18px] shrink-0 rounded-[5px] flex items-center justify-center transition-colors"
        style={{ border: checked ? "none" : "1.5px solid var(--th-checkbox-border)", backgroundColor: checked ? "var(--th-fax-cta-bg)" : "transparent" }}
      >
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-fax-cta-text)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[14px] truncate ${unread ? "font-bold" : "font-medium"}`} style={{ color: "var(--th-text-primary)" }}>
            {fax.contact}
          </span>
          <span className="text-[11px] shrink-0" style={{ color: "var(--th-text-muted)" }}>{fax.date}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <StatusBadge status={fax.status} />
          <span className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: "var(--th-text-muted)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            {fax.pages}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: FaxStatus }) {
  const cfg = {
    inbound: { label: "Inbound", color: "#099F24", bg: "rgba(9,159,36,0.12)", icon: <path d="M17 7L7 17M7 17h8M7 17V9" /> },
    outbound: { label: "Outbound", color: "#2563EB", bg: "rgba(37,99,235,0.12)", icon: <path d="M7 17L17 7M17 7H9M17 7v8" /> },
    queued: { label: "Queued", color: "#B7791F", bg: "rgba(252,198,36,0.18)", icon: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></> },
    failed: { label: "Failed", color: "#EF4444", bg: "rgba(239,68,68,0.12)", icon: <><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></> },
  }[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{cfg.icon}</svg>
      {cfg.label}
    </span>
  );
}

function FolderIcon({ kind, active }: { kind: Folder["kind"]; active?: boolean }) {
  const stroke = active ? "var(--th-icon-hover-fg)" : "var(--th-text-secondary)";
  if (kind === "trash")
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6"><path d="M3 7h6l2 2h10v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1z" /></svg>;
}

function IconBtn({ children, tip, danger, onClick }: { children: React.ReactNode; tip: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="btn-icon p-2 rounded-lg" data-tip={tip}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={danger ? "#EF4444" : "var(--th-text-secondary)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
    </button>
  );
}

function BulkBtn({ label, icon, danger, onClick }: { label: string; icon: React.ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-white/10" style={{ color: danger ? "#FF6B6B" : "rgba(255,255,255,0.92)" }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      {label}
    </button>
  );
}

function MenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="w-full text-left px-3.5 py-2 text-[13px] font-medium transition-colors" style={{ color: danger ? "#EF4444" : "var(--th-text-primary)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
      {label}
    </button>
  );
}

function MoveToMenu({ folders, onPick, onCreate, anchor }: { folders: Folder[]; onPick: (name: string) => void; onCreate: () => void; anchor: "up" | "down" }) {
  return (
    <div className={`${anchor === "up" ? "bottom-12" : "top-0"} absolute right-0 w-56 rounded-xl py-1.5 modal-enter z-50`} style={{ backgroundColor: "var(--th-bg-card)", boxShadow: "0 12px 32px rgba(0,0,0,0.18)", border: "1px solid var(--th-border)" }}>
      <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-muted)" }}>Move to</div>
      {folders.map((f) => (
        <button key={f.id} onClick={() => onPick(f.name)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
          <FolderIcon kind="custom" />
          <span className="flex-1 text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{f.name}</span>
          <span className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>{f.count}</span>
        </button>
      ))}
      <div className="my-1 h-px" style={{ backgroundColor: "var(--th-border)" }} />
      <button onClick={onCreate} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-tab-active)" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        <span className="text-[13px] font-semibold" style={{ color: "var(--th-tab-active)" }}>Create new folder</span>
      </button>
    </div>
  );
}

function EmptyList({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[220px] px-6 text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "var(--th-bg-hover)" }}>
        <PrinterIcon />
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--th-text-secondary)" }}>{label}</p>
      <p className="text-xs mt-1" style={{ color: "var(--th-text-muted)" }}>{sub}</p>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--th-bg-hover)" }}>
        <PrinterIcon large />
      </div>
      <h3 className="text-base font-bold mb-1" style={{ color: "var(--th-text-primary)" }}>Select a fax to preview</h3>
      <p className="text-sm" style={{ color: "var(--th-text-muted)" }}>Choose a fax from the list to view its content</p>
    </div>
  );
}

function PrinterIcon({ large }: { large?: boolean }) {
  const s = large ? 28 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
  );
}

/* ── Toast ── */
type ToastKind = "success" | "info" | "error";

const TOAST_VARIANTS: Record<ToastKind, { accent: string; iconBg: string; icon: React.ReactNode }> = {
  success: {
    accent: "#099F24",
    iconBg: "rgba(9,159,36,0.15)",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#099F24" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>,
  },
  info: {
    accent: "#2563EB",
    iconBg: "rgba(37,99,235,0.15)",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><rect x="6" y="9" width="12" height="9" rx="1" /><path d="M8 9V4h8v5" /><path d="M8 14h8" /></svg>,
  },
  error: {
    accent: "#E5231B",
    iconBg: "rgba(229,35,27,0.15)",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E5231B" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  },
};

function Toast({ title, sub, kind = "success", onClose }: { title: string; sub: string; kind?: ToastKind; onClose: () => void }) {
  const v = TOAST_VARIANTS[kind];
  return (
    <div className="absolute top-4 right-4 z-[300] flex items-start gap-3 px-4 py-3 rounded-xl toast-enter" style={{ backgroundColor: "var(--th-bg-card)", borderLeft: `4px solid ${v.accent}`, boxShadow: "0 12px 32px rgba(0,0,0,0.18)", minWidth: 300 }}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: v.iconBg }}>
        {v.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold" style={{ color: "var(--th-text-primary)" }}>{title}</div>
        <div className="text-[12px] mt-0.5 truncate" style={{ color: "var(--th-text-secondary)" }}>{sub}</div>
      </div>
      <button onClick={onClose} className="shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Dialog primitives
──────────────────────────────────────────────────────────── */
function DialogShell({ children, onClose, width = 540 }: { children: React.ReactNode; onClose: () => void; width?: number }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="modal-enter rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]" style={{ backgroundColor: "var(--th-bg-card)", width }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--th-border)" }}>
      <h2 className="text-lg font-bold" style={{ color: "var(--th-text-primary)" }}>{title}</h2>
      <button onClick={onClose} className="btn-icon p-1 rounded-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  );
}

function FieldLabel({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <label className="text-[13px] font-bold mb-1.5 block" style={{ color: "var(--th-text-primary)" }}>
      {required && <span className="text-[#EF4444] mr-0.5">*</span>}
      {children}
      {hint && <span className="font-normal ml-1.5" style={{ color: "var(--th-text-muted)" }}>{hint}</span>}
    </label>
  );
}

const inputStyle = { border: "1px solid var(--th-border)", backgroundColor: "var(--th-bg)", color: "var(--th-text-primary)" } as const;

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ backgroundColor: on ? "#142B53" : "#CCCFD2" }}>
      <div className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all" style={{ left: on ? "auto" : "3px", right: on ? "3px" : "auto" }} />
    </button>
  );
}

function RecipientInput({ chips, onAdd, onRemove, value, onValueChange }: { chips: string[]; onAdd: (v: string) => void; onRemove: (i: number) => void; value: string; onValueChange: (v: string) => void }) {
  const commit = () => { const t = value.trim(); if (t) { onAdd(t); onValueChange(""); } };
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2.5 py-2 rounded-xl min-h-[46px]" style={inputStyle}>
      {chips.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-md text-[13px]" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
          {c}
          <button onClick={() => onRemove(i)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </span>
      ))}
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === ",") && value.trim()) { e.preventDefault(); commit(); } }}
        onBlur={commit}
        placeholder="Add fax number"
        className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] placeholder:text-[#9AA3AB]"
        style={{ color: "var(--th-text-primary)" }}
      />
    </div>
  );
}

/* ── Compose (2-step) ── */
/* ── Shared cover-sheet step (used by Compose & Forward) ── */
function CoverFields({
  coverTab, setCoverTab, subject, setSubject, message, setMessage, template, setTemplate, from, to, onNotify,
}: {
  coverTab: "default" | "custom";
  setCoverTab: (v: "default" | "custom") => void;
  subject: string; setSubject: (v: string) => void;
  message: string; setMessage: (v: string) => void;
  template: string; setTemplate: (v: string) => void;
  from: string; to: string;
  onNotify?: (title: string, sub: string) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [tplList, setTplList] = useState(["Cover for legal", "Cover for medical"]);
  const [tplOpen, setTplOpen] = useState(false);
  const [tplName, setTplName] = useState(template);
  const [attention, setAttention] = useState("Legal Team");
  const [footerName, setFooterName] = useState<string | null>(null);
  return (
    <div className="space-y-5 pt-1">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b" style={{ borderColor: "var(--th-border)" }}>
        {([["default", "Default cover"], ["custom", "Custom template"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setCoverTab(id)} className="pb-2.5 text-[14px] font-semibold transition-colors relative" style={{ color: coverTab === id ? "var(--th-text-primary)" : "var(--th-text-muted)" }}>
            {label}
            {coverTab === id && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "#142B53" }} />}
          </button>
        ))}
      </div>

      {coverTab === "default" && (
        <>
          <div><FieldLabel>Attention</FieldLabel><input value={attention} onChange={(e) => setAttention(e.target.value)} placeholder="Recipient name or department" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={inputStyle} /></div>
          <div><FieldLabel>Subject</FieldLabel><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject of this fax" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={inputStyle} /></div>
          <div><FieldLabel>Message</FieldLabel><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Write a short message for the cover sheet…" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none resize-none placeholder:text-[#9AA3AB]" style={inputStyle} /></div>
        </>
      )}
      {coverTab === "custom" && (
        <>
          <div>
            <FieldLabel hint="(choose one)">Template</FieldLabel>
            <div className="relative">
              <button onClick={() => setTplOpen((v) => !v)} className="w-full px-4 py-2.5 rounded-xl text-[14px] flex items-center justify-between outline-none" style={inputStyle}>
                <span>{template}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {tplOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTplOpen(false)} />
                  <div className="absolute left-0 right-0 top-12 z-50 rounded-xl py-1.5 modal-enter" style={{ backgroundColor: "var(--th-bg-card)", boxShadow: "0 12px 32px rgba(0,0,0,0.18)", border: "1px solid var(--th-border)" }}>
                    {tplList.map((t) => (
                      <div key={t} className="flex items-center px-3.5 py-2 transition-colors" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <button onClick={() => { setTemplate(t); setTplName(t); setTplOpen(false); }} className="flex-1 text-left text-[13px] font-medium" style={{ color: "var(--th-text-primary)" }}>{t}</button>
                        <button onClick={() => { setTemplate(t); setTplName(t); setTplOpen(false); }} className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#142B53" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div><FieldLabel>Template name</FieldLabel><input value={tplName} onChange={(e) => setTplName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={inputStyle} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Header image</FieldLabel>
              <div className="h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-hover)" }}>
                <span className="px-1.5 py-1 rounded text-[9px] font-bold text-white" style={{ backgroundColor: "#595959" }}>SANGOMA</span>
                <button className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--th-text-primary)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
                  Replace
                </button>
              </div>
            </div>
            <div>
              <FieldLabel hint="(PNG/JPG)">Footer image</FieldLabel>
              <button onClick={() => setFooterName("footer_1500x500.png")} className="w-full h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span className="text-[11px] truncate max-w-[130px]" style={{ color: "var(--th-text-muted)" }}>{footerName ?? "Click to upload"}</span>
              </button>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--th-text-primary)" }}><span className="font-semibold">Please note: </span><span style={{ color: "var(--th-text-secondary)" }}>(Header and footer images must be 1500px x 500px max, PNG/JPG only)</span></p>
          <div><FieldLabel>Attention</FieldLabel><input value={attention} onChange={(e) => setAttention(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={inputStyle} /></div>
          <div><FieldLabel>Subject</FieldLabel><input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={inputStyle} /></div>
          <button onClick={() => setShowPreview(true)} className="w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            Preview cover sheet
          </button>
          <button onClick={() => { const name = tplName.trim() || template; setTplList((list) => list.map((x) => (x === template ? name : x))); setTemplate(name); onNotify?.("Template saved", name); }} className="w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            Save
          </button>
        </>
      )}
      {showPreview && (
        <CoverSheetPreview
          from={from}
          to={to}
          subject={subject}
          message={message}
          onBack={() => setShowPreview(false)}
          onUse={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

/* ── Cover sheet preview modal (Figma 7943:8667) ── */
function CoverSheetPreview({ from, to, subject, message, onBack, onUse }: {
  from: string; to: string; subject: string; message: string; onBack: () => void; onUse: () => void;
}) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
  return (
    <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onBack}>
      <div className="modal-enter rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]" style={{ backgroundColor: "var(--th-bg-card)", width: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <h2 className="text-lg font-bold" style={{ color: "var(--th-text-primary)" }}>Cover sheet preview</h2>
          <button onClick={onBack} className="btn-icon p-1 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Rendered cover-sheet document */}
        <div className="px-6 pb-5 overflow-y-auto flex-1">
          <div className="mx-auto rounded-lg bg-white text-black px-7 py-7 shadow-md" style={{ width: 380 }}>
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-6 border-b border-black/10">
              <span className="text-[19px] font-black tracking-tight" style={{ color: "#111" }}>Star<span style={{ color: "#7ED321" }}>2</span>Star</span>
              <span className="text-[10px] leading-tight pl-2.5 border-l border-black/20" style={{ color: "#555" }}>Scalable Cloud<br />Communications</span>
            </div>

            {/* From / To grid */}
            <div className="grid grid-cols-2 gap-0 mt-10 border border-black/60 text-[8px] leading-[1.7]">
              <div className="p-2 border-r border-black/60">
                <Row k="From:" v="(555) 555-5555" />
                <Row k="Sender:" v={from} />
                <Row k="Company:" v="EasyGoing Inc." />
                <Row k="Subject:" v={subject || "—"} />
              </div>
              <div className="p-2">
                <Row k="To:" v={to} />
                <Row k="Attention:" v="Billing Dept" />
                <Row k="Date:" v={today} />
                <Row k="Pages:" v="1" />
              </div>
            </div>

            {/* Message */}
            <div className="mt-4 text-[8px] leading-[1.7]">
              <span className="font-bold">Message:</span>
              <p className="mt-1 pl-3" style={{ color: "#333" }}>{message || "—"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
          <button onClick={onBack} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Back to edit</button>
          <button onClick={onUse} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Use this cover sheet</button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-1">
      <span className="font-bold shrink-0" style={{ minWidth: 42 }}>{k}</span>
      <span className="truncate" style={{ color: "#333" }}>{v}</span>
    </div>
  );
}

function ComposeFaxDialog({ onClose, onSent, onNotify }: { onClose: () => void; onSent: (a: string, b: string) => void; onNotify?: (title: string, sub: string) => void }) {
  const [from, setFrom] = useState(senderNumbers[0]);
  const [chips, setChips] = useState<string[]>([]);
  const [recipInput, setRecipInput] = useState("");
  const [includeCover, setIncludeCover] = useState(false);
  const [coverOnly, setCoverOnly] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [coverTab, setCoverTab] = useState<"default" | "custom">("default");
  const [subject, setSubject] = useState("Signed NDA — Q2 kickoff");
  const [message, setMessage] = useState("Please find the signed NDA attached. Reach out with any questions before Friday's kickoff.");
  const [template, setTemplate] = useState("Cover for legal");

  // Cover-only forces the cover sheet on.
  const includeOn = includeCover || coverOnly;
  const hasRecipient = chips.length > 0 || recipInput.trim().length > 0;
  // A fax must carry something: an attachment, or a cover sheet.
  const canSend = hasRecipient && (coverOnly || files.length > 0 || includeOn);
  const send = () => {
    const pending = recipInput.trim();
    const list = pending ? [...chips, pending] : chips;
    if (pending) { setChips(list); setRecipInput(""); }
    if (list.length === 0) return;
    onSent(subject, includeOn ? `${list[0] ?? "Recipient"} · ${subject}` : `${list[0] ?? "Recipient"} · ${files.length} file(s)`);
  };

  return (
    <DialogShell onClose={onClose} width={560}>
      <DialogHeader title="New fax. Recipients & cover sheet" onClose={onClose} />
      <div className="px-6 py-5 overflow-y-auto flex-1">
        <div className="space-y-5">
          <div>
            <FieldLabel hint="(personal fax number)">From</FieldLabel>
            <Select value={from} onChange={setFrom} options={senderNumbers} />
          </div>
          <div>
            <FieldLabel required>Recipients</FieldLabel>
            <RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} value={recipInput} onValueChange={setRecipInput} />
          </div>
          {!coverOnly && (
            <div>
              <FieldLabel hint="· PDF, JPG, PNG, TIFF · max 20 MB">Attachments</FieldLabel>
              {files.length === 0 ? (
                <button onClick={() => setFiles([{ name: "Document.pdf", size: "0.8 MB" }])} className="w-full py-7 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Click to upload or drag a file</div>
                  <div className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>One file per fax</div>
                </button>
              ) : (
                <div className="space-y-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px]" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      <span className="flex-1 truncate font-medium" style={{ color: "var(--th-text-primary)" }}>{f.name}</span>
                      <span style={{ color: "var(--th-text-muted)" }}>{f.size}</span>
                      <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-[#EF4444]" data-tip="Remove file">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <Checkbox
            label="Send a cover sheet only"
            checked={coverOnly}
            onToggle={() => { const next = !coverOnly; setCoverOnly(next); if (next) setIncludeCover(true); }}
          />
          <div className="pt-1 border-t" style={{ borderColor: "var(--th-border)" }}>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Include a cover sheet</span>
                <HelpIcon tip="A cover sheet adds a title page with sender, recipient, subject and message." />
              </div>
              <Toggle
                on={includeOn}
                onToggle={() => { if (coverOnly) return; setIncludeCover(!includeCover); }}
              />
            </div>
          </div>
          {includeOn && (
            <CoverFields
              coverTab={coverTab} setCoverTab={setCoverTab}
              subject={subject} setSubject={setSubject}
              message={message} setMessage={setMessage}
              template={template} setTemplate={setTemplate}
              from={from} to={chips[0] || recipInput.trim() || "—"}
              onNotify={onNotify}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
        <button onClick={send} disabled={!canSend} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Send fax</button>
      </div>
    </DialogShell>
  );
}

/* ── Compose V2 — 2-step Figma flow (node 8338-85822) ──
   Step 1 "Recipients & attachment": from, recipients, two cover-sheet
   toggles, then attachments.  Step 2 "Cover sheet": Default cover /
   Custom template.  No stepper — matches Figma 1:1.                        */
function ComposeFaxDialogV2({ onClose, onSent }: { onClose: () => void; onSent: (a: string, b: string) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState(senderNumbers[0]);
  const [chips, setChips] = useState<string[]>([]);
  const [recipInput, setRecipInput] = useState("");
  const [includeCover, setIncludeCover] = useState(false);
  const [coverOnly, setCoverOnly] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [coverTab, setCoverTab] = useState<"default" | "custom">("default");
  const [subject, setSubject] = useState("Signed NDA — Q2 kickoff");
  const [message, setMessage] = useState("Please find the signed NDA attached. Reach out with any questions before Friday's kickoff.");
  const [template, setTemplate] = useState("Cover for legal");
  const [showPreview, setShowPreview] = useState(false);

  const includeOn = includeCover || coverOnly;
  const hasRecipient = chips.length > 0 || recipInput.trim().length > 0;
  const canProceed = hasRecipient && (includeOn || files.length > 0);
  const to = chips[0] || recipInput.trim() || "—";

  const commitRecipients = () => {
    const pending = recipInput.trim();
    const list = pending ? [...chips, pending] : chips;
    if (pending) { setChips(list); setRecipInput(""); }
    return list;
  };
  const send = () => {
    const list = commitRecipients();
    if (list.length === 0) return;
    onSent(subject, includeOn ? `${list[0] ?? "Recipient"} · ${subject}` : `${list[0] ?? "Recipient"} · ${files.length} file(s)`);
  };
  const goNext = () => {
    const list = commitRecipients();
    if (list.length === 0) return;
    if (includeOn) setStep(2);
    else send();
  };

  return (
    <DialogShell onClose={onClose} width={560}>
      <DialogHeader
        title={step === 1 ? "New fax. Recipients & attachment" : "New fax. Cover sheet"}
        onClose={onClose}
      />

      <div className="px-6 py-5 overflow-y-auto flex-1">
        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <FieldLabel hint="(personal fax number)">From</FieldLabel>
              <Select value={from} onChange={setFrom} options={senderNumbers} />
            </div>
            <div>
              <FieldLabel required>Recipients</FieldLabel>
              <RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} value={recipInput} onValueChange={setRecipInput} />
            </div>

            {/* Two toggles, divider-separated (Figma) */}
            <div className="border-b" style={{ borderColor: "var(--th-border)" }}>
              <div className="flex items-center justify-between py-3.5 border-t" style={{ borderColor: "var(--th-border)" }}>
                <span className="text-[14px] font-medium" style={{ color: "var(--th-text-primary)" }}>Include a cover sheet</span>
                <Toggle on={includeCover} onToggle={() => setIncludeCover((v) => !v)} />
              </div>
              <div className="flex items-center justify-between py-3.5 border-t" style={{ borderColor: "var(--th-border)" }}>
                <span className="text-[14px] font-medium" style={{ color: "var(--th-text-primary)" }}>Send a cover sheet only</span>
                <Toggle on={coverOnly} onToggle={() => setCoverOnly((v) => !v)} />
              </div>
            </div>

            {!coverOnly && (
              <div>
                <FieldLabel hint="· PDF, JPG, PNG, TIFF · max 20 MB">Attachments</FieldLabel>
                {files.length === 0 ? (
                  <button onClick={() => setFiles([{ name: "NDA_signed_final.pdf", size: "1.2 MB" }])} className="w-full py-7 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <div className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Click to upload or drag files</div>
                    <div className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>Multiple files supported</div>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px]" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        <span className="flex-1 truncate font-medium" style={{ color: "var(--th-text-primary)" }}>{f.name}</span>
                        <span style={{ color: "var(--th-text-muted)" }}>{f.size}</span>
                        <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-[#EF4444]" data-tip="Remove file">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b -mt-1" style={{ borderColor: "var(--th-border)" }}>
              {([["default", "Default cover"], ["custom", "Custom template"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setCoverTab(id)} className="pb-2.5 text-[14px] font-semibold transition-colors relative" style={{ color: coverTab === id ? "var(--th-text-primary)" : "var(--th-text-muted)" }}>
                  {label}
                  {coverTab === id && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "#142B53" }} />}
                </button>
              ))}
            </div>

            {coverTab === "default" ? (
              <>
                {/* Sangoma banner */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ backgroundColor: "rgba(130,86,208,0.08)" }}>
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ background: "linear-gradient(135deg,#8B5CF6,#6D28D9)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "var(--th-text-primary)" }}>Sangoma standard cover page</p>
                    <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: "var(--th-text-muted)" }}>A clean built-in cover sheet is generated automatically — no header or footer image needed.</p>
                  </div>
                </div>
                <div>
                  <FieldLabel hint="(personal fax number)">From</FieldLabel>
                  <Select value={from} onChange={setFrom} options={senderNumbers} />
                </div>
                <div>
                  <FieldLabel required>Recipients</FieldLabel>
                  <RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} value={recipInput} onValueChange={setRecipInput} />
                </div>
                <div>
                  <FieldLabel>Subject</FieldLabel>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject of this fax" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none placeholder:text-[#9AA3AB]" style={inputStyle} />
                </div>
                <div>
                  <FieldLabel hint="(Optional)">Message</FieldLabel>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Write a short message for the cover sheet…" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none resize-none placeholder:text-[#9AA3AB]" style={inputStyle} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <FieldLabel hint="(choose one)">Template</FieldLabel>
                  <Select value={template} onChange={setTemplate} options={["Cover for legal", "Cover for medical"]} />
                </div>
                <button onClick={() => setShowPreview(true)} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  Preview cover sheet
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        {step === 1 ? (
          <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
        ) : (
          <button onClick={() => setStep(1)} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Back</button>
        )}
        {step === 1 ? (
          <button onClick={goNext} disabled={!canProceed} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>{includeOn ? "Next: cover sheet" : "Send fax"}</button>
        ) : (
          <button onClick={send} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Send fax</button>
        )}
      </div>

      {showPreview && (
        <CoverSheetPreview from={from} to={to} subject={subject} message={message} onBack={() => setShowPreview(false)} onUse={() => setShowPreview(false)} />
      )}
    </DialogShell>
  );
}

function Checkbox({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-2.5 group">
      <span
        className="w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 transition-colors"
        style={{
          borderColor: checked ? "#142B53" : "var(--th-border)",
          backgroundColor: checked ? "#142B53" : "var(--th-bg)",
        }}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </span>
      <span className="text-[14px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{label}</span>
    </button>
  );
}

function HelpIcon({ tip }: { tip: string }) {
  return (
    <span data-tip={tip} className="inline-flex items-center justify-center w-4 h-4 rounded-full cursor-help" style={{ backgroundColor: "var(--th-bg-hover)" }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2.2"><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" /><line x1="12" y1="17" x2="12" y2="17" /></svg>
    </span>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none appearance-none cursor-pointer" style={inputStyle}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
    </div>
  );
}

/* ── Forward ── */
function ForwardFaxDialog({ fax, onClose, onForward, onNotify }: { fax: FaxItem; onClose: () => void; onForward: () => void; onNotify?: (title: string, sub: string) => void }) {
  const [from, setFrom] = useState(senderNumbers[0]);
  const [chips, setChips] = useState<string[]>([]);
  const [recipInput, setRecipInput] = useState("");
  const [cover, setCover] = useState(false);
  const [message, setMessage] = useState("Please take a look at the documents the company sent us yesterday and let us know what you think. Thanks");
  const [coverTab, setCoverTab] = useState<"default" | "custom">("default");
  const [subject, setSubject] = useState(fax.subject);
  const [template, setTemplate] = useState("Cover for legal");

  const forward = () => {
    const pending = recipInput.trim();
    const list = pending ? [...chips, pending] : chips;
    if (pending) { setChips(list); setRecipInput(""); }
    if (list.length === 0) return;
    onForward();
  };

  return (
    <DialogShell onClose={onClose} width={560}>
      <DialogHeader title="Forward fax" onClose={onClose} />
      <div className="px-6 py-5 overflow-y-auto flex-1">
        <div className="space-y-5">
          <div><FieldLabel hint="(personal fax number)">From</FieldLabel><Select value={from} onChange={setFrom} options={senderNumbers} /></div>
          <div><FieldLabel required>Recipients</FieldLabel><RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} value={recipInput} onValueChange={setRecipInput} /></div>
          <div className="pt-1 border-t" style={{ borderColor: "var(--th-border)" }}>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Include a cover sheet</span>
                <HelpIcon tip="A cover sheet adds a title page with sender, recipient, subject and message." />
              </div>
              <Toggle on={cover} onToggle={() => setCover(!cover)} />
            </div>
          </div>
          <div>
            <FieldLabel hint="(original fax)">Forwarding</FieldLabel>
            <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ backgroundColor: "rgba(122,90,248,0.06)", border: "1px solid var(--th-border)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--th-bg-hover)" }}><PrinterIcon /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold truncate" style={{ color: "var(--th-text-primary)" }}>{fax.subject}</div>
                <div className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>From: {fax.number}</div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0" style={{ backgroundColor: "rgba(122,90,248,0.12)", color: "#7A5AF8" }}>{fax.pages} pages</span>
            </div>
          </div>
          {cover && (
            <CoverFields
              coverTab={coverTab} setCoverTab={setCoverTab}
              subject={subject} setSubject={setSubject}
              message={message} setMessage={setMessage}
              template={template} setTemplate={setTemplate}
              from={from} to={chips[0] || recipInput.trim() || "—"}
              onNotify={onNotify}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
        <button onClick={forward} disabled={chips.length === 0 && !recipInput.trim()} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Forward</button>
      </div>
    </DialogShell>
  );
}

/* ── New folder ── */
function NewFolderDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <DialogShell onClose={onClose} width={440}>
      <DialogHeader title="New folder" onClose={onClose} />
      <div className="px-6 py-5">
        <FieldLabel>Folder name</FieldLabel>
        <input value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="e.g. Q1 2026" className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={inputStyle} onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onCreate(name.trim()); }} />
      </div>
      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
        <button onClick={() => name.trim() && onCreate(name.trim())} className="btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider disabled:opacity-40" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }} disabled={!name.trim()}>Create folder</button>
      </div>
    </DialogShell>
  );
}

/* ── Rename folder (Figma 7943:8417) ── */
function RenameFolderDialog({ folder, onClose, onRename }: { folder: Folder; onClose: () => void; onRename: (name: string) => void }) {
  const [name, setName] = useState(folder.name);
  return (
    <DialogShell onClose={onClose} width={440}>
      <DialogHeader title="Rename folder" onClose={onClose} />
      <div className="px-6 py-5">
        <FieldLabel>Folder name</FieldLabel>
        <input value={name} onChange={(e) => setName(e.target.value)} autoFocus className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={inputStyle} onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onRename(name.trim()); }} />
      </div>
      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
        <button onClick={() => name.trim() && onRename(name.trim())} className="btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider disabled:opacity-40" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }} disabled={!name.trim()}>Save</button>
      </div>
    </DialogShell>
  );
}

/* ── Confirmation dialog (Figma 7634:22431) ── */
function ConfirmDialog({ title, message, confirmLabel = "Delete", onClose, onConfirm }: { title: string; message: string; confirmLabel?: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <DialogShell onClose={onClose} width={420}>
      <div className="px-6 pt-5 pb-2 flex items-start justify-between">
        <h2 className="text-lg font-bold" style={{ color: "var(--th-text-primary)" }}>{title}</h2>
        <button onClick={onClose} className="btn-icon p-1 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div className="px-6 pb-5">
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--th-text-secondary)" }}>{message}</p>
      </div>
      <div className="flex items-center justify-end gap-4 px-6 pb-5">
        <button onClick={onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>Cancel</button>
        <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider text-white transition-colors" style={{ backgroundColor: "#E5231B" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C81E17")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E5231B")}>{confirmLabel}</button>
      </div>
    </DialogShell>
  );
}

/* ── Advanced search ── */
function AdvancedSearchDialog({ onClose }: { onClose: () => void }) {
  const [keyword, setKeyword] = useState("");
  const results = [
    { num: "+1234567890", dir: "outbound" as FaxStatus, pages: 4, date: "07/29/2026" },
    { num: "+1234567890", dir: "inbound" as FaxStatus, pages: 12, date: "12/25/2025" },
    { num: "+1234567890", dir: "outbound" as FaxStatus, pages: 145, date: "3/2/2025" },
    { num: "+1234567890", dir: "inbound" as FaxStatus, pages: 1, date: "12/30/1999" },
  ];
  return (
    <DialogShell onClose={onClose} width={560}>
      <DialogHeader title="Advanced search" onClose={onClose} />
      <div className="px-6 py-5 border-b" style={{ borderColor: "var(--th-border)" }}>
        <FieldLabel hint="(OCR-searches first 5 pages of every fax)">Keyword</FieldLabel>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-4" style={inputStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA3AB" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. policy renewal" className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#9AA3AB]" style={{ color: "var(--th-text-primary)" }} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><FieldLabel>From date</FieldLabel><Select value="Jan 1, 2026" onChange={() => {}} options={["Jan 1, 2026", "Jan 1, 2025", "Jan 1, 2024"]} /></div>
          <div><FieldLabel>To date</FieldLabel><Select value="Jul 12, 2026" onChange={() => {}} options={["Jul 12, 2026", "Dec 31, 2026"]} /></div>
          <div><FieldLabel>Result limit</FieldLabel><Select value="Top 50" onChange={() => {}} options={["Top 50", "Top 100", "All"]} /></div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Apply</button>
        </div>
      </div>
      <div className="px-6 py-4 overflow-y-auto flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--th-text-muted)" }}>{results.length} results</div>
        <div className="space-y-1">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer" onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--th-bg-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--th-bg-hover)" }}><PrinterIcon /></div>
              <span className="text-[14px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{r.num}</span>
              <StatusBadge status={r.dir} />
              <div className="flex-1" />
              <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--th-text-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                {r.pages}
              </span>
              <span className="text-[12px] w-20 text-right" style={{ color: "var(--th-text-muted)" }}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </DialogShell>
  );
}

