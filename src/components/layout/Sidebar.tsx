"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export type NavItem = {
  icon: string;
  label: string;
  href: string;
  iconSize: number;
  extraPy?: boolean;
  badge?: boolean;
};

export const defaultNavItems: NavItem[] = [
  { icon: "/icons/home.svg", label: "Home", href: "/", iconSize: 24 },
  { icon: "/icons/chats.svg", label: "Chats", href: "/chats", iconSize: 24 },
  { icon: "/icons/talk.svg", label: "Talk", href: "/talk", iconSize: 28 },
  { icon: "/icons/operator-console.svg", label: "Operator\nconsole", href: "/operator", iconSize: 32, extraPy: true },
  { icon: "/icons/meet.svg", label: "Meet", href: "/meet", iconSize: 24 },
  { icon: "/icons/sms.svg", label: "SMS", href: "/sms", iconSize: 24 },
  { icon: "/icons/fax.svg", label: "Fax", href: "/fax", iconSize: 24 },
  { icon: "/icons/calendar.svg", label: "Calendar", href: "/calendar", iconSize: 24 },
  { icon: "/icons/files.svg", label: "Files", href: "/files", iconSize: 24 },
  { icon: "/icons/contact-center.svg", label: "CX", href: "/contact-center", iconSize: 24, badge: true },
];

const STORAGE_KEY = "th-tab-order";

/* Get the ordered tabs from localStorage, falling back to default */
export function getOrderedNavItems(): NavItem[] {
  if (typeof window === "undefined") return defaultNavItems;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultNavItems;
    const order: string[] = JSON.parse(stored);
    // Reorder defaults by stored hrefs, append any new items not in saved order
    const itemsByHref = new Map(defaultNavItems.map((item) => [item.href, item]));
    const ordered: NavItem[] = [];
    for (const href of order) {
      const item = itemsByHref.get(href);
      if (item) {
        ordered.push(item);
        itemsByHref.delete(href);
      }
    }
    // Append any items not in stored order (e.g. new tabs added later)
    for (const item of itemsByHref.values()) ordered.push(item);
    return ordered;
  } catch {
    return defaultNavItems;
  }
}

export function saveTabOrder(items: NavItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map((i) => i.href)));
    // Notify other components to re-read
    window.dispatchEvent(new Event("th-tab-order-changed"));
  } catch {
    /* ignore */
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  useEffect(() => {
    setNavItems(getOrderedNavItems());
    const handler = () => setNavItems(getOrderedNavItems());
    window.addEventListener("th-tab-order-changed", handler);
    return () => window.removeEventListener("th-tab-order-changed", handler);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 w-16 h-full pb-2 shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center w-full h-12 pt-4 pb-3.5 overflow-hidden">
        <Image src="/icons/logo.png" alt="TeamHub" width={36} height={24} priority />
      </Link>

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/");
        const extraPy = item.extraPy;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-14 rounded-lg relative no-underline transition-colors ${
              extraPy ? "py-1.5 my-1" : "h-14"
            } ${
              !isActive ? "hover:bg-white/10" : ""
            }`}
            style={isActive ? { backgroundColor: "var(--th-sidebar-active)" } : undefined}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={item.iconSize}
              height={item.iconSize}
              className={`shrink-0 transition-opacity ${isActive ? "opacity-100" : "opacity-70"}`}
            />
            <span
              className={`text-[10px] leading-3 text-center tracking-[0.4px] whitespace-pre-wrap w-[46px] font-[family-name:var(--font-manrope)] transition-all ${
                isActive
                  ? "text-white font-semibold"
                  : "text-white/70 font-medium"
              }`}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                className="absolute top-[6px] right-[10px] w-2.5 h-2.5 bg-[#fcc624] rounded-full"
                style={{ border: "2px solid var(--th-sidebar-badge-border)" }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
