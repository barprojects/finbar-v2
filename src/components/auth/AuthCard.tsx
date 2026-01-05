"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4 text-center">
        <Logo />
        <CardDescription>
          התחבר או הירשם כדי לנהל את תיק ההשקעות שלך
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {/* RTL: הרשמה first in JSX so כניסה appears on the right */}
            <TabsTrigger value="register">הרשמה</TabsTrigger>
            <TabsTrigger value="login">כניסה</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
