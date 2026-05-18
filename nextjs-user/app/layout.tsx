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
  themeColor: "#f0fdf4",
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
          bg-[#f8fafb] text-slate-800 min-h-screen flex flex-col
          antialiased
        `}
      >
        {/* ── Ambient background — bersih, putih profesional ──────
            Warna dominan putih dengan sentuhan emerald sangat lembut.
            Cocok untuk platform edukasi yang serius & terpercaya.
        ──────────────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Top-left: emerald mist sangat lembut */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-100/60 blur-[120px]" />
          {/* Bottom-right: teal mist */}
          <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-[100px]" />
          {/* Center putih — kesan bersih & profesional */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-white/80 blur-[80px]" />
          {/* Noise texture overlay sangat tipis */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px',
            }}
          />
          {/* Garis grid halus — kesan platform profesional */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        {/* ── Navbar floating ────────────────────────────────── */}
        <StudentNavbar />

        {/* ── Area konten halaman ───────────────────────────── */}
        <main className="relative z-10 flex-grow pt-[68px]">
          {children}
        </main>

        {/* ── Footer profesional light ──────────────────────── */}
        <footer className="relative z-10 mt-auto">
          {/* Top border gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

          <div className="bg-white/70 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Brand */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-black tracking-tight text-slate-700">
                      Edu<span className="text-emerald-500">Learn</span>
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                      Student Portal
                    </span>
                  </div>
                </div>

                {/* Copyright */}
                <span className="text-[11px] text-slate-400 font-medium">
                  © {new Date().getFullYear()}{" "}
                  <span className="text-emerald-500 font-semibold">EduLearn</span>.
                  Semua hak dilindungi.
                </span>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {[
                    { href: '/privacy', label: 'Kebijakan Privasi' },
                    { href: '/terms', label: 'Syarat & Ketentuan' },
                    { href: '/support', label: 'Bantuan' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-[11px] text-slate-400 font-medium hover:text-emerald-600 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}