"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardCheck, Home, ListChecks, LogOut, ShieldAlert, Users, Wrench, BedDouble, DoorOpen } from "lucide-react";

type Session = { role: "master" | "hotel_admin" };

const baseItems = [
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/checklists", label: "Checklists", icon: ListChecks },
  { href: "/admin/operations", label: "Attendance", icon: Users },
  { href: "/admin/controls", label: "Daily Controls", icon: ClipboardCheck },
  { href: "/admin/handovers", label: "Handover", icon: Wrench },
  { href: "/admin/housekeeping", label: "Housekeeping", icon: DoorOpen },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/exceptions", label: "Exceptions", icon: ShieldAlert },
];

export default function AdminGlobalNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    void (async () => {
      const r = await fetch("/api/admin/session", { cache: "no-store" });
      if (r.ok) {
        const d = await r.json();
        setSession(d.session);
      }
    })();
  }, [pathname]);

  if (pathname === "/admin/login" || pathname.startsWith("/admin/clicks") || !session) return null;
  const items = session.role === "master" ? [...baseItems, { href: "/admin/users", label: "Access", icon: Users }] : baseItems;

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        {items.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${active ? "bg-blue-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <Icon size={15} />{item.label}
            </Link>
          );
        })}
        <button onClick={()=>void logout()} className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 sm:text-sm">
          <LogOut size={15}/>Logout
        </button>
      </div>
    </nav>
  );
}
