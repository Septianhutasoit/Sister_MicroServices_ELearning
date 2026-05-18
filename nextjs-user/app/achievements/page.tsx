'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, FileCheck, Loader2, AlertCircle, Calendar } from 'lucide-react';
import API from '@/lib/api';

// --- STRUKTUR DATA MICROSERVICES ---
interface ExamResult {
    id: string | number;
    courseName: string;
    examTitle: string;
    score: number;
    status: string;
    completedDate: string;
}

export default function AchievementsPage() {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- 1. MENGAMBIL DATA RIWAYAT NILAI DARI EXAM SERVICE ---
    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Asumsi Endpoint di Laptop 2: GET /exams/history atau /exams/results
                const res = await API.get('/exams/history');
                setResults(res.data.data || []);
            } catch (error) {
                console.error("Gagal mengambil data nilai, menggunakan Dummy Data:", error);

                // --- FALLBACK DUMMY DATA (Jika Backend Belum Menyala) ---
                setResults([
                    { id: "1", courseName: "Backend Node.js Advanced", examTitle: "Ujian Akhir Microservices", score: 95, status: "Lulus Memuaskan", completedDate: "12 Mei 2025" },
                    { id: "2", courseName: "UI/UX Design Masterclass", examTitle: "Evaluasi Wireframing", score: 82, status: "Lulus", completedDate: "08 Mei 2025" },
                    { id: "3", courseName: "Mastering Docker", examTitle: "Kuis Container Networking", score: 55, status: "Tidak Lulus", completedDate: "05 Mei 2025" },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);

    // Helper untuk menentukan warna berdasarkan skor
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Riwayat Nilai</h1>
                    <p className="text-slate-500 font-medium text-base">Transkrip hasil ujian dari seluruh materi yang telah Anda kerjakan.</p>
                </div>

                {/* Ringkasan IPK / Rata-rata */}
                {!isLoading && results.length > 0 && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                            <FileCheck size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rata-rata Nilai</p>
                            <p className="text-xl font-black text-slate-800 leading-none">
                                {Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)}
                                <span className="text-sm font-semibold text-slate-400"> / 100</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* --- LOADING STATE (SKELETON) --- */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-3xl border border-slate-100 p-6 h-40 animate-pulse flex flex-col justify-between shadow-sm">
                            <div className="w-1/2 h-6 bg-slate-200 rounded-lg"></div>
                            <div className="w-3/4 h-4 bg-slate-200 rounded-lg"></div>
                            <div className="w-full flex justify-between items-end">
                                <div className="w-1/3 h-4 bg-slate-200 rounded-lg"></div>
                                <div className="w-16 h-12 bg-slate-200 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : results.length === 0 ? (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Belum ada nilai ujian</h2>
                    <p className="text-slate-500 max-w-md mx-auto">Anda belum menyelesaikan ujian apapun. Silakan periksa menu Ujian.</p>
                </div>
            ) : (
                /* --- KONTEN GRID NILAI --- */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result, index) => {
                        const isPassed = result.score >= 60; // Asumsi KKM = 60
                        const scoreStyle = getScoreColor(result.score);

                        return (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
                            >
                                {/* Garis indikator di atas */}
                                <div className={`absolute top-0 left-0 w-full h-1.5 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                                <div className="flex flex-col h-full">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 line-clamp-1">
                                        {result.courseName}
                                    </span>

                                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-4">
                                        {result.examTitle}
                                    </h3>

                                    <div className="mt-auto flex items-end justify-between">
                                        {/* Status Lulus/Gagal & Tanggal */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                {isPassed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
                                                <span className={`text-xs font-bold ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {result.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                <Calendar size={14} /> {result.completedDate}
                                            </div>
                                        </div>

                                        {/* Kotak Nilai Besar */}
                                        <div className={`px-4 py-2 rounded-2xl border flex flex-col items-center justify-center ${scoreStyle}`}>
                                            <span className="text-2xl font-black leading-none">{result.score}</span>
                                            <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Poin</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}