'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BookOpen, Award, Star, Loader2, AlertCircle, Trophy, Calendar } from 'lucide-react';
import API from '@/lib/api';
import Link from 'next/link';

// --- UTILITY ---
const getSafeId = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') {
        if (val.$oid) return val.$oid;
        if (val._id) return getSafeId(val._id);
        if (val.id) return getSafeId(val.id);
    }
    return '';
};

// --- TIPE DATA ---
interface CourseAchievement {
    id: string;
    title: string;
    category: string;
    instructor: string;
    totalChapters: number;
    completedChapters: number;
    progress: number;
    completedAt?: string;
}

interface ExamAchievement {
    id: string | number;
    courseName: string;
    examTitle: string;
    score: number;
    status: string;
    completedDate: string;
}

export default function AchievementsPage() {
    const [courseAchievements, setCourseAchievements] = useState<CourseAchievement[]>([]);
    const [examResults, setExamResults] = useState<ExamAchievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllAchievements = async () => {
            // 1. Ambil kursus yang sudah diselesaikan (progress 100%)
            try {
                const enrollRes = await API.get('/enrollments/me');
                const rawData = enrollRes.data.data || [];

                const completed: CourseAchievement[] = rawData
                    .map((c: any) => {
                        const courseDetails = c.course || {};
                        const id = getSafeId(c.courseId) || getSafeId(courseDetails._id) || getSafeId(c.id);
                        const totalChapters = c.totalChapters || courseDetails.totalChapters || (courseDetails.materials?.length || 10);

                        // Baca progress dari backend + localStorage
                        let progress = c.completionPercent ?? (typeof c.progress === 'number' ? c.progress : 0);
                        let completedChapters = typeof c.completedChapters === 'number' ? c.completedChapters : 0;
                        try {
                            const localRaw = localStorage.getItem(`course_progress_${id}`);
                            if (localRaw) {
                                const lp = JSON.parse(localRaw);
                                if (lp.completedChapters > completedChapters) {
                                    completedChapters = lp.completedChapters;
                                    progress = lp.progress;
                                }
                            }
                        } catch (_) {}

                        return {
                            id,
                            title: c.title || courseDetails.title || 'Materi Belajar',
                            category: c.category || courseDetails.category || 'Materi',
                            instructor: c.instructor || courseDetails.instructor || 'Pengajar',
                            totalChapters,
                            completedChapters,
                            progress,
                            completedAt: c.completedAt || c.enrolledAt
                        };
                    })
                    .filter((c: CourseAchievement) => c.progress >= 100);

                setCourseAchievements(completed);
            } catch (err) {
                console.warn("Gagal mengambil data kursus selesai.");
            }

            // 2. Ambil riwayat nilai ujian dari Exam Service (Laptop 3)
            try {
                const examRes = await API.get('/exams/history');
                setExamResults(examRes.data.data || []);
            } catch (err) {
                console.info("Data ujian belum tersedia dari Portal Ujian (Laptop 3). Menampilkan pencapaian kursus saja.");
                setExamResults([]);
            }

            setIsLoading(false);
        };

        fetchAllAchievements();
    }, []);

    const totalAchievements = courseAchievements.length + examResults.filter(e => e.score >= 60).length;
    const avgExamScore = examResults.length > 0
        ? Math.round(examResults.reduce((acc, r) => acc + r.score, 0) / examResults.length)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen"
        >
            {/* ─── HEADER ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Pencapaian Saya</h1>
                    <p className="text-slate-500 font-medium text-base">
                        Semua kursus yang selesai dan nilai ujian Anda tersedia di sini.
                    </p>
                </div>

                {/* Summary Card */}
                {!isLoading && (
                    <div className="flex gap-4 flex-wrap">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                                <Trophy size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Total Pencapaian</p>
                                <p className="text-xl font-black text-slate-800">{totalAchievements}</p>
                            </div>
                        </div>
                        {avgExamScore !== null && (
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                                    <Star size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Rata-rata Nilai</p>
                                    <p className="text-xl font-black text-slate-800">{avgExamScore}<span className="text-sm text-slate-400">/100</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ─── LOADING ─── */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-bold text-slate-500">Memuat pencapaian Anda...</p>
                </div>
            )}

            {!isLoading && (
                <div className="space-y-10">
                    {/* ─── SECTION 1: KURSUS SELESAI ─── */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <BookOpen size={18} className="text-emerald-600" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800">Kursus Selesai</h2>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full">
                                {courseAchievements.length}
                            </span>
                        </div>

                        {courseAchievements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <AlertCircle size={28} className="text-slate-300" />
                                </div>
                                <h3 className="text-base font-bold text-slate-600 mb-1">Belum ada kursus selesai</h3>
                                <p className="text-sm text-slate-400 max-w-sm">Selesaikan semua bab di halaman <strong>Pembelajaran Saya</strong> untuk mendapatkan pencapaian.</p>
                                <Link href="/my-learning" className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-500 transition-colors">
                                    <BookOpen size={16} /> Mulai Belajar
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {courseAchievements.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                                    >
                                        {/* Top bar */}
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />

                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                                                <Award size={22} className="text-emerald-600" />
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                                <CheckCircle2 size={11} /> Selesai
                                            </span>
                                        </div>

                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{course.category}</p>
                                        <h3 className="text-base font-black text-slate-800 leading-tight mb-3">{course.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium mb-4">Instruktur: <span className="font-bold text-slate-700">{course.instructor}</span></p>

                                        <div className="flex items-center justify-between bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100">
                                            <span className="text-xs font-bold text-emerald-800">{course.completedChapters} / {course.totalChapters} Bab</span>
                                            <span className="text-sm font-black text-emerald-600">100%</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ─── SECTION 2: NILAI UJIAN (dari Laptop 3) ─── */}
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Star size={18} className="text-blue-600" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800">Riwayat Nilai Ujian</h2>
                            <span className="bg-blue-100 text-blue-700 text-xs font-black px-2.5 py-1 rounded-full">
                                {examResults.length}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">(dari Portal Ujian)</span>
                        </div>

                        {examResults.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                    <Star size={28} className="text-blue-300" />
                                </div>
                                <h3 className="text-base font-bold text-slate-600 mb-1">Belum ada nilai ujian</h3>
                                <p className="text-sm text-slate-400 max-w-sm">
                                    Nilai ujian akan muncul di sini setelah Anda mengerjakan ujian di <strong>Portal Ujian</strong>.
                                </p>
                                <a
                                    href="http://localhost:3001"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-colors"
                                >
                                    Buka Portal Ujian
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {examResults.map((result, index) => {
                                    const isPassed = result.score >= 60;
                                    return (
                                        <motion.div
                                            key={result.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.08 }}
                                            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                                        >
                                            <div className={`absolute top-0 left-0 w-full h-1.5 ${isPassed ? 'bg-emerald-500' : 'bg-red-400'}`} />

                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${isPassed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                                    {isPassed
                                                        ? <CheckCircle2 size={22} className="text-emerald-600" />
                                                        : <AlertCircle size={22} className="text-red-500" />
                                                    }
                                                </div>
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                                    {result.status}
                                                </span>
                                            </div>

                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{result.courseName}</p>
                                            <h3 className="text-base font-black text-slate-800 leading-tight mb-4">{result.examTitle}</h3>

                                            <div className="mt-auto flex items-end justify-between">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                    <Calendar size={13} /> {result.completedDate}
                                                </div>
                                                <div className={`px-4 py-2 rounded-2xl border flex flex-col items-center ${isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                                    <span className="text-2xl font-black leading-none">{result.score}</span>
                                                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-0.5">Poin</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </motion.div>
    );
}