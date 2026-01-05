"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { usePortfolios } from "@/contexts/PortfoliosContext";
import { formatCurrency } from "@/lib/format";
import { type Transaction, type DepositPayload } from "@/types/transaction";
import { Receipt } from "lucide-react";

interface TransactionsListProps {
  refreshKey?: number;
}

const TYPE_LABELS: Record<string, string> = {
  deposit: "הפקדה",
  withdrawal: "משיכה",
  buy: "קנייה",
  sell: "מכירה",
  dividend: "דיבידנד",
};

export function TransactionsList({ refreshKey = 0 }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { portfolios } = usePortfolios();

  const fetchTransactions = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
      return;
    }

    const mappedTransactions: Transaction[] = (data || []).map((t) => {
      const portfolio = portfolios.find((p) => p.id === t.portfolio_id);
      return {
        id: t.id,
        portfolioId: t.portfolio_id,
        portfolioName: portfolio?.name || "—",
        date: t.date,
        type: t.type as Transaction["type"],
        payload: t.payload as Transaction["payload"],
        createdAt: t.created_at || "",
      };
    });

    setTransactions(mappedTransactions);
    setIsLoading(false);
  }, [portfolios]);

  useEffect(() => {
    if (portfolios.length > 0 || !isLoading) {
      fetchTransactions();
    }
  }, [fetchTransactions, portfolios.length, refreshKey, isLoading]);

  const formatAmount = (payload: Transaction["payload"]) => {
    if ("amount" in payload && "currency" in payload) {
      const depositPayload = payload as DepositPayload;
      return formatCurrency(depositPayload.amount, depositPayload.currency);
    }
    return "—";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            עסקאות אחרונות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          עסקאות אחרונות
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            אין עסקאות עדיין. לחץ על &quot;פעולה חדשה&quot; כדי להתחיל.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">תיק</TableHead>
                <TableHead className="text-right">סוג</TableHead>
                <TableHead className="text-right">סכום</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="[direction:ltr] text-right">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.portfolioName}</TableCell>
                  <TableCell>{TYPE_LABELS[transaction.type] || transaction.type}</TableCell>
                  <TableCell className="[direction:ltr] text-right font-medium text-green-600">
                    +{formatAmount(transaction.payload)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
