"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
import { type Portfolio, type PortfolioFormData } from "@/types/portfolio";
import { toast } from "sonner";

interface PortfoliosContextType {
  portfolios: Portfolio[];
  isLoading: boolean;
  addPortfolio: (data: PortfolioFormData) => Promise<boolean>;
  updatePortfolio: (id: string, data: PortfolioFormData) => Promise<boolean>;
  deletePortfolio: (id: string) => Promise<boolean>;
  getPortfolio: (id: string) => Portfolio | undefined;
  refreshPortfolios: () => Promise<void>;
}

const PortfoliosContext = createContext<PortfoliosContextType | null>(null);

export function PortfoliosProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get current user
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  // Fetch portfolios from Supabase
  const fetchPortfolios = useCallback(async () => {
    const user = await getCurrentUser();

    if (!user) {
      setPortfolios([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching portfolios:", error);
      toast.error("שגיאה בטעינת התיקים");
      setIsLoading(false);
      return;
    }

    const mappedPortfolios: Portfolio[] = (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      accountNumber: p.account_number || undefined,
      buyFee: p.buy_fee || 2.5,
      sellFee: p.sell_fee || 2.5,
    }));

    setPortfolios(mappedPortfolios);
    setIsLoading(false);
  }, []);

  // Initial fetch and auth state listener
  useEffect(() => {
    fetchPortfolios();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchPortfolios();
      } else {
        setPortfolios([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchPortfolios]);

  const addPortfolio = useCallback(
    async (data: PortfolioFormData): Promise<boolean> => {
      // Get fresh user data
      const user = await getCurrentUser();

      if (!user) {
        toast.error("יש להתחבר כדי להוסיף תיק");
        return false;
      }

      const { data: newPortfolio, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          name: data.name,
          account_number: data.accountNumber || null,
          buy_fee: data.buyFee,
          sell_fee: data.sellFee,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding portfolio:", error);
        toast.error("שגיאה בהוספת התיק");
        return false;
      }

      const portfolio: Portfolio = {
        id: newPortfolio.id,
        name: newPortfolio.name,
        accountNumber: newPortfolio.account_number || undefined,
        buyFee: newPortfolio.buy_fee || 2.5,
        sellFee: newPortfolio.sell_fee || 2.5,
      };

      setPortfolios((prev) => [...prev, portfolio]);
      return true;
    },
    []
  );

  const updatePortfolio = useCallback(
    async (id: string, data: PortfolioFormData): Promise<boolean> => {
      const { error } = await supabase
        .from("portfolios")
        .update({
          name: data.name,
          account_number: data.accountNumber || null,
          buy_fee: data.buyFee,
          sell_fee: data.sellFee,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating portfolio:", error);
        toast.error("שגיאה בעדכון התיק");
        return false;
      }

      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: data.name,
                accountNumber: data.accountNumber || undefined,
                buyFee: data.buyFee,
                sellFee: data.sellFee,
              }
            : p
        )
      );
      return true;
    },
    []
  );

  const deletePortfolio = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("portfolios").delete().eq("id", id);

    if (error) {
      console.error("Error deleting portfolio:", error);
      toast.error("שגיאה במחיקת התיק");
      return false;
    }

    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    return true;
  }, []);

  const getPortfolio = useCallback(
    (id: string) => {
      return portfolios.find((p) => p.id === id);
    },
    [portfolios]
  );

  const refreshPortfolios = useCallback(async () => {
    setIsLoading(true);
    await fetchPortfolios();
  }, [fetchPortfolios]);

  return (
    <PortfoliosContext.Provider
      value={{
        portfolios,
        isLoading,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        getPortfolio,
        refreshPortfolios,
      }}
    >
      {children}
    </PortfoliosContext.Provider>
  );
}

export function usePortfolios() {
  const context = useContext(PortfoliosContext);
  if (!context) {
    throw new Error("usePortfolios must be used within a PortfoliosProvider");
  }
  return context;
}
