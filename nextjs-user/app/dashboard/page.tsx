'use client';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24" // pt-24 agar tidak tertutup navbar fixed
        >
            {/* --- HERO BANNER --- */}
            <div className="bg-gradient-to-r from-[#0A1C14] to-emerald-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-black mb-4">Selamat datang kembali, Budi! 👋</h1>
                    <p className="text-emerald-100/80 max-w-xl text-sm md:text-base font-medium mb-8">
                        Lanjutkan perjalanan belajarmu. Hari ini adalah hari yang tepat untuk menyelesaikan modul Microservices!
                    </p>
                    <Link href="/my-learning">
                        <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/30">
                            <PlayCircle size={20} /> Lanjutkan Belajar
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- QUICK STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Kursus Aktif', value: '3', icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Jam Belajar', value: '24j 15m', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Sertifikat', value: '2', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                            <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}