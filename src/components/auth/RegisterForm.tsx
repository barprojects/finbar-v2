"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("יש למלא את כל השדות");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("הסיסמאות לא תואמות");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("האימייל כבר קיים במערכת");
        } else {
          toast.error("אירעה שגיאה בהרשמה");
        }
        return;
      }

      toast.success("נרשמת בהצלחה! בדוק את האימייל לאימות החשבון");
      router.push("/dashboard");
    } catch {
      toast.error("אירעה שגיאה בהרשמה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email" className="block text-right">
          אימייל
        </Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="text-right [direction:ltr] placeholder:text-right"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password" className="block text-right">
          סיסמה
        </Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="text-right [direction:ltr] placeholder:text-right"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="block text-right">
          אימות סיסמה
        </Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          className="text-right [direction:ltr] placeholder:text-right"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            נרשם...
          </>
        ) : (
          "הרשמה"
        )}
      </Button>
    </form>
  );
}
