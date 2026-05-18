import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StudentNavbar from "./components/StudentNavbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "EduLearn — Student Portal",
    template: "%s | EduLearn",
  },
  description:
    "Platform E-Learning Microservices untuk Siswa — Belajar, Ujian, dan Raih Pencapaianmu.",
  keywords: ["e-learning", "kursus online", "ujian", "sertifikasi", "siswa"],
  authors: [{ name: "EduLearn Team" }],
  themeColor: "#0c0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`
          ${geist.variable} ${geistMono.variable}
          font-[family-name:var(--font-geist)]
          bg-[#0c0f1a] text-white min-h-screen flex flex-col
          antialiased
        `}
      >
        {/* ── Ambient background glow ────────────────────────────
            Efek cahaya ambient agar halaman tidak terasa flat.
            Diletakkan di belakang semua konten (z-0).
        ──────────────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Top-left emerald glow */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[120px]" />
          {/* Bottom-right teal glow */}
          <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full bg-teal-500/8 blur-[140px]" />
          {/* Subtle center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-emerald-900/10 blur-[100px]" />
        </div>

        {/* ── Navbar (fixed, di atas segalanya) ─────────────── */}
        <StudentNavbar />

        {/* ── Area konten halaman ───────────────────────────── */}
        {/*
          pt-20  → beri ruang agar konten tidak tertutup navbar fixed (h ~80px)
          flex-grow → isi sisa tinggi layar
          relative z-10 → di atas ambient glow
        */}
        <main className="relative z-10 flex-grow pt-20">
          {children}
        </main>

        {/* ── Footer minimal ───────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/5 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/25 font-medium">
            <span>
              © {new Date().getFullYear()}{" "}
              <span className="text-emerald-500/60">EduLearn</span>. Semua hak dilindungi.
            </span>
            <div className="flex items-center gap-5">
              <a href="/privacy" className="hover:text-white/50 transition-colors">
                Kebijakan Privasi
              </a>
              <a href="/terms" className="hover:text-white/50 transition-colors">
                Syarat &amp; Ketentuan
              </a>
              <a href="/support" className="hover:text-white/50 transition-colors">
                Bantuan
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}