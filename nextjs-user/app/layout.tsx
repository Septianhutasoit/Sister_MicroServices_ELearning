import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Ubah jalur import jika ada error merah (misal jadi ./components/ConditionalWrapper)
import ConditionalWrapper from "./components/ConditionalWrapper";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "EduLearn — Student Portal",
  description: "Platform E-Learning Microservices untuk Siswa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`
          ${geist.variable} ${geistMono.variable}
          font-[family-name:var(--font-geist)]
          bg-[#f8fafb] text-slate-800 min-h-screen flex flex-col
          antialiased
        `}
      >
        {/* Serahkan urusan memunculkan Navbar/Footer ke komponen ini */}
        <ConditionalWrapper>
          {children}
        </ConditionalWrapper>
      </body>
    </html>
  );
}