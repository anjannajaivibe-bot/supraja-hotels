"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BedDouble,
  ClipboardCheck,
  Clock3,
  DoorOpen,
  Download,
  Home,
  ListChecks,
  LogOut,
  MousePointerClick,
  PackageSearch,
  ShieldAlert,
  Shirt,
  Users,
} from "lucide-react";

type Session = { role: "master" | "hotel_admin" };

const CACHE_KEY = "supraja-admin-nav-session";
const VERSION_KEY = "supraja-admin-app-version";

const baseItems = [
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/checklists", label: "Checklists", icon: ListChecks },
  { href: "/admin/attendance", label: "Attendance", icon: Users },
  { href: "/admin/controls", label: "Daily Controls", icon: ClipboardCheck },
  { href: "/admin/housekeeping", label: "Housekeeping", icon: DoorOpen },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/day-use", label: "Day Use Guests", icon: Clock3 },
  { href: "/admin/laundry", label: "Laundry", icon: Shirt },
  { href: "/admin/inventory", label: "Inventory", icon: PackageSearch },
  { href: "/admin/exceptions", label: "Exceptions", icon: ShieldAlert },
];

export default function AdminGlobalNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setSession(JSON.parse(cached));
        return;
      }
    } catch {}

    void (async () => {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const nextSession = { role: data.session.role } as Session;
      setSession(nextSession);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(nextSession));
      } catch {}
    })();
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    let cancelled = false;

    async function checkAppVersion() {
      try {
        const response = await fetch("/api/admin/app-version", { cache: "no-store" });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as { version?: string };
        if (!data.version) return;

        const previous = sessionStorage.getItem(VERSION_KEY);
        if (previous && previous !== data.version) {
          sessionStorage.setItem(VERSION_KEY, data.version);
          window.location.reload();
          return;
        }
        sessionStorage.setItem(VERSION_KEY, data.version);
      } catch {}
    }

    void checkAppVersion();
    const timer = window.setInterval(() => void checkAppVersion(), 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [pathname]);

  if (pathname === "/admin/login" || !session) return null;

  const items =
    session.role === "master"
      ? [
          ...baseItems,
          { href: "/admin/clicks", label: "Website Activity", icon: MousePointerClick },
          { href: "/admin/attendance-export", label: "Export", icon: Download },
          { href: "/admin/users", label: "Access", icon: Users },
        ]
      : baseItems;

  async function logout() {
    try {
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(VERSION_KEY);
    } catch {}
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                active ? "bg-blue-800 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => void logout()}
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 sm:text-sm"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
}
