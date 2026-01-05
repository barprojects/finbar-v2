"use client";

import { useState } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { PerformancePanel } from "@/components/dashboard/PerformancePanel";
import type { Currency } from "@/components/dashboard/CurrencyToggle";

export default function DashboardPage() {
  const [currency, setCurrency] = useState<Currency>("ILS");

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar currency={currency} onCurrencyChange={setCurrency} />

      <main className="flex-1 space-y-6 p-6">
        <PortfolioSummary currency={currency} />

        <div className="grid gap-6 lg:grid-cols-2">
          <PortfolioChart />
          <PerformancePanel currency={currency} />
        </div>
      </main>
    </div>
  );
}
