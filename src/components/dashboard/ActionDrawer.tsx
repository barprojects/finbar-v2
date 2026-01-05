"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingCart,
  BadgeDollarSign,
  Coins,
} from "lucide-react";

interface ActionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const actions = [
  {
    id: "deposit",
    label: "הפקדה",
    description: "הפקדת כסף לתיק",
    icon: ArrowDownToLine,
  },
  {
    id: "withdrawal",
    label: "משיכה",
    description: "משיכת כסף מהתיק",
    icon: ArrowUpFromLine,
  },
  {
    id: "buy",
    label: "קנייה",
    description: "קניית נכס חדש",
    icon: ShoppingCart,
  },
  {
    id: "sell",
    label: "מכירה",
    description: "מכירת נכס קיים",
    icon: BadgeDollarSign,
  },
  {
    id: "dividend",
    label: "דיבידנד",
    description: "רישום דיבידנד שהתקבל",
    icon: Coins,
  },
];

export function ActionDrawer({ open, onOpenChange }: ActionDrawerProps) {
  const handleActionClick = (actionId: string) => {
    // TODO: Implement action handling
    console.log("Action clicked:", actionId);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>פעולה חדשה</SheetTitle>
          <SheetDescription>בחר את סוג הפעולה שברצונך לבצע</SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto flex-col items-start gap-1 p-4 text-right"
              onClick={() => handleActionClick(action.id)}
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
      </SheetContent>
    </Sheet>
  );
}
