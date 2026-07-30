"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/FloatingCTA";
import VisitorClickTracker from "@/components/VisitorClickTracker";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <>
      <Header />
      <div className="block bg-white">{children}</div>
      <Footer />
      <FloatingCTA />
      <Suspense fallback={null}>
        <VisitorClickTracker />
      </Suspense>
    </>
  );
}
