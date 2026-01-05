"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingCart,
  BadgeDollarSign,
  Coins,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { usePortfolios } from "@/contexts/PortfoliosContext";
import {
  type DepositFormData,
  DEFAULT_DEPOSIT_VALUES,
} from "@/types/transaction";

interface ActionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

type Step = "select" | "deposit";

const actions = [
  {
    id: "deposit",
    label: "הפקדה",
    description: "הפקדת כסף לתיק",
    icon: ArrowDownToLine,
    enabled: true,
  },
  {
    id: "withdrawal",
    label: "משיכה",
    description: "משיכת כסף מהתיק",
    icon: ArrowUpFromLine,
    enabled: false,
  },
  {
    id: "buy",
    label: "קנייה",
    description: "קניית נכס חדש",
    icon: ShoppingCart,
    enabled: false,
  },
  {
    id: "sell",
    label: "מכירה",
    description: "מכירת נכס קיים",
    icon: BadgeDollarSign,
    enabled: false,
  },
  {
    id: "dividend",
    label: "דיבידנד",
    description: "רישום דיבידנד שהתקבל",
    icon: Coins,
    enabled: false,
  },
];

export function ActionDrawer({
  open,
  onOpenChange,
  onTransactionAdded,
}: ActionDrawerProps) {
  const [step, setStep] = useState<Step>("select");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DepositFormData>(
    DEFAULT_DEPOSIT_VALUES
  );
  const { portfolios } = usePortfolios();

  const resetAndClose = () => {
    setStep("select");
    setFormData({
      ...DEFAULT_DEPOSIT_VALUES,
      date: new Date().toISOString().split("T")[0],
    });
    onOpenChange(false);
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === "deposit") {
      setFormData({
        ...DEFAULT_DEPOSIT_VALUES,
        date: new Date().toISOString().split("T")[0],
        portfolioId: portfolios.length > 0 ? portfolios[0].id : "",
      });
      setStep("deposit");
    } else {
      toast.info("פעולה זו תהיה זמינה בקרוב");
    }
  };

  const handleBack = () => {
    setStep("select");
    setFormData({
      ...DEFAULT_DEPOSIT_VALUES,
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveDeposit = async () => {
    // Validation
    if (!formData.portfolioId) {
      toast.error("יש לבחור תיק");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("יש להזין סכום חיובי");
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("יש להתחבר כדי לבצע פעולה");
        setIsLoading(false);
        return;
      }

      // Insert transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          portfolio_id: formData.portfolioId,
          date: formData.date,
          type: "deposit",
          payload: {
            currency: formData.currency,
            amount: formData.amount,
          },
        });

      if (transactionError) {
        console.error("Error saving deposit:", transactionError);
        toast.error("שגיאה בשמירת ההפקדה");
        setIsLoading(false);
        return;
      }

      // Update cash balance
      const { error: balanceError } = await supabase.rpc("upsert_cash_balance", {
        p_portfolio_id: formData.portfolioId,
        p_currency: formData.currency,
        p_amount: formData.amount,
      });

      if (balanceError) {
        console.error("Error updating cash balance:", balanceError);
        // Transaction was saved, so we show partial success
        toast.warning("ההפקדה נשמרה, אך היתרה לא התעדכנה");
      } else {
        toast.success("ההפקדה נשמרה בהצלחה");
      }
      onTransactionAdded?.();
      resetAndClose();
    } catch {
      toast.error("שגיאה בשמירת ההפקדה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={resetAndClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        {step === "select" && (
          <>
            <SheetHeader>
              <SheetTitle>פעולה חדשה</SheetTitle>
              <SheetDescription>
                בחר את סוג הפעולה שברצונך לבצע
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-3">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto flex-col items-start gap-1 p-4 text-right ${
                    !action.enabled ? "opacity-50" : ""
                  }`}
                  onClick={() => handleActionClick(action.id)}
                  disabled={!action.enabled}
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{action.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {action.description}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </>
        )}

        {step === "deposit" && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <SheetTitle>הפקדה חדשה</SheetTitle>
              </div>
              <SheetDescription>הזן את פרטי ההפקדה</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* Portfolio Selection */}
              <div className="space-y-2">
                <Label htmlFor="portfolio" className="block text-right">
                  תיק *
                </Label>
                <Select
                  value={formData.portfolioId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, portfolioId: value }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="portfolio">
                    <SelectValue placeholder="בחר תיק" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id}>
                        {portfolio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {portfolios.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    אין תיקים. יש ליצור תיק בהגדרות.
                  </p>
                )}
              </div>

              {/* Currency Toggle */}
              <div className="space-y-2">
                <Label className="block text-right">מטבע *</Label>
                <ToggleGroup
                  type="single"
                  value={formData.currency}
                  onValueChange={(value: "ILS" | "USD") =>
                    value && setFormData((prev) => ({ ...prev, currency: value }))
                  }
                  className="w-fit"
                  disabled={isLoading}
                >
                  <ToggleGroupItem value="ILS" aria-label="Toggle ILS">
                    ₪ שקל
                  </ToggleGroupItem>
                  <ToggleGroupItem value="USD" aria-label="Toggle USD">
                    $ דולר
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="block text-right">
                  סכום *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  className="text-right [direction:ltr]"
                  disabled={isLoading}
                />
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <Label htmlFor="date" className="block text-right">
                  תאריך
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="text-right [direction:ltr]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <SheetFooter className="mt-6">
              <Button
                variant="outline"
                onClick={resetAndClose}
                disabled={isLoading}
              >
                ביטול
              </Button>
              <Button
                onClick={handleSaveDeposit}
                disabled={isLoading || portfolios.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  "שמור"
                )}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
