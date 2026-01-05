"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { CurrencyToggle, type Currency } from "./CurrencyToggle";
import { ActionDrawer } from "./ActionDrawer";

interface TopBarProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function TopBar({ currency, onCurrencyChange }: TopBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-mr-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-semibold">לוח בקרה</h1>
        </div>

        <div className="flex items-center gap-4">
          <CurrencyToggle value={currency} onChange={onCurrencyChange} />
          <Button onClick={() => setIsDrawerOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            פעולה חדשה
          </Button>
        </div>
      </header>

      <ActionDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  );
}
