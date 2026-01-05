"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Wallet, Banknote, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Currency } from "./CurrencyToggle";

interface PortfolioSummaryProps {
  currency: Currency;
  refreshKey?: number;
}

interface CashBalances {
  ILS: number;
  USD: number;
}

function formatCurrency(value: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

export function PortfolioSummary({
  currency,
  refreshKey = 0,
}: PortfolioSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [cashBalances, setCashBalances] = useState<CashBalances>({
    ILS: 0,
    USD: 0,
  });

  const fetchCashBalances = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCashBalances({ ILS: 0, USD: 0 });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cash_balances")
      .select("currency, balance")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cash balances:", error);
      setIsLoading(false);
      return;
    }

    // Sum balances by currency
    const balances: CashBalances = { ILS: 0, USD: 0 };
    (data || []).forEach((row) => {
      if (row.currency === "ILS") {
        balances.ILS += Number(row.balance) || 0;
      } else if (row.currency === "USD") {
        balances.USD += Number(row.balance) || 0;
      }
    });

    setCashBalances(balances);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCashBalances();
  }, [fetchCashBalances, refreshKey]);

  // For now, total value is just cash (will include holdings later)
  const totalValue = currency === "ILS" ? cashBalances.ILS : cashBalances.USD;

  // Mock profit/loss data (will be calculated from transactions later)
  const profitLoss = 0;
  const profitLossPercent = 0;
  const isPositive = profitLoss >= 0;

  const cards = [
    {
      title: "מזומן ₪",
      value: formatCurrency(cashBalances.ILS, "ILS"),
      icon: Banknote,
      description: "יתרת שקלים",
    },
    {
      title: "מזומן $",
      value: formatCurrency(cashBalances.USD, "USD"),
      icon: DollarSign,
      description: "יתרת דולרים",
    },
    {
      title: "שווי כולל",
      value: formatCurrency(totalValue, currency),
      icon: Wallet,
      description: `במטבע ${currency === "ILS" ? "שקלים" : "דולרים"}`,
    },
    {
      title: "תשואה",
      value: `${isPositive ? "+" : ""}${profitLossPercent.toFixed(2)}%`,
      icon: TrendingUp,
      description: "בקרוב...",
      valueClassName: isPositive ? "text-green-600" : "text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.valueClassName || ""}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
