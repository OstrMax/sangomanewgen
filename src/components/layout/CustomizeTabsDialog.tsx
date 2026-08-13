"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type NavItem, defaultNavItems, getOrderedNavItems, saveTabOrder } from "./Sidebar";

export default function CustomizeTabsDialog({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(getOrderedNavItems());
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Add slight delay to apply drag styling after drag image is captured
    setTimeout(() => setDragOverIndex(index), 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setItems(next);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setItems(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    setItems(next);
  };

  const handleSave = () => {
    saveTabOrder(items);
    onClose();
  };

  const handleReset = () => {
    setItems(defaultNavItems);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="modal-enter w-[440px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--th-bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--th-text-primary)" }}>Customize tabs</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--th-text-muted)" }}>Drag to reorder your sidebar tabs</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--th-bg-hover)]"
            title="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab list */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {items.map((item, index) => {
            const isDragging = dragIndex === index;
            const isOver = dragOverIndex === index && dragIndex !== index;
            return (
              <div
                key={item.href}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all"
                style={{
                  backgroundColor: isOver ? "var(--th-bg-hover)" : "transparent",
                  opacity: isDragging ? 0.4 : 1,
                  borderTop: isOver ? "2px solid var(--th-tab-active)" : "2px solid transparent",
                }}
              >
                {/* Drag handle */}
                <div className="text-[var(--th-text-muted)] shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="15" cy="18" r="1.5" />
                  </svg>
                </div>

                {/* Icon (with dark background like the sidebar) */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--th-tab-active)" }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={item.iconSize === 32 ? 22 : item.iconSize === 28 ? 20 : 18}
                    height={item.iconSize === 32 ? 22 : item.iconSize === 28 ? 20 : 18}
                    className="opacity-90"
                  />
                </div>

                {/* Label */}
                <span className="flex-1 text-[14px] font-medium" style={{ color: "var(--th-text-primary)" }}>
                  {item.label.replace("\n", " ")}
                </span>

                {/* Up/Down buttons (accessible alternative to drag) */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[var(--th-bg-hover)]"
                    title="Move up"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[var(--th-bg-hover)]"
                    title="Move down"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-secondary)" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--th-border)" }}
        >
          <button
            onClick={handleReset}
            className="text-[13px] font-medium transition-colors"
            style={{ color: "var(--th-text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--th-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--th-text-secondary)")}
          >
            Reset to default
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors"
              style={{ color: "var(--th-text-secondary)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: "#001221" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
