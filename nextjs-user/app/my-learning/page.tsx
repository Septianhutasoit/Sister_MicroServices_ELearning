'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Loader2, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import API from '@/lib/api'; // Pastikan path ini benar mengarah ke konfigurasi axios kamu

// --- UTILITY UNTUK AMBIL ID & GAMBAR SECARA AMAN ---
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

const getSafeImageUrl = (img: string, title: string = '') => {
    if (!img) {
        if (title.toLowerCase().includes('blockchain')) return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop';
        if (title.toLowerCase().includes('node')) return 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format&fit=crop';
        return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop';
    }
    if (img.startsWith('http')) return img;
    // Custom mapping untuk dummy filenames dari DB
    const lower = img.toLowerCase() + ' ' + title.toLowerCase();
    if (lower.includes('blockchain')) return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop';
    if (lower.includes('node') || lower.includes('microservices')) return 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format&fit=crop';
    if (lower.includes('react') || lower.includes('next') || lower.includes('frontend')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop';
};

// --- TIPE DATA KURSUS (Disesuaikan untuk Materi Teks) ---
interface EnrolledCourse {
    id: string;
    title: string;
    category: string;
    progress: number;
    totalChapters: number;
    completedChapters: number;
    imageUrl: string;
}

export default function MyLearningPage() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- FUNGSI MENGAMBIL DATA DARI MICROSERVICES ---
    useEffect(() => {
        const fetchMyLearning = async () => {
            try {
                // Tembak Endpoint Enrollment di Laptop 1
                const res = await API.get('/enrollments/me');

                // Mapping data secara aman untuk mendukung model database MongoDB & PostgreSQL
                const rawData = res.data.data || [];
                const mappedCourses = rawData.map((c: any) => {
                    const courseDetails = c.course || {};
                    const id = getSafeId(c.courseId) || getSafeId(courseDetails.id) || getSafeId(courseDetails._id) || getSafeId(c.id) || getSafeId(c._id) || Math.random().toString();
                    const title = c.title || courseDetails.title || 'Materi Belajar';
                    const category = c.category || courseDetails.category || 'Materi';
                    const imageSource = courseDetails.image || courseDetails.imageUrl || c.imageUrl || '';
                    const totalChapters = c.totalChapters || courseDetails.totalChapters || (courseDetails.materials ? courseDetails.materials.length : 10);

                    // Baca progress dari backend
                    let progress = c.completionPercent ?? (typeof c.progress === 'number' ? c.progress : 0);
                    let completedChapters = typeof c.completedChapters === 'number' ? c.completedChapters : 0;

                    // Gabungkan dengan localStorage progress jika lebih tinggi (sinkronisasi optimistik)
                    const localRaw = localStorage.getItem(`course_progress_${id}`);
                    if (localRaw) {
                        try {
                            const localP = JSON.parse(localRaw);
                            if (localP.completedChapters > completedChapters) {
                                completedChapters = localP.completedChapters;
                                progress = localP.progress;
                            }
                        } catch (_) {}
                    }
                    
                    return {
                        id,
                        title,
                        category,
                        progress,
                        totalChapters,
                        completedChapters,
                        imageUrl: getSafeImageUrl(imageSource, title)
                    };
                });

                setCourses(mappedCourses);
            } catch (error) {
                console.warn("Gagal mengambil data dari Backend. Menggunakan Data Dummy.");

                // FALLBACK DUMMY DATA (Muncul jika Backend Node.js belum nyala / error)
                setCourses([
                    {
                        id: "1",
                        title: 'Mastering Docker & Microservices',
                        category: 'DevOps',
                        progress: 65,
                        totalChapters: 12,
                        completedChapters: 8,
                        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format'
                    },
                    {
                        id: "2",
                        title: 'Arsitektur Sistem Terdistribusi',
                        category: 'Software Engineering',
                        progress: 100, // Selesai
                        totalChapters: 15,
                        completedChapters: 15,
                        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format'
                    },
                    {
                        id: "3",
                        title: 'Fundamental Basis Data Relasional',
                        category: 'Database',
                        progress: 10,
                        totalChapters: 8,
                        completedChapters: 1,
                        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format'
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyLearning();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24"
        >
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 tracking-tight">Pembelajaran Saya</h1>
                <p className="text-slate-500 font-medium text-base">Lanjutkan membaca materi dan selesaikan kursus Anda.</p>
            </div>

            {/* --- STATE: LOADING --- */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-bold text-slate-500">Memuat data pembelajaran...</p>
                </div>
            )}

            {/* --- STATE: KOSONG (Belum daftar kursus) --- */}
            {!isLoading && courses.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Belum ada kursus</h2>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">Anda belum mendaftar kursus apapun. Silakan kunjungi katalog untuk mulai belajar.</p>
                    <Link href="/courses">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md">
                            Lihat Katalog Kursus
                        </button>
                    </Link>
                </div>
            )}

            {/* --- STATE: ADA DATA KURSUS --- */}
            {!isLoading && courses.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course, index) => {
                        const isCompleted = course.progress === 100;

                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-5 md:gap-6 hover:shadow-md transition-shadow group"
                            >
                                {/* Gambar Cover Kursus */}
                                <div className="w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden relative bg-slate-100 border border-slate-100">
                                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center backdrop-blur-[2px]">
                                            <CheckCircle2 size={32} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Informasi Kursus */}
                                <div className="flex-1 flex flex-col w-full py-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {isCompleted ? 'SELESAI' : course.category}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-2">
                                        {course.title}
                                    </h2>

                                    {/* Info Jumlah Bab Teks */}
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4">
                                        <FileText size={14} className="text-emerald-500" />
                                        <span>Membaca Bab {course.completedChapters} dari {course.totalChapters}</span>
                                    </div>

                                    <div className="mt-auto">
                                        {/* Progress Bar */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-black ${isCompleted ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                {course.progress}%
                                            </span>
                                        </div>

                                        {/* Tombol Lanjut Membaca / Ulangi */}
                                        <Link href={`/my-learning/${course.id}`}>
                                            <button className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isCompleted
                                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-sm'
                                                }`}>
                                                {isCompleted ? (
                                                    <>Ulangi Materi</>
                                                ) : (
                                                    <><BookOpen size={16} /> Lanjut Membaca</>
                                                )}
                                            </button>
                                        </Link>
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