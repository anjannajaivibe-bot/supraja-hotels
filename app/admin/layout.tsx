import type { Metadata } from "next";
import AdminGlobalNav from "./AdminGlobalNav";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><AdminGlobalNav />{children}</>;
}
