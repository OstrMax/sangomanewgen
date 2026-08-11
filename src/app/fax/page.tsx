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
  kind: "custom" | "drafts" | "trash";
}

const faxes: FaxItem[] = [
  { id: 1, box: "inbox", direction: "inbound", status: "inbound", contact: "Acme Insurance", number: "+1 (416) 555-0144", subject: "Policy Renewal Documents", pages: 4, date: "7/29/2026", time: "10:32 AM", unread: true, preview: "Please find enclosed the renewal documents for policy #AX-2024-8821...", folderId: "clients" },
  { id: 2, box: "inbox", direction: "inbound", status: "inbound", contact: "+16044996088", number: "+1 (604) 499-6088", subject: "Lab Results — Patient #4523", pages: 82, date: "12/25/2025", time: "9:15 AM", unread: true, preview: "Lab results for patient ID 4523. All values within normal range..." },
  { id: 3, box: "inbox", direction: "inbound", status: "inbound", contact: "+3512444735", number: "+35 124 447 35", subject: "Contract Amendment #3", pages: 5, date: "12/25/2025", time: "4:45 PM", preview: "Amendment to the original contract dated March 15, 2024. Section 4.2...", folderId: "legal" },
  { id: 4, box: "inbox", direction: "inbound", status: "inbound", contact: "Unknown", number: "+1 (416) 555-0998", subject: "Invoice #INV-9821", pages: 13, date: "12/25/2025", time: "2:18 PM", preview: "Invoice for services rendered. Total amount due: $1,250.00..." },
  { id: 5, box: "inbox", direction: "inbound", status: "inbound", contact: "+1123567856", number: "+1 (123) 567-856", subject: "Patient Referral", pages: 1, date: "12/25/2025", time: "11:00 AM", preview: "Referring patient for specialist consultation. Medical history attached..." },
  { id: 6, box: "sent", direction: "outbound", status: "outbound", contact: "Tax Office", number: "+1 (800) 555-0100", subject: "Tax Form Submission", pages: 5, date: "7/29/2026", time: "11:45 AM", preview: "Q1 2026 tax forms as requested. Please confirm receipt...", folderId: "tax2026" },
  { id: 7, box: "sent", direction: "outbound", status: "outbound", contact: "Bank of Toronto", number: "+1 (416) 555-0011", subject: "Loan Application", pages: 1, date: "12/25/2025", time: "8:30 AM", preview: "Application for business loan. Supporting documents enclosed..." },
  { id: 8, box: "sent", direction: "outbound", status: "outbound", contact: "Legal Dept", number: "+1 (647) 555-0888", subject: "NDA Signed Copy", pages: 1, date: "12/25/2025", time: "5:22 PM", preview: "Signed NDA agreement as discussed in our meeting...", folderId: "legal" },
  { id: 9, box: "sent", direction: "outbound", status: "outbound", contact: "Metro Health", number: "+1 (905) 555-0421", subject: "Quote Request Response", pages: 1, date: "12/25/2025", time: "10:00 AM", preview: "Response to quote request. Please find the proposed pricing..." },
  { id: 10, box: "sent", direction: "outbound", status: "outbound", contact: "+1123567856", number: "+1 (123) 567-856", subject: "Signed agreement", pages: 1, date: "12/25/2025", time: "9:41 AM", preview: "Signed agreement returned as requested..." },
  { id: 11, box: "outbox", direction: "outbound", status: "queued", contact: "Acme Insurance", number: "+1 (416) 555-0144", subject: "Policy Renewal Documents", pages: 4, date: "Today, 13:42 PM", time: "1:42 PM", preview: "Please find enclosed the renewal documents for policy #AX-2024-8821..." },
  { id: 12, box: "outbox", direction: "outbound", status: "failed", contact: "+16044996088", number: "+1 (604) 499-6088", subject: "Lab Results — Patient #4523", pages: 82, date: "Today, 13:42 PM", time: "1:42 PM", preview: "Lab results for patient ID 4523. Delivery failed after 3 attempts..." },
];

const initialFolders: Folder[] = [
  { id: "clients", name: "Clients", count: 12, kind: "custom" },
  { id: "legal", name: "Legal", count: 5, kind: "custom" },
  { id: "tax2026", name: "Tax 2026", count: 3, kind: "custom" },
  { id: "insurance", name: "Insurance", count: 8, kind: "custom" },
  { id: "drafts", name: "Drafts", count: 0, kind: "drafts" },
  { id: "trash", name: "Trash", count: 3, kind: "trash" },
];

const senderNumbers = ["+1 (416) 555-0100", "+1 (905) 555-0200", "+1 (647) 555-0300"];

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */
export default function FaxPage() {
  const [view, setView] = useState<string>("inbox"); // "inbox" | "sent" | "outbox" | folderId
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [showMoreFolders, setShowMoreFolders] = useState(false);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  // dialogs / overlays
  const [compose, setCompose] = useState<null | { mode: "new" }>(null);
  const [forwardFax, setForwardFax] = useState<FaxItem | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [moveMenu, setMoveMenu] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; sub: string } | null>(null);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    if (shouldAutoStartFaxTour()) {
      const t = setTimeout(() => setTourActive(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const isSystem = view === "inbox" || view === "sent" || view === "outbox";
  const activeFolder = folders.find((f) => f.id === view) || null;

  const fireToast = (title: string, sub: string) => {
    setToast({ title, sub });
    setTimeout(() => setToast(null), 4000);
  };

  const visibleFaxes = useMemo(() => {
    let list: FaxItem[];
    if (isSystem) list = faxes.filter((f) => f.box === view);
    else if (view === "drafts") list = [];
    else list = faxes.filter((f) => f.folderId === view);
    return list.filter(
      (f) =>
        f.contact.toLowerCase().includes(search.toLowerCase()) ||
        f.number.toLowerCase().includes(search.toLowerCase()) ||
        f.subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [view, isSystem, search]);

  const selected = faxes.find((f) => f.id === selectedId) || null;
  const unreadCount = faxes.filter((f) => f.box === "inbox" && f.unread).length;

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

  const visibleFolders = showMoreFolders ? folders : folders.slice(0, 5);

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
                className="btn-cta flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                New fax
              </button>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-2" data-fax-tour="search">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1" style={{ backgroundColor: "var(--th-bg-hover)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F888F" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Search faxes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm placeholder:text-[#7F888F] w-full"
                style={{ color: "var(--th-text-primary)" }}
              />
            </div>
            <button
              onClick={() => setShowSearch(true)}
              className="btn-icon flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
              style={{ backgroundColor: "var(--th-bg-hover)" }}
              data-tip="Advanced search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" /></svg>
            </button>
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
                    backgroundColor: active ? "var(--th-bg-hover)" : "transparent",
                    color: active ? "var(--th-tab-active)" : "var(--th-text-secondary)",
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

        {/* Count label */}
        <div className="flex items-center justify-between px-5 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--th-text-muted)" }}>{visibleFaxes.length} {visibleFaxes.length === 1 ? "fax" : "faxes"}</span>
          {checkedIds.size === 0 && visibleFaxes.length > 0 && (
            <button onClick={() => visibleFaxes[0] && toggleCheck(visibleFaxes[0].id)} className="text-[11px] font-semibold uppercase tracking-wider transition-colors" style={{ color: "var(--th-text-secondary)" }}>Select</button>
          )}
        </div>

        {/* Fax list */}
        <div className="flex-1 overflow-y-auto" data-fax-tour="list">
          {visibleFaxes.length === 0 ? (
            <EmptyList label={view === "drafts" ? "No drafts" : `No ${isSystem ? view : "faxes"}`} sub={view === "drafts" ? "Drafts you save will appear here" : "Faxes will appear here"} />
          ) : (
            visibleFaxes.map((fax) => (
              <FaxRow
                key={fax.id}
                fax={fax}
                selected={selectedId === fax.id}
                checked={checkedIds.has(fax.id)}
                onSelect={() => setSelectedId(fax.id)}
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
              return (
                <button
                  key={f.id}
                  onClick={() => switchView(f.id)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: active ? "var(--th-bg-hover)" : "transparent" }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <FolderIcon kind={f.kind} />
                  <span className="flex-1 text-[13px] font-medium truncate" style={{ color: "var(--th-text-primary)" }}>{f.name}</span>
                  <span className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>{f.count}</span>
                </button>
              );
            })}
          </div>
          {folders.length > 5 && (
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
                      <MenuItem label="Block number" danger onClick={() => { setKebabOpen(false); fireToast("Number blocked", selected.number); }} />
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
                <IconBtn tip="Delete" danger onClick={() => { setSelectedId(null); fireToast("Moved to Trash", selected.subject); }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></IconBtn>
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
          <BulkBtn label="Delete" danger onClick={() => { const n = checkedIds.size; clearChecks(); fireToast("Moved to Trash", `${n} fax(es) deleted`); }} icon={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /></>} />
          <button onClick={clearChecks} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      {/* ───────── Dialogs / overlays ───────── */}
      {compose && <ComposeFaxDialog onClose={() => setCompose(null)} onSent={(sub, sub2) => { setCompose(null); fireToast("Fax sent", sub2); }} />}
      {forwardFax && <ForwardFaxDialog fax={forwardFax} onClose={() => setForwardFax(null)} onForward={() => { setForwardFax(null); fireToast("Fax forwarded", forwardFax.subject); }} />}
      {showNewFolder && <NewFolderDialog onClose={() => setShowNewFolder(false)} onCreate={createFolder} />}
      {showSearch && <AdvancedSearchDialog onClose={() => setShowSearch(false)} />}

      {/* Toast */}
      {toast && <Toast title={toast.title} sub={toast.sub} onClose={() => setToast(null)} />}

      {/* Contextual tutorial */}
      <FaxWalkthrough active={tourActive} onClose={() => setTourActive(false)} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Sub-components
──────────────────────────────────────────────────────────── */
function FaxRow({ fax, selected, checked, onSelect, onCheck }: { fax: FaxItem; selected: boolean; checked: boolean; onSelect: () => void; onCheck: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="w-full text-left px-4 py-3 flex gap-3 cursor-pointer group transition-colors"
      style={{ backgroundColor: selected ? "var(--th-active-conv-bg)" : fax.unread ? "var(--th-active-conv-bg)" : "transparent", borderBottom: "1px solid var(--th-border-light)" }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "var(--th-bg-hover)"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = fax.unread ? "var(--th-active-conv-bg)" : "transparent"; }}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onCheck(); }}
        className="mt-0.5 w-[18px] h-[18px] shrink-0 rounded-[5px] flex items-center justify-center transition-colors"
        style={{ border: checked ? "none" : "1.5px solid var(--th-border)", backgroundColor: checked ? "var(--th-fax-cta-bg)" : "transparent" }}
      >
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--th-fax-cta-text)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[14px] truncate ${fax.unread ? "font-bold" : "font-medium"}`} style={{ color: "var(--th-text-primary)" }}>
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

function FolderIcon({ kind }: { kind: Folder["kind"] }) {
  const stroke = "var(--th-text-secondary)";
  if (kind === "drafts")
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;
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
function Toast({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div className="absolute top-4 right-4 z-[300] flex items-start gap-3 px-4 py-3 rounded-xl toast-enter" style={{ backgroundColor: "var(--th-bg-card)", borderLeft: "4px solid #099F24", boxShadow: "0 12px 32px rgba(0,0,0,0.18)", minWidth: 300 }}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "rgba(9,159,36,0.15)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#099F24" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
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

function RecipientInput({ chips, onAdd, onRemove }: { chips: string[]; onAdd: (v: string) => void; onRemove: (i: number) => void }) {
  const [val, setVal] = useState("");
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
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === ",") && val.trim()) { e.preventDefault(); onAdd(val.trim()); setVal(""); } }}
        placeholder="Add fax number"
        className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] placeholder:text-[#9AA3AB]"
        style={{ color: "var(--th-text-primary)" }}
      />
    </div>
  );
}

/* ── Compose (2-step) ── */
/* ── Shared cover-sheet step (used by Compose & Forward) ── */
function CoverSheetStep({
  coverTab, setCoverTab, from, setFrom, chips, setChips, subject, setSubject, message, setMessage, template, setTemplate,
}: {
  coverTab: "default" | "custom" | "none";
  setCoverTab: (v: "default" | "custom" | "none") => void;
  from: string; setFrom: (v: string) => void;
  chips: string[]; setChips: (v: string[]) => void;
  subject: string; setSubject: (v: string) => void;
  message: string; setMessage: (v: string) => void;
  template: string; setTemplate: (v: string) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b" style={{ borderColor: "var(--th-border)" }}>
        {([["default", "Default cover"], ["custom", "Custom template"], ["none", "No cover"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setCoverTab(id)} className="pb-2.5 text-[14px] font-semibold transition-colors relative" style={{ color: coverTab === id ? "var(--th-text-primary)" : "var(--th-text-muted)" }}>
            {label}
            {coverTab === id && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--th-fax-cta-bg)" }} />}
          </button>
        ))}
      </div>

      {coverTab === "default" && (
        <>
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(122,90,248,0.08)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#7A5AF8" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            <div>
              <div className="text-[13px] font-bold" style={{ color: "var(--th-text-primary)" }}>Sangoma standard cover page</div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--th-text-secondary)" }}>A clean built-in cover sheet is generated automatically — no header or footer image needed.</div>
            </div>
          </div>
          <div><FieldLabel hint="(personal fax number)">From</FieldLabel><Select value={from} onChange={setFrom} options={senderNumbers} /></div>
          <div><FieldLabel required>Recipients</FieldLabel><RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} /></div>
          <div><FieldLabel>Subject</FieldLabel><input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none" style={inputStyle} /></div>
          <div><FieldLabel hint="(Optional)">Message</FieldLabel><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none resize-none" style={inputStyle} /></div>
        </>
      )}
      {coverTab === "custom" && (
        <>
          <div><FieldLabel hint="(choose one)">Template</FieldLabel><Select value={template} onChange={setTemplate} options={["Cover for legal", "Cover for clients", "Company default"]} /></div>
          <button onClick={() => setShowPreview(true)} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: "var(--th-bg-hover)", color: "var(--th-text-primary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            Preview cover sheet
          </button>
        </>
      )}
      {coverTab === "none" && (
        <div className="py-8 text-center">
          <p className="text-[13px]" style={{ color: "var(--th-text-secondary)" }}>No cover sheet will be sent. Only your attachments will be delivered.</p>
        </div>
      )}

      {showPreview && (
        <CoverSheetPreview
          from={from}
          to={chips[0] ?? "—"}
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
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onBack}>
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

function ComposeFaxDialog({ onClose, onSent }: { onClose: () => void; onSent: (a: string, b: string) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState(senderNumbers[0]);
  const [chips, setChips] = useState<string[]>(["+1 (905) 555-0287", "+1234657890"]);
  const [includeCover, setIncludeCover] = useState(true);
  const [coverOnly, setCoverOnly] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([{ name: "NDA_signed_final.pdf", size: "1.2 MB" }]);
  const [coverTab, setCoverTab] = useState<"default" | "custom" | "none">("default");
  const [subject, setSubject] = useState("Signed NDA — Q2 kickoff");
  const [message, setMessage] = useState("Please find the signed NDA attached. Reach out with any questions before Friday's kickoff.");
  const [template, setTemplate] = useState("Cover for legal");

  const goNext = () => {
    if (coverOnly || includeCover) setStep(2);
    else onSent(subject, `${chips[0] ?? "Recipient"} · ${files.length} file(s)`);
  };

  return (
    <DialogShell onClose={onClose} width={560}>
      <DialogHeader title={step === 1 ? "New fax. Recipients & attachment" : "New fax. Cover sheet"} onClose={onClose} />
      <div className="px-6 py-5 overflow-y-auto flex-1">
        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <FieldLabel hint="(personal fax number)">From</FieldLabel>
              <Select value={from} onChange={setFrom} options={senderNumbers} />
            </div>
            <div>
              <FieldLabel required>Recipients</FieldLabel>
              <RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} />
            </div>
            <ToggleRow label="Include a cover sheet" on={includeCover} onToggle={() => { setIncludeCover(!includeCover); if (!includeCover) setCoverOnly(false); }} />
            <ToggleRow label="Send a cover sheet only" on={coverOnly} onToggle={() => { setCoverOnly(!coverOnly); if (!coverOnly) setIncludeCover(false); }} />
            {!coverOnly && (
              <div>
                <FieldLabel hint="· PDF, JPG, PNG, TIFF · max 20 MB">Attachments</FieldLabel>
                <button onClick={() => setFiles([...files, { name: `Document_${files.length + 1}.pdf`, size: "0.8 MB" }])} className="w-full py-7 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors" style={{ borderColor: "var(--th-border)", backgroundColor: "var(--th-bg)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--th-text-primary)" }}>Click to upload or drag files</div>
                  <div className="text-[11px]" style={{ color: "var(--th-text-muted)" }}>Multiple files supported</div>
                </button>
                <div className="mt-2 space-y-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]" style={{ backgroundColor: "var(--th-bg-hover)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      <span className="flex-1 truncate font-medium" style={{ color: "var(--th-text-primary)" }}>{f.name}</span>
                      <span style={{ color: "var(--th-text-muted)" }}>{f.size}</span>
                      <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-[#EF4444]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <CoverSheetStep
            coverTab={coverTab} setCoverTab={setCoverTab}
            from={from} setFrom={setFrom}
            chips={chips} setChips={setChips}
            subject={subject} setSubject={setSubject}
            message={message} setMessage={setMessage}
            template={template} setTemplate={setTemplate}
          />
        )}
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        <span className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>Step {step} of 2</span>
        <div className="flex items-center gap-4">
          <button onClick={step === 2 ? () => setStep(1) : onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>{step === 2 ? "Back" : "Cancel"}</button>
          {step === 1 ? (
            <button onClick={goNext} className="btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>{includeCover || coverOnly ? "Next: Cover sheet" : "Send fax"}</button>
          ) : (
            <button onClick={() => onSent(subject, `${chips[0] ?? "Recipient"} · ${subject}`)} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Send fax</button>
          )}
        </div>
      </div>
    </DialogShell>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[14px] font-semibold" style={{ color: "var(--th-text-primary)" }}>{label}</span>
      <Toggle on={on} onToggle={onToggle} />
    </div>
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
function ForwardFaxDialog({ fax, onClose, onForward }: { fax: FaxItem; onClose: () => void; onForward: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState(senderNumbers[0]);
  const [chips, setChips] = useState<string[]>(["+1 (905) 555-0287", "+1234657890"]);
  const [cover, setCover] = useState(false);
  const [message, setMessage] = useState("Please take a look at the documents the company sent us yesterday and let us know what you think. Thanks");
  const [coverTab, setCoverTab] = useState<"default" | "custom" | "none">("default");
  const [subject, setSubject] = useState(fax.subject);
  const [template, setTemplate] = useState("Cover for legal");

  const goNext = () => {
    if (cover) setStep(2);
    else onForward();
  };

  return (
    <DialogShell onClose={onClose} width={560}>
      <DialogHeader title={step === 1 ? "Forward fax" : "Forward fax. Cover sheet"} onClose={onClose} />
      <div className="px-6 py-5 overflow-y-auto flex-1">
        {step === 1 ? (
          <div className="space-y-5">
            <div><FieldLabel hint="(personal fax number)">From</FieldLabel><Select value={from} onChange={setFrom} options={senderNumbers} /></div>
            <div><FieldLabel required>Recipients</FieldLabel><RecipientInput chips={chips} onAdd={(v) => setChips([...chips, v])} onRemove={(i) => setChips(chips.filter((_, j) => j !== i))} /></div>
            <ToggleRow label="Include a cover sheet" on={cover} onToggle={() => setCover(!cover)} />
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
            <div><FieldLabel hint="(Optional)">Message</FieldLabel><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none resize-none" style={inputStyle} /></div>
          </div>
        ) : (
          <CoverSheetStep
            coverTab={coverTab} setCoverTab={setCoverTab}
            from={from} setFrom={setFrom}
            chips={chips} setChips={setChips}
            subject={subject} setSubject={setSubject}
            message={message} setMessage={setMessage}
            template={template} setTemplate={setTemplate}
          />
        )}
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--th-border)" }}>
        <span className="text-[12px]" style={{ color: "var(--th-text-muted)" }}>{cover ? `Step ${step} of 2` : ""}</span>
        <div className="flex items-center gap-4">
          <button onClick={step === 2 ? () => setStep(1) : onClose} className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--th-text-secondary)" }}>{step === 2 ? "Back" : "Cancel"}</button>
          {step === 1 ? (
            <button onClick={goNext} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>{cover ? "Next: Cover sheet" : "Forward"}</button>
          ) : (
            <button onClick={onForward} className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--th-fax-cta-bg)", color: "var(--th-fax-cta-text)" }}>Forward</button>
          )}
        </div>
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

