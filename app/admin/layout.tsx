import type { Metadata } from "next";
import AdminGlobalNav from "./AdminGlobalNav";
import AdminDeviceGuard from "./AdminDeviceGuard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDeviceGuard><AdminGlobalNav />{children}</AdminDeviceGuard>;
}
