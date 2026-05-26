'use client';

import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ExamPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen flex flex-col items-center justify-center text-center"
        >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 w-full">
                {/* Icon */}
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                    <ExternalLink size={36} className="text-blue-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-slate-800 mb-3">Ujian Dikelola di Portal Terpisah</h1>
                <p className="text-slate-500 font-medium text-base mb-8 max-w-md mx-auto leading-relaxed">
                    Fitur ujian untuk platform ini dikelola oleh tim khusus di portal terpisah. Silakan akses portal ujian untuk mengerjakan dan melihat hasil ujian Anda.
                </p>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 text-left space-y-3">
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">Yang perlu Anda ketahui:</p>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-700 font-medium">Gunakan email dan password yang sama dengan akun ini untuk login ke portal ujian.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-700 font-medium">Setelah ujian selesai, hasil nilai Anda akan otomatis tersinkronisasi ke halaman <strong>Pencapaian</strong> di portal ini.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-700 font-medium">Kursus yang sudah selesai 100% di portal ini akan ditampilkan sebagai pencapaian secara independen.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
                    >
                        <ExternalLink size={18} /> Buka Portal Ujian
                    </a>
                    <Link href="/achievements">
                        <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors w-full">
                            <BookOpen size={18} /> Lihat Pencapaian Saya
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}