"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TrendingUp } from "lucide-react";

type TimeRange = "1W" | "1M" | "3M" | "YTD" | "1Y";

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "1W", label: "שבוע" },
  { value: "1M", label: "חודש" },
  { value: "3M", label: "3 חודשים" },
  { value: "YTD", label: "מתחילת השנה" },
  { value: "1Y", label: "שנה" },
];

export function PortfolioChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          ביצועי התיק
        </CardTitle>
        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={(val) => {
            if (val) setTimeRange(val as TimeRange);
          }}
          className="bg-muted p-1 rounded-lg"
        >
          {timeRanges.map((range) => (
            <ToggleGroupItem
              key={range.value}
              value={range.value}
              aria-label={range.label}
              className="px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              {range.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {/* Placeholder for lightweight-charts */}
        <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-12 w-12" />
            <p className="text-sm">גרף ביצועים יוצג כאן</p>
            <p className="text-xs">טווח: {timeRanges.find(r => r.value === timeRange)?.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
