export type TransactionType = "deposit" | "withdrawal" | "buy" | "sell" | "dividend";

export interface DepositPayload {
  currency: "ILS" | "USD";
  amount: number;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  portfolioName?: string; // For display purposes
  date: string;
  type: TransactionType;
  payload: DepositPayload | Record<string, unknown>;
  createdAt: string;
}

export interface DepositFormData {
  portfolioId: string;
  currency: "ILS" | "USD";
  amount: number;
  date: string;
}

export const DEFAULT_DEPOSIT_VALUES: DepositFormData = {
  portfolioId: "",
  currency: "ILS",
  amount: 0,
  date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
};
