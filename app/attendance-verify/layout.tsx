import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Staff Attendance Verification | Supraja Hotels" },
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default function AttendanceVerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
