import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Mystery Messages - Dashboard",
  description: "Manage your anonymous messages and settings",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-layout">
      <NavBar/>
      {children}
    </div>
  );
}
