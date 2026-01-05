import { TrendingUp } from "lucide-react";

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
        <TrendingUp className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">FINBAR</h1>
      <p className="text-sm text-muted-foreground">ניהול תיקי השקעות</p>
    </div>
  );
}
