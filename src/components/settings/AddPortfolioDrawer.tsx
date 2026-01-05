"use client";

import { useState } from "react";
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
import {
  type PortfolioFormData,
  DEFAULT_PORTFOLIO_VALUES,
} from "@/types/portfolio";

interface AddPortfolioDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PortfolioFormData) => Promise<boolean>;
}

export function AddPortfolioDrawer({
  open,
  onOpenChange,
  onSave,
}: AddPortfolioDrawerProps) {
  const [formData, setFormData] = useState<PortfolioFormData>(
    DEFAULT_PORTFOLIO_VALUES
  );
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      const success = await onSave(formData);
      if (success) {
        setFormData(DEFAULT_PORTFOLIO_VALUES);
        onOpenChange(false);
        toast.success("התיק נוסף בהצלחה");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setFormData(DEFAULT_PORTFOLIO_VALUES);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>הוספת תיק חדש</SheetTitle>
            <SheetDescription>הזן את פרטי התיק החדש</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-right">
                שם התיק *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="לדוגמה: תיק ראשי"
                className="text-right"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="block text-right">
                מספר חשבון (אופציונלי)
              </Label>
              <Input
                id="accountNumber"
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
                <Label htmlFor="buyFee" className="block text-right">
                  עמלת קנייה ($)
                </Label>
                <Input
                  id="buyFee"
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
                <Label htmlFor="sellFee" className="block text-right">
                  עמלת מכירה ($)
                </Label>
                <Input
                  id="sellFee"
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
                "שמור"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
