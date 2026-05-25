'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, FileQuestion, CheckCircle2, AlertCircle, Loader2, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import API from '@/lib/api';

// --- TIPE DATA UJIAN DARI MICROSERVICES ---
interface Exam {
    id: string | number;
    title: string;
    courseName: string;
    durationMinutes: number;
    questionCount: number; // Sesuai admin panel (maks 5)
    status: 'pending' | 'completed';
    score?: number;
    urgent?: boolean;
}

export default function ExamPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- 1. MENGAMBIL DATA DARI EXAM SERVICE ---
    useEffect(() => {
        const fetchExams = async () => {
            try {
                // Tembak Endpoint Exam di Laptop 2 (via Gateway Laptop 1)
                const res = await API.get('/exams/me');
                setExams(res.data.data || []);
            } catch (error) {
                console.error("Gagal fetch ujian, menggunakan Dummy Data:", error);

                // --- FALLBACK DUMMY DATA (Jika Backend Belum Menyala) ---
                setExams([
                    {
                        id: "e1", title: 'Ujian Akhir Microservices', courseName: 'Backend Node.js Advanced',
                        durationMinutes: 15, questionCount: 5, status: 'pending', urgent: true
                    },
                    {
                        id: "e2", title: 'Evaluasi UI/UX Design', courseName: 'UI/UX Design Masterclass',
                        durationMinutes: 10, questionCount: 5, status: 'pending', urgent: false
                    },
                    {
                        id: "e3", title: 'Kuis Dasar Docker', courseName: 'Mastering Docker',
                        durationMinutes: 10, questionCount: 5, status: 'completed', score: 80
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExams();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

            {/* --- HEADER --- */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Ujian & Evaluasi</h1>
                <p className="text-slate-500 font-medium text-base">Kerjakan ujian untuk mengukur pemahaman dan mendapatkan sertifikat kelulusan.</p>
            </div>

            {/* --- LOADING STATE --- */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map((n) => (
                        <div key={n} className="bg-white rounded-3xl border border-slate-100 p-6 h-48 animate-pulse flex flex-col gap-4 shadow-sm">
                            <div className="flex justify-between">
                                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                                <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                            </div>
                            <div className="w-3/4 h-6 bg-slate-200 rounded-lg mt-2"></div>
                            <div className="w-1/2 h-4 bg-slate-200 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            ) : exams.length === 0 ? (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Hore! Tidak ada ujian tertunda.</h2>
                    <p className="text-slate-500 max-w-md mx-auto">Anda telah menyelesaikan semua ujian untuk materi yang sedang dipelajari.</p>
                </div>
            ) : (
                /* --- GRID KARTU UJIAN --- */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {exams.map((exam, index) => {
                        const isCompleted = exam.status === 'completed';

                        return (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                                className={`bg-white border p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 ${isCompleted ? 'border-slate-200' : 'border-slate-100'
                                    }`}
                            >
                                {/* Garis Warna Kiri (Indikator Status) */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${isCompleted ? 'bg-emerald-500' : (exam.urgent ? 'bg-amber-500' : 'bg-blue-500')
                                    }`}></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {isCompleted ? <Award size={24} /> : <Brain size={24} />}
                                    </div>

                                    {/* Badge Status */}
                                    {isCompleted ? (
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Selesai
                                        </span>
                                    ) : exam.urgent ? (
                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200 animate-pulse">
                                            Segera Dikerjakan
                                        </span>
                                    ) : (
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                            Tersedia
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{exam.courseName}</p>
                                <h3 className="text-xl font-black text-slate-800 mb-4 leading-tight">{exam.title}</h3>

                                {/* Info Durasi & Soal */}
                                <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="flex items-center gap-1.5"><Clock size={16} className={isCompleted ? 'text-slate-400' : 'text-amber-500'} /> {exam.durationMinutes} Menit</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="flex items-center gap-1.5"><FileQuestion size={16} className={isCompleted ? 'text-slate-400' : 'text-blue-500'} /> {exam.questionCount} Soal PG</span>
                                </div>

                                {/* Area Bawah (Tombol / Nilai) */}
                                <div className="mt-auto">
                                    {isCompleted ? (
                                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <span className="text-sm font-bold text-emerald-800">Nilai Akhir Anda:</span>
                                            <span className="text-2xl font-black text-emerald-600">{exam.score}<span className="text-sm font-bold text-emerald-600/50">/100</span></span>
                                        </div>
                                    ) : (
                                        // TODO: Nanti arahkan ke halaman soal (/exam/[id])
                                        <Link href={`/exam/${exam.id}`}>
                                            <button className="w-full py-3.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                                                Mulai Ujian <ArrowRight size={18} />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}