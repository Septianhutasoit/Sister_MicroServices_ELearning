'use client';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle } from 'lucide-react';

export default function AchievementsPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Pencapaian Saya</h1>
            <p className="text-slate-500 font-medium mb-8">Daftar sertifikat dan lencana dari kursus yang telah diselesaikan.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-1 rounded-3xl shadow-xl">
                    <div className="bg-[#0A1C14] h-full p-6 rounded-[22px] flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 opacity-10"><Trophy size={150} /></div>

                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                            <Trophy size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">UI/UX Fundamental</h3>
                        <p className="text-emerald-400/80 text-sm font-semibold mb-6">Lulus Memuaskan • 95 Poin</p>

                        <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Lihat Sertifikat
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}