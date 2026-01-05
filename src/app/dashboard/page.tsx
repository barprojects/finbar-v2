"use client";

import { useState, useCallback } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { PerformancePanel } from "@/components/dashboard/PerformancePanel";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import type { Currency } from "@/components/dashboard/CurrencyToggle";

export default function DashboardPage() {
  const [currency, setCurrency] = useState<Currency>("ILS");
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);

  const handleTransactionAdded = useCallback(() => {
    setTransactionsRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        currency={currency}
        onCurrencyChange={setCurrency}
        onTransactionAdded={handleTransactionAdded}
      />

      <main className="flex-1 space-y-6 p-6">
        <PortfolioSummary currency={currency} refreshKey={transactionsRefreshKey} />

        <TransactionsList refreshKey={transactionsRefreshKey} />

        <div className="grid gap-6 lg:grid-cols-2">
          <PortfolioChart />
          <PerformancePanel currency={currency} />
        </div>
      </main>
    </div>
  );
}
