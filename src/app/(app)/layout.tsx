"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav, MobileBottomNav } from "@/components/layout/mobile-nav";
import { GlobalSearch } from "@/components/layout/global-search";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex print:hidden" />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="print:hidden">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
        </div>
        
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8 print:p-0 print:pb-0">
          {children}
        </main>

        <div className="print:hidden">
          <MobileBottomNav onMore={() => setMobileOpen(true)} />
        </div>
      </div>

      <GlobalSearch />
    </div>
  );
}