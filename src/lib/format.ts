export type Currency = "ILS" | "USD";

export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
