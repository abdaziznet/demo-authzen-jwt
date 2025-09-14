"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account, ID } from "@/lib/appwrite";
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
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  // State untuk menyimpan nama, email, password, dan status loading
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Router untuk navigasi ke halaman lain
  const router = useRouter();

  // Fungsi untuk menampilkan notifikasi toast
  const { toast } = useToast();

  // Fungsi untuk menangani proses registrasi akun baru
  const handleRegister = async (e) => {
    e.preventDefault();
    // Validasi panjang password minimal 8 karakter
    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }
    setIsLoading(true);
    try {
      // Membuat akun baru menggunakan Appwrite dengan nama, email, dan password
      await account.create(ID.unique(), email, password, name);
      // Menampilkan notifikasi sukses registrasi
      toast({
        title: "Registration Successful",
        description: "Please log in with your new account.",
      });
      // Navigasi ke halaman login setelah registrasi berhasil
      router.push("/login");
    } catch (error) {
      // Menampilkan notifikasi jika registrasi gagal
      console.error("Registration failed", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
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
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your name, email and password to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form registrasi untuk memasukkan nama, email, dan password */}
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
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
            {isLoading ? "Creating Account..." : "Sign Up"}
            {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {/* Link untuk menuju halaman login jika sudah punya akun */}
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline text-accent hover:text-accent/80"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
