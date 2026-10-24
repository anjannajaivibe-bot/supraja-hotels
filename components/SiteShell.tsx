"use client";

import { Suspense, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/FloatingCTA";
import FloatingSubscribe from "@/components/FloatingSubscribe";
import VisitorClickTracker from "@/components/VisitorClickTracker";

// Session recordings belong on the public booking website, not in hotel operations.
// A full reload after returning from a protected route creates a fresh Clarity session.
let clarityStoppedForProtectedRoute = false;
type ClarityWindow = Window & {
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
};

function ClarityPublicTracker({ pathname }: { pathname: string }) {
  useLayoutEffect(() => {
    const protectedRoute =
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      pathname === "/attendance-verify" ||
      pathname.startsWith("/attendance-verify/");
    const clarityWindow = window as ClarityWindow;

    if (protectedRoute) {
      if (clarityWindow.clarity) {
        clarityWindow.clarity("stop");
        clarityStoppedForProtectedRoute = true;
      }
      return;
    }

    if (clarityStoppedForProtectedRoute) {
      clarityStoppedForProtectedRoute = false;
      window.location.reload();
      return;
    }

    // Inject on public pages only. The snippet is asynchronous and keeps the
    // public site usable even when the third-party script is blocked.
    if (clarityWindow.clarity) return;
    const queue: unknown[][] = [];
    const clarity = Object.assign(
      (...args: unknown[]) => { queue.push(args); },
      { q: queue }
    );
    clarityWindow.clarity = clarity;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.clarity.ms/tag/z2k4pm5pcc";
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/attendance-verify")) {
    return <><ClarityPublicTracker pathname={pathname} />{children}</>;
  }

  return (
    <>
      <ClarityPublicTracker pathname={pathname} />
      <Header />
      <div className="m-0 block bg-white p-0">{children}</div>
      <Footer />
      <FloatingSubscribe />
      <FloatingCTA />
      <Suspense fallback={null}>
        <VisitorClickTracker />
      </Suspense>
    </>
  );
}
