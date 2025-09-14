"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import AuthSpinner from "@/components/AuthSpinner";

// Membuat context untuk autentikasi
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // State untuk menyimpan data user dan status loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Router untuk navigasi halaman
  const router = useRouter();

  // Fungsi untuk mengecek sesi login user
  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      // Mengambil data sesi user dari Appwrite
      const session = await account.get();
      setUser(session);
    } catch (error) {
      // Jika gagal, set user menjadi null
      setUser(null);
    } finally {
      // Setelah selesai, ubah status loading menjadi false
      setLoading(false);
    }
  }, []);

  // useEffect untuk menjalankan checkSession saat komponen pertama kali di-render
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fungsi untuk logout user
  const logout = async () => {
    // Menghapus sesi user di Appwrite
    await account.deleteSession("current");
    setUser(null);
    // Navigasi ke halaman login setelah logout
    router.push("/login");
  };

  // Value yang diberikan ke context agar bisa diakses oleh komponen lain
  const value = {
    user,
    setUser,
    loading,
    checkSession,
    logout,
  };

  // Menampilkan spinner saat loading, jika tidak loading tampilkan children
  return (
    <AuthContext.Provider value={value}>
      {loading ? <AuthSpinner /> : children}
    </AuthContext.Provider>
  );
}
