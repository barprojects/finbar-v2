"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import type { Currency } from "./CurrencyToggle";

interface PerformancePanelProps {
  currency: Currency;
}

// Mock holdings data
const mockHoldings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 15,
    priceILS: 687.5,
    priceUSD: 189.25,
    changePercent: 2.34,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    quantity: 10,
    priceILS: 1520.8,
    priceUSD: 418.5,
    changePercent: 1.12,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 8,
    priceILS: 640.2,
    priceUSD: 176.2,
    changePercent: -0.85,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    quantity: 5,
    priceILS: 4380.5,
    priceUSD: 1205.5,
    changePercent: 3.67,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    quantity: 12,
    priceILS: 920.4,
    priceUSD: 253.25,
    changePercent: -1.23,
  },
];

function formatCurrency(value: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

export function PerformancePanel({ currency }: PerformancePanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          אחזקות בתיק
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="pb-3 text-right font-medium">נכס</th>
                <th className="pb-3 text-right font-medium">כמות</th>
                <th className="pb-3 text-right font-medium">מחיר</th>
                <th className="pb-3 text-right font-medium">שינוי</th>
              </tr>
            </thead>
            <tbody>
              {mockHoldings.map((holding) => {
                const isPositive = holding.changePercent >= 0;
                const price =
                  currency === "ILS" ? holding.priceILS : holding.priceUSD;

                return (
                  <tr key={holding.symbol} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{holding.symbol}</span>
                        <span className="text-xs text-muted-foreground">
                          {holding.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right [direction:ltr]">
                      {holding.quantity}
                    </td>
                    <td className="py-3 text-right [direction:ltr]">
                      {formatCurrency(price, currency)}
                    </td>
                    <td className="py-3">
                      <div
                        className={`flex items-center gap-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="[direction:ltr]">
                          {isPositive ? "+" : ""}
                          {holding.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
