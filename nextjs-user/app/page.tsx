'use client';

import Link from "next/link";
import { BookOpen, ArrowRight, UserCircle, CheckCircle2, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">

      {/* --- BACKGROUND PATTERNS --- */}
      {/* 1. Dot Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.25] bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:32px_32px]" />

      {/* 2. Soft Glowing Orbs (Mirip desain Admin tapi lebih terang) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/50 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 z-0" />

      {/* --- MAIN CONTENT (Tengah Layar) --- */}
      <div className="z-10 text-center px-6 max-w-4xl w-full py-20 flex flex-col items-center">

        {/* Badge Versi / Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-emerald-700 font-bold text-xs sm:text-sm shadow-sm border border-emerald-100 mb-8"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Platform E-Learning Microservices v2.0
        </motion.div>

        {/* Judul Utama (Hero Text) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 tracking-tight mb-6 leading-[1.1]"
        >
          Cara Cerdas <br className="hidden sm:block" />
          Belajar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Teknologi</span>
        </motion.h1>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 mb-10 font-medium max-w-2xl leading-relaxed"
        >
          Akses ribuan materi kuliah, kerjakan ujian secara real-time, dan raih sertifikasi dengan platform yang dirancang super cepat untuk mahasiswa.
        </motion.p>

        {/* Tombol Aksi (CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/courses" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-[0_8px_30px_rgba(5,150,105,0.25)] hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)] hover:-translate-y-1">
              Lihat Katalog Kursus <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-sm">
              <UserCircle size={18} /> Masuk Akun Siswa
            </button>
          </Link>
        </motion.div>

        {/* --- FITUR UNGGULAN (Mini Cards) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl"
        >
          {[
            { title: "Akses Instan", desc: "Materi langsung terbuka tanpa loading lama.", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
            { title: "Ujian Real-time", desc: "Evaluasi akurat didukung server tangguh.", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
            { title: "Data Aman", desc: "Privasi dan nilai Anda terenkripsi aman.", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50" },
          ].map((feature, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-5 rounded-3xl text-left shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${feature.bg} shrink-0`}>
                <feature.icon size={20} className={feature.color} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}