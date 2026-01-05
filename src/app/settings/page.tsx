"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PortfoliosSection } from "@/components/settings/PortfoliosSection";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-mr-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-semibold">הגדרות</h1>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <PortfoliosSection />
      </main>
    </div>
  );
}
