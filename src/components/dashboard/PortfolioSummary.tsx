"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import type { Currency } from "./CurrencyToggle";

interface PortfolioSummaryProps {
  currency: Currency;
}

// Mock data
const mockData = {
  ILS: {
    totalValue: 245680,
    profitLoss: 12450,
    profitLossPercent: 5.34,
    totalAssets: 12,
  },
  USD: {
    totalValue: 67500,
    profitLoss: 3420,
    profitLossPercent: 5.34,
    totalAssets: 12,
  },
};

function formatCurrency(value: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

export function PortfolioSummary({ currency }: PortfolioSummaryProps) {
  const data = mockData[currency];
  const isPositive = data.profitLoss >= 0;

  const cards = [
    {
      title: "שווי התיק",
      value: formatCurrency(data.totalValue, currency),
      icon: Wallet,
      description: "שווי כולל של כל הנכסים",
    },
    {
      title: "רווח/הפסד",
      value: formatCurrency(data.profitLoss, currency),
      icon: isPositive ? TrendingUp : TrendingDown,
      description: isPositive ? "רווח כולל" : "הפסד כולל",
      valueClassName: isPositive ? "text-green-600" : "text-red-600",
    },
    {
      title: "תשואה",
      value: `${isPositive ? "+" : ""}${data.profitLossPercent.toFixed(2)}%`,
      icon: BarChart3,
      description: "תשואה מתחילת התקופה",
      valueClassName: isPositive ? "text-green-600" : "text-red-600",
    },
    {
      title: "מספר נכסים",
      value: data.totalAssets.toString(),
      icon: BarChart3,
      description: "נכסים בתיק",
    },
  ];

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
