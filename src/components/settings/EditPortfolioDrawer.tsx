"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type Portfolio, type PortfolioFormData } from "@/types/portfolio";

interface EditPortfolioDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio: Portfolio | null;
  onSave: (id: string, data: PortfolioFormData) => Promise<boolean>;
}

export function EditPortfolioDrawer({
  open,
  onOpenChange,
  portfolio,
  onSave,
}: EditPortfolioDrawerProps) {
  const [formData, setFormData] = useState<PortfolioFormData>({
    name: "",
    accountNumber: "",
    buyFee: 2.5,
    sellFee: 2.5,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name,
        accountNumber: portfolio.accountNumber || "",
        buyFee: portfolio.buyFee,
        sellFee: portfolio.sellFee,
      });
    }
  }, [portfolio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("יש להזין שם תיק");
      return;
    }

    if (portfolio) {
      setIsLoading(true);
      try {
        const success = await onSave(portfolio.id, formData);
        if (success) {
          onOpenChange(false);
          toast.success("התיק עודכן בהצלחה");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>עריכת תיק</SheetTitle>
            <SheetDescription>עדכן את פרטי התיק</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="block text-right">
                שם התיק *
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="לדוגמה: תיק ראשי"
                className="text-right"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-accountNumber" className="block text-right">
                מספר חשבון (אופציונלי)
              </Label>
              <Input
                id="edit-accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="לדוגמה: U1234567"
                className="text-right [direction:ltr] placeholder:text-right"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-buyFee" className="block text-right">
                  עמלת קנייה ($)
                </Label>
                <Input
                  id="edit-buyFee"
                  name="buyFee"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.buyFee}
                  onChange={handleChange}
                  className="text-right [direction:ltr]"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sellFee" className="block text-right">
                  עמלת מכירה ($)
                </Label>
                <Input
                  id="edit-sellFee"
                  name="sellFee"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.sellFee}
                  onChange={handleChange}
                  className="text-right [direction:ltr]"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                "שמור שינויים"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
