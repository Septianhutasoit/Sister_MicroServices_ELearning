'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, ArrowLeft, Loader2, FileText, ChevronRight, HelpCircle, Trophy } from 'lucide-react';
import Link from 'next/link';
import API from '@/lib/api';

interface Chapter {
    id: number;
    title: string;
    content: string;
    duration: string;
}

interface CourseDetails {
    id: string;
    title: string;
    category: string;
    instructor: string;
    description: string;
    totalChapters: number;
    completedChapters: number;
    progress: number;
}

// --- UTILITY UNTUK AMBIL ID SECARA AMAN ---
const getSafeId = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') {
        if (val.$oid) return val.$oid;
        if (val.id) return getSafeId(val.id);
        if (val._id) return getSafeId(val._id);
        if (val.toString && typeof val.toString === 'function') {
            const str = val.toString();
            if (str !== '[object Object]') return str;
        }
    }
    return '';
};

export default function CourseReaderPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = getSafeId(params.id);

    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [completedChaptersSet, setCompletedChaptersSet] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!courseId) return;

        const fetchCourseAndChapters = async () => {
            try {
                // 1. Ambil detail kursus dari MongoDB (Course Service)
                const courseRes = await API.get(`/courses/${courseId}`);
                const courseData = courseRes.data.data || courseRes.data;
                
                // 2. Ambil status pendaftaran untuk menghitung progres user
                let enrollProgress = { progress: 0, completedChapters: 0, completedSet: new Set<number>() };
                try {
                    const enrollRes = await API.get('/enrollments/me');
                    const myEnrollments = enrollRes.data.data || [];
                    const match = myEnrollments.find((e: any) => {
                        const mCourseId = getSafeId(e.courseId) || getSafeId(e.course?._id) || getSafeId(e.course?.id);
                        return mCourseId === courseId;
                    });
                    if (match) {
                        const backendCompleted = match.completedChapters || 0;
                        enrollProgress.progress = match.completionPercent || match.progress || 0;
                        enrollProgress.completedChapters = backendCompleted;
                        // Build set from backend count
                        for (let i = 1; i <= backendCompleted; i++) {
                            enrollProgress.completedSet.add(i);
                        }
                    }
                } catch (e) {
                    console.warn("Gagal mengambil progress pendaftaran user dari backend.");
                }

                // Cek localStorage untuk data progress yang lebih fresh (disimpan saat user klik Tandai Selesai)
                const progressKey = `course_progress_${courseId}`;
                const localProgressRaw = localStorage.getItem(progressKey);
                if (localProgressRaw) {
                    try {
                        const localProgress = JSON.parse(localProgressRaw);
                        // Gunakan data lokal jika lebih tinggi dari backend (sinkronisasi optimistik)
                        if (localProgress.completedChapters > enrollProgress.completedChapters) {
                            enrollProgress.completedChapters = localProgress.completedChapters;
                            enrollProgress.progress = localProgress.progress;
                            enrollProgress.completedSet = new Set<number>(localProgress.completedChaptersSet || []);
                        }
                    } catch (_) {
                        // localStorage corrupt, abaikan
                    }
                }

                // 3. Ekstrak materi riil dari database (MongoDB NoSQL)
                const courseMaterials = courseData.materials || [];
                const totalCh = courseMaterials.length || courseData.totalChapters || 5;

                setCourse({
                    id: getSafeId(courseData._id) || getSafeId(courseData.id) || courseId,
                    title: courseData.title || 'Materi Belajar',
                    category: courseData.category || 'Materi',
                    instructor: courseData.instructor || 'Pengajar',
                    description: courseData.description || 'Deskripsi materi belum tersedia.',
                    totalChapters: totalCh,
                    completedChapters: enrollProgress.completedChapters,
                    progress: enrollProgress.progress
                });

                const parsedChapters: Chapter[] = courseMaterials.length > 0
                    ? courseMaterials.map((m: any, i: number) => ({
                        id: i + 1,
                        title: m.title || `Bab ${i + 1}`,
                        content: m.theory || m.content || 'Isi materi tidak tersedia.',
                        duration: m.duration || `${10 + (i * 2)} menit`
                    }))
                    : Array.from({ length: totalCh }, (_, i) => ({
                        id: i + 1,
                        title: `Bab ${i + 1}: Pengenalan & Konsep Dasar Bagian ${i + 1}`,
                        content: `## Pendahuluan Bab ${i + 1}\n\nIni adalah isi materi dari Bab ${i + 1} untuk kursus **${courseData.title || 'Materi Belajar'}**. \n\nLayanan microservices terdistribusi mensyaratkan setiap service berkomunikasi secara asynchronous maupun synchronous. Pada bagian ini, kita akan membahas detail arsitektur, implementasi database, dan strategi deployment di production environment.\n\n### Poin-Poin Penting:\n1. Desain modularitas microservices.\n2. Sinkronisasi data antar database PostgreSQL dan MongoDB.\n3. Implementasi REST API gateway menggunakan Nginx.\n4. Autentikasi aman berbasis JWT (JSON Web Token).\n\nSilakan baca dengan teliti dan tekan tombol tandai selesai untuk meningkatkan persentase progres belajar Anda.`,
                        duration: `${10 + (i * 2)} menit`
                    }));

                setChapters(parsedChapters);

                // Set Bab yang sudah diselesaikan (dari set yang sudah digabung backend + lokal)
                setCompletedChaptersSet(enrollProgress.completedSet);
                
                // Mulai membaca dari bab pertama yang belum selesai
                const nextUnread = enrollProgress.completedChapters < totalCh ? enrollProgress.completedChapters : 0;
                setActiveChapterIndex(nextUnread);

            } catch (error) {
                console.error("Gagal memuat detail modul materi:", error);
                setCourse({
                    id: courseId,
                    title: 'Materi Belajar Terdistribusi',
                    category: 'Teknik',
                    instructor: 'Pengajar Senior',
                    description: 'Penjelasan sistem terdistribusi skala besar.',
                    totalChapters: 5,
                    completedChapters: 0,
                    progress: 0
                });
                
                setChapters(Array.from({ length: 5 }, (_, i) => ({
                    id: i + 1,
                    title: `Bab ${i + 1}: Materi Dummy`,
                    content: `Isi materi dummy bab ${i + 1}.`,
                    duration: '10 menit'
                })));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseAndChapters();
    }, [courseId]);

    const handleMarkAsCompleted = async (chapterId: number) => {
        if (!course) return;
        setIsUpdating(true);

        try {
            // 1. Update local React state
            const newCompletedSet = new Set(completedChaptersSet);
            newCompletedSet.add(chapterId);
            setCompletedChaptersSet(newCompletedSet);

            const countCompleted = newCompletedSet.size;
            const newProgress = Math.round((countCompleted / course.totalChapters) * 100);

            setCourse({
                ...course,
                completedChapters: countCompleted,
                progress: newProgress
            });

            // 2. Simpan ke localStorage per kursus (agar bertahan saat refresh / ganti halaman)
            const progressKey = `course_progress_${courseId}`;
            const savedProgress = {
                completedChaptersSet: Array.from(newCompletedSet),
                completedChapters: countCompleted,
                progress: newProgress,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(progressKey, JSON.stringify(savedProgress));

            // 3. Coba sinkronisasi ke backend enrollment service
            //    Coba beberapa format endpoint yang mungkin disediakan backend
            let backendSynced = false;
            const endpoints = [
                { method: 'PUT', url: `/enroll/${courseId}`, body: { completedChapters: countCompleted, completionPercent: newProgress, progress: newProgress } },
                { method: 'PATCH', url: `/enroll/${courseId}`, body: { completedChapters: countCompleted, completionPercent: newProgress, progress: newProgress } },
                { method: 'POST', url: `/enroll/progress`, body: { courseId, completedChapters: countCompleted, completionPercent: newProgress, progress: newProgress } },
                { method: 'PUT', url: `/enroll/progress/${courseId}`, body: { completedChapters: countCompleted, completionPercent: newProgress, progress: newProgress } },
            ];

            for (const ep of endpoints) {
                if (backendSynced) break;
                try {
                    if (ep.method === 'PUT') await API.put(ep.url, ep.body);
                    else if (ep.method === 'PATCH') await API.patch(ep.url, ep.body);
                    else await API.post(ep.url, ep.body);
                    backendSynced = true;
                    console.log(`✅ Progress tersinkronisasi ke backend via ${ep.method} ${ep.url}`);
                } catch (err: any) {
                    if (err.response?.status !== 404) {
                        // Endpoint ditemukan tapi ada error lain (bukan 404), berhenti
                        console.warn(`⚠️ Backend error di ${ep.method} ${ep.url}:`, err.response?.status);
                        break;
                    }
                }
            }

            if (!backendSynced) {
                console.info(`📌 Progress disimpan secara lokal (backend belum memiliki endpoint update progress). Progres: ${newProgress}%`);
            }

            // 4. Auto-advance ke bab berikutnya jika tersedia
            if (activeChapterIndex < chapters.length - 1) {
                setTimeout(() => {
                    setActiveChapterIndex(activeChapterIndex + 1);
                }, 600);
            } else {
                alert("Selamat! 🎉 Anda telah menyelesaikan seluruh bab materi di kursus ini!");
            }
        } catch (e) {
            console.error("Gagal memperbarui progres:", e);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 text-emerald-600">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="font-bold text-slate-500">Memuat modul materi pembelajaran...</p>
            </div>
        );
    }

    if (!course || chapters.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 text-slate-500">
                <HelpCircle size={40} className="mb-4" />
                <p className="font-bold">Modul materi tidak ditemukan.</p>
                <button onClick={() => router.push('/my-learning')} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-xl">Kembali</button>
            </div>
        );
    }

    const activeChapter = chapters[activeChapterIndex];
    const isCurrentChapterCompleted = completedChaptersSet.has(activeChapter?.id);

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            {/* Header / Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.push('/my-learning')}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {course.category}
                            </span>
                            <h1 className="text-base sm:text-lg font-black text-slate-800 line-clamp-1 mt-0.5">{course.title}</h1>
                        </div>
                    </div>

                    {/* Progress Bar Lingkaran / Ringkas */}
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shrink-0">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Progres Belajar</p>
                            <p className="text-xs sm:text-sm font-black text-emerald-600">
                                {course.completedChapters} / {course.totalChapters} Bab ({course.progress}%)
                            </p>
                        </div>
                        <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Workspace Belajar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT PANEL: Daftar Bab (Sidebar) */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                            <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                                <BookOpen size={18} className="text-emerald-500" /> Modul Pembelajaran
                            </h2>
                            <div className="space-y-2">
                                {chapters.map((ch, idx) => {
                                    const isActive = idx === activeChapterIndex;
                                    const isDone = completedChaptersSet.has(ch.id);

                                    return (
                                        <button
                                            key={ch.id}
                                            onClick={() => setActiveChapterIndex(idx)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 justify-between ${
                                                isActive 
                                                    ? 'bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-600/5' 
                                                    : 'bg-white border-slate-150 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <p className={`text-xs font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                                                    Materi {ch.id}
                                                </p>
                                                <p className={`text-sm font-bold truncate ${isActive ? 'text-emerald-900' : 'text-slate-700'}`}>
                                                    {ch.title}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-medium">{ch.duration}</span>
                                            </div>
                                            
                                            {isDone ? (
                                                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                            ) : (
                                                <ChevronRight size={16} className="text-slate-400 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Area Baca Materi */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            key={activeChapterIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm"
                        >
                            {/* Judul Bab */}
                            <div className="border-b border-slate-150 pb-6 mb-6">
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                    Bab {activeChapter.id} dari {course.totalChapters}
                                </span>
                                <h2 className="text-2xl font-black text-slate-800 leading-tight mt-1">
                                    {activeChapter.title}
                                </h2>
                                <p className="text-xs text-slate-400 font-medium mt-2">
                                    Instruktur: <span className="font-bold text-slate-600">{course.instructor}</span> • Waktu Baca: {activeChapter.duration}
                                </p>
                            </div>

                            {/* Konten Bacaan */}
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-4">
                                {activeChapter.content.split('\n\n').map((paragraph, index) => {
                                    if (paragraph.startsWith('## ')) {
                                        return <h3 key={index} className="text-lg font-black text-slate-800 pt-2">{paragraph.replace('## ', '')}</h3>;
                                    }
                                    if (paragraph.startsWith('### ')) {
                                        return <h4 key={index} className="text-base font-bold text-slate-850 pt-2">{paragraph.replace('### ', '')}</h4>;
                                    }
                                    if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                                        return (
                                            <ul key={index} className="list-disc pl-5 space-y-1">
                                                {paragraph.split('\n').map((li, idx) => (
                                                    <li key={idx} className="text-sm">{li.substring(3)}</li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return <p key={index} className="text-sm sm:text-base">{paragraph}</p>;
                                })}
                            </div>

                            {/* Tombol Penyelesaian Bab */}
                            <div className="mt-10 pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-slate-400 font-semibold text-center sm:text-left">
                                    {isCurrentChapterCompleted 
                                        ? "Anda telah menandai bab ini sebagai selesai." 
                                        : "Tandai selesai untuk melanjutkan progres belajar Anda."}
                                </p>

                                <button
                                    onClick={() => handleMarkAsCompleted(activeChapter.id)}
                                    disabled={isCurrentChapterCompleted || isUpdating}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        isCurrentChapterCompleted
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default'
                                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10'
                                    }`}
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Memproses...
                                        </>
                                    ) : isCurrentChapterCompleted ? (
                                        <>
                                            <CheckCircle2 size={16} /> Selesai Dibaca
                                        </>
                                    ) : (
                                        <> Tandai Selesai Dibaca </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
