"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type Currency = "ILS" | "USD";

interface CurrencyToggleProps {
  value: Currency;
  onChange: (value: Currency) => void;
}

export function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val as Currency);
      }}
      className="bg-muted p-1 rounded-lg"
    >
      <ToggleGroupItem
        value="ILS"
        aria-label="שקלים"
        className="px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        ₪
      </ToggleGroupItem>
      <ToggleGroupItem
        value="USD"
        aria-label="דולרים"
        className="px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        $
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
