"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  // State untuk menyimpan email, password, dan status loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Router untuk navigasi halaman
  const router = useRouter();

  // Fungsi untuk mengecek sesi login
  const { checkSession } = useAuth();

  // Fungsi untuk menampilkan notifikasi toast
  const { toast } = useToast();

  // Fungsi untuk menangani proses login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Membuat sesi login menggunakan email dan password
      await account.createEmailPasswordSession(email, password);

      // Mengecek sesi login setelah berhasil
      await checkSession();

      // Navigasi ke halaman dashboard
      router.push("/dashboard");

      // Menampilkan notifikasi sukses login
      toast({
        title: "Login Successful",
        description: "Welcome back to Appwrite Auth Demo!",
      });
    } catch (error) {
      // Menampilkan notifikasi jika login gagal
      console.error("Login failed", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error.message || "Please check your credentials and try again.",
      });
    } finally {
      // Mengubah status loading menjadi false setelah proses selesai
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-primary">
          Appwrite Auth Demo
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form login untuk memasukkan email dan password */}
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
            {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="underline text-accent hover:text-accent/80"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
