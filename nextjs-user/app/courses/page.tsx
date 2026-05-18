'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Users, BookOpen, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';

// --- STRUKTUR DATA MICROSERVICES ---
interface Course {
    id: string | number;
    title: string;
    description: string;
    instructor: string;
    category?: string;
    imageUrl?: string;
    rating?: number;
    students?: number;
    totalChapters?: number; // Tambahan untuk jumlah materi teks
}

export default function CoursesPage() {
    const router = useRouter();

    // --- STATE MANAGEMENT ---
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // --- 1. MENGAMBIL DATA DARI COURSE SERVICE (MONGODB) ---
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get('/courses');
                const fetchedData = res.data.data.map((c: any) => ({
                    ...c,
                    id: c._id || c.id,
                    rating: c.rating || 4.8,
                    students: c.students || Math.floor(Math.random() * 1000) + 100,
                    totalChapters: c.totalChapters || Math.floor(Math.random() * 10) + 5, // Default jumlah bab
                    imageUrl: c.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop'
                }));
                setCourses(fetchedData);
            } catch (error) {
                console.error("Gagal fetch courses, menggunakan Dummy Data:", error);
                // --- FALLBACK DUMMY (Jika Backend Belum Menyala) ---
                setCourses([
                    { id: "1", title: 'Mastering Docker & Microservices', description: 'Pelajari arsitektur terdistribusi.', instructor: 'Budi Santoso', category: 'DevOps', rating: 4.9, students: 1240, totalChapters: 12, imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format&fit=crop' },
                    { id: "2", title: 'UI/UX Design Fundamental', description: 'Desain antarmuka profesional.', instructor: 'Sarah J.', category: 'Desain', rating: 4.8, students: 3420, totalChapters: 8, imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop' },
                    { id: "3", title: 'Fundamental React & Next.js', description: 'Pemrograman Frontend modern.', instructor: 'Alex W.', category: 'Frontend', rating: 4.7, students: 890, totalChapters: 15, imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // --- 2. FUNGSI MENDAFTAR KURSUS KE ENROLLMENT SERVICE ---
    const handleEnroll = async (courseId: string | number) => {
        setEnrollingId(courseId);
        try {
            await API.post('/enroll', { courseId });
            alert("Berhasil mendaftar! Sistem sedang memproses pendaftaran Anda.");
            router.push('/my-learning');
        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Pendaftaran gagal. Pastikan Anda sudah login.";
            alert(errorMsg);
            if (error.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setEnrollingId(null);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

            {/* --- HEADER KATALOG --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Katalog Materi</h1>
                    <p className="text-slate-500 font-medium">Temukan modul pembelajaran berbasis teks untuk meningkatkan keahlianmu.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari materi atau instruktur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-medium text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* --- LOADING STATE (SKELETON) --- */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white rounded-3xl border border-slate-100 p-4 h-80 animate-pulse flex flex-col gap-4">
                            <div className="w-full h-40 bg-slate-200 rounded-2xl"></div>
                            <div className="w-3/4 h-6 bg-slate-200 rounded-lg"></div>
                            <div className="w-1/2 h-4 bg-slate-200 rounded-lg"></div>
                            <div className="mt-auto w-full h-10 bg-slate-200 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Tidak ada materi ditemukan</h2>
                    <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
            ) : (
                /* --- KONTEN GRID KURSUS --- */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col">

                            {/* Gambar Cover */}
                            <div className="h-48 overflow-hidden relative bg-slate-100 p-2 pb-0">
                                <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-500 relative z-10" />

                                {/* Badge Kategori */}
                                {course.category && (
                                    <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {course.category}
                                    </span>
                                )}
                            </div>

                            {/* Detail Teks */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                                        <Star size={12} className="fill-amber-500 text-amber-500" /> {course.rating}
                                    </span>
                                    {/* INFO JUMLAH BAB & SISWA */}
                                    <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                                        <span className="flex items-center gap-1"><FileText size={12} /> {course.totalChapters} Bab</span>
                                        <span className="flex items-center gap-1"><Users size={12} /> {course.students?.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-slate-800 leading-snug mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                                    Penyusun: <strong className="text-slate-700">{course.instructor}</strong>
                                </p>

                                {/* Tombol Enroll */}
                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    <button
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={enrollingId === course.id}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {enrollingId === course.id ? (
                                            <><Loader2 size={18} className="animate-spin" /> Memproses...</>
                                        ) : (
                                            <><BookOpen size={18} /> Tambahkan ke Pembelajaran</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}