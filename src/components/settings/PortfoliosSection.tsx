"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { type Portfolio, type PortfolioFormData } from "@/types/portfolio";
import { usePortfolios } from "@/contexts/PortfoliosContext";
import { AddPortfolioDrawer } from "./AddPortfolioDrawer";
import { EditPortfolioDrawer } from "./EditPortfolioDrawer";

export function PortfoliosSection() {
  const {
    portfolios,
    isLoading,
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = usePortfolios();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddPortfolio = async (data: PortfolioFormData): Promise<boolean> => {
    return await addPortfolio(data);
  };

  const handleEditPortfolio = async (id: string, data: PortfolioFormData): Promise<boolean> => {
    return await updatePortfolio(id, data);
  };

  const handleDeletePortfolio = async (id: string) => {
    setDeletingId(id);
    try {
      const success = await deletePortfolio(id);
      if (success) {
        toast.success("התיק נמחק בהצלחה");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDrawer = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsEditDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            ניהול תיקים
          </CardTitle>
          <Skeleton className="h-10 w-28" />
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            ניהול תיקים
          </CardTitle>
          <Button onClick={() => setIsAddDrawerOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            הוסף תיק
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם התיק</TableHead>
                <TableHead className="text-right">מספר חשבון</TableHead>
                <TableHead className="text-right">עמלת קנייה</TableHead>
                <TableHead className="text-right">עמלת מכירה</TableHead>
                <TableHead className="text-right w-[70px]">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolios.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    אין תיקים. לחץ על &quot;הוסף תיק&quot; כדי להתחיל.
                  </TableCell>
                </TableRow>
              ) : (
                portfolios.map((portfolio) => (
                  <TableRow key={portfolio.id}>
                    <TableCell className="font-medium">
                      {portfolio.name}
                    </TableCell>
                    <TableCell className="[direction:ltr] text-right">
                      {portfolio.accountNumber || "—"}
                    </TableCell>
                    <TableCell className="[direction:ltr] text-right">
                      ${portfolio.buyFee.toFixed(2)}
                    </TableCell>
                    <TableCell className="[direction:ltr] text-right">
                      ${portfolio.sellFee.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {deletingId === portfolio.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">פתח תפריט</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDrawer(portfolio)}
                            >
                              <Pencil className="ml-2 h-4 w-4" />
                              ערוך
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeletePortfolio(portfolio.id)
                              }
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="ml-2 h-4 w-4" />
                              מחק
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddPortfolioDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        onSave={handleAddPortfolio}
      />

      <EditPortfolioDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        portfolio={selectedPortfolio}
        onSave={handleEditPortfolio}
      />
    </>
  );
}
