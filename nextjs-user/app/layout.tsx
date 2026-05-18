import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Gunakan font Inter yang elegan
import Link from "next/link";
import { BookOpen, UserCircle, LogOut } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduLearn - Student Portal",
  description: "Platform E-Learning Microservices untuk Siswa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Catatan: Karena ini Server Component, pengecekan token JWT 
  // akan kita lakukan nanti di Client Component atau via Middleware.
  // Untuk sekarang, kita buat Navbar UI-nya dulu.
  const isLoggedIn = false; // Ganti ini nanti jika state auth sudah dibuat

  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>

        {/* --- NAVBAR STUDENT --- */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-1.5 rounded-lg text-white group-hover:bg-emerald-700 transition-colors">
                <BookOpen size={20} />
              </div>
              <span className="font-black text-xl text-slate-800 tracking-tight">
                EduLearn<span className="text-emerald-600 font-medium">.AI</span>
              </span>
            </Link>

            {/* Menu Navigasi Tengah */}
            <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
              <Link href="/courses" className="hover:text-emerald-600 transition-colors">Katalog Kursus</Link>
              {isLoggedIn && <Link href="/my-learning" className="hover:text-emerald-600 transition-colors">Pembelajaran Saya</Link>}
              {isLoggedIn && <Link href="/achievements" className="hover:text-emerald-600 transition-colors">Pencapaian</Link>}
            </nav>

            {/* Tombol Kanan (Login / Profil) */}
            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                <Link href="/login">
                  <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl font-bold text-sm transition-all border border-slate-200">
                    <UserCircle size={16} /> Masuk Akun
                  </button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-bold text-slate-800 leading-none">Budi Student</span>
                    <span className="text-[10px] font-bold text-emerald-600">SISWA</span>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black border border-emerald-200">
                    B
                  </div>
                  <button className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- AREA KONTEN HALAMAN --- */}
        <main className="flex-grow">
          {children}
        </main>

      </body>
    </html>
  );
}