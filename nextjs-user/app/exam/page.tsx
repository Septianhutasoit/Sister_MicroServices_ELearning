'use client';
import { motion } from 'framer-motion';
import { Brain, Clock } from 'lucide-react';

export default function ExamPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Ujian & Evaluasi</h1>
            <p className="text-slate-500 font-medium mb-8">Kerjakan ujian untuk mendapatkan sertifikat kelulusan.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-amber-100 text-amber-600 p-3 rounded-xl"><Brain size={24} /></div>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Wajib Dikerjakan</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Ujian Akhir Microservices</h3>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-6">
                        <span className="flex items-center gap-1"><Clock size={16} /> 45 Menit</span>
                        <span>20 Soal Pilihan Ganda</span>
                    </div>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Mulai Ujian</button>
                </div>
            </div>
        </motion.div>
    );
}