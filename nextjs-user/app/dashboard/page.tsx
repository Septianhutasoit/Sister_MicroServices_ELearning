'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PlayCircle, Clock, Award, ArrowRight, BookOpen,
    Target, Flame, Trophy, Calendar, Zap, Star, Medal, BookMarked, Timer
} from 'lucide-react';
import Link from 'next/link';
import API from '@/lib/api';

/* ─── Framer variants ─────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' },
    hover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
};

/* ─── Static data ────────────────────────────────────────────── */
const STATS = [
    { label: 'Kursus Aktif', value: '3', sub: '+1 minggu ini', icon: PlayCircle, accent: '#3b82f6', bg: '#eff6ff', ring: '#bfdbfe' },
    { label: 'Jam Belajar', value: '24j', sub: '15 menit hari ini', icon: Clock, accent: '#f97316', bg: '#fff7ed', ring: '#fed7aa' },
    { label: 'Sertifikat', value: '2', sub: '1 hampir selesai', icon: Award, accent: '#10b981', bg: '#f0fdf4', ring: '#a7f3d0' },
    { label: 'Streak', value: '7', sub: 'hari berturut-turut 🔥', icon: Flame, accent: '#ef4444', bg: '#fef2f2', ring: '#fecaca' },
];

const ACTIVE_COURSES = [
    {
        id: 1, title: 'Microservices dengan Node.js', category: 'Backend', progress: 68,
        nextLesson: 'Service Discovery & Load Balancing', totalLessons: 42, doneLessons: 28,
        duration: '2j 15m tersisa', level: 'Menengah', color: '#008A5E', colorBg: '#EAF5F1', instructor: 'Rizky Pratama',
    },
    {
        id: 2, title: 'React & Next.js 14 Masterclass', category: 'Frontend', progress: 45,
        nextLesson: 'Server Components Deep Dive', totalLessons: 58, doneLessons: 26,
        duration: '4j 30m tersisa', level: 'Lanjutan', color: '#06b6d4', colorBg: '#ecfeff', instructor: 'Siti Rahayu',
    },
];

const UPCOMING_EXAMS = [
    { title: 'Ujian Midterm: Node.js', date: '22 Mei 2025', time: '09:00', subject: 'Backend', urgent: true },
    { title: 'Kuis Mingguan: React Hooks', date: '25 Mei 2025', time: '14:00', subject: 'Frontend', urgent: false },
];

const LEADERBOARD = [
    { rank: 1, name: 'Aulia Rahma', pts: 4820, avatar: 'A' },
    { rank: 2, name: 'Dimas Prasetyo', pts: 4650, avatar: 'D' },
    { rank: 3, name: 'Budi (Kamu)', pts: 4210, avatar: 'B', isMe: true },
    { rank: 4, name: 'Reza Firmansyah', pts: 3980, avatar: 'R' },
    { rank: 5, name: 'Nadia Kusuma', pts: 3750, avatar: 'N' },
];

/* ─── Sub-components ─────────────────────────────────────────── */
function ProgressRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="shrink-0 -rotate-90">
            {/* Background ring terang */}
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
            <motion.circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={6}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circ}` }}
                animate={{ strokeDasharray: `${dash} ${circ}` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
        </svg>
    );
}

function LevelBadge({ level }: { level: string }) {
    const map: Record<string, string> = {
        'Pemula': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        'Menengah': 'bg-amber-50 text-amber-700 border border-amber-200',
        'Lanjutan': 'bg-red-50 text-red-700 border border-red-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${map[level] ?? 'bg-slate-100 text-slate-500'}`}>
            {level}
        </span>
    );
}

/* ─── Main page ──────────────────────────────────────────────── */
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

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [userName, setUserName] = useState('Siswa');
    const [leaderboard, setLeaderboard] = useState(LEADERBOARD);
    const [activeCourses, setActiveCourses] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const storedName = localStorage.getItem('name') || 'Siswa';
        setUserName(storedName);
        
        const fetchDashboardData = async () => {
            let completedCoursesCount = 0;
            let examPoints = 0;
            let mappedActiveCourses: any[] = [];
            
            // 1. Fetch data pembelajaran aktif untuk menghitung progres materi
            try {
                const res = await API.get('/enrollments/me');
                const fetched = res.data.data || [];
                mappedActiveCourses = fetched.map((c: any) => {
                    const courseDetails = c.course || {};
                    const id = getSafeId(c.courseId) || getSafeId(courseDetails.id) || getSafeId(courseDetails._id) || getSafeId(c.id) || getSafeId(c._id) || Math.random().toString();
                    const totalLessons = c.totalChapters || courseDetails.totalChapters || (courseDetails.materials ? courseDetails.materials.length : 10);

                    // Ambil progress dari backend (gunakan completionPercent jika tersedia, fallback ke progress)
                    let progress = c.completionPercent ?? (typeof c.progress === 'number' ? c.progress : 0);
                    let doneLessons = typeof c.completedChapters === 'number' ? c.completedChapters : 0;

                    // Gabungkan dengan localStorage jika lebih tinggi (sinkronisasi optimistik)
                    try {
                        const localRaw = localStorage.getItem(`course_progress_${id}`);
                        if (localRaw) {
                            const localP = JSON.parse(localRaw);
                            if (localP.completedChapters > doneLessons) {
                                doneLessons = localP.completedChapters;
                                progress = localP.progress;
                            }
                        }
                    } catch (_) {}

                    if (progress >= 100) {
                        completedCoursesCount++;
                    }

                    return {
                        id,
                        title: c.title || courseDetails.title || 'Materi Belajar',
                        category: c.category || courseDetails.category || 'Materi',
                        progress,
                        nextLesson: progress >= 100 ? 'Selesai ✓' : `Bab ${doneLessons + 1}`,
                        totalLessons,
                        doneLessons,
                        duration: progress >= 100 ? 'Telah selesai' : 'Belum selesai',
                        level: 'Semua',
                        color: progress >= 100 ? '#10b981' : '#3b82f6',
                        colorBg: progress >= 100 ? '#f0fdf4' : '#eff6ff',
                        instructor: c.instructor || courseDetails.instructor || 'Pengajar'
                    };
                });
                setActiveCourses(mappedActiveCourses);
            } catch (error) {
                console.warn("Gagal mengambil data pembelajaran aktif dari backend:", error);
                setActiveCourses([]);
            }

            // 2. Fetch data nilai ujian (dari Laptop 3) untuk menghitung skor ujian yang lulus (score >= 60)
            try {
                const examRes = await API.get('/exams/history');
                const history = examRes.data.data || [];
                const passedExams = history.filter((curr: any) => (curr.score || 0) >= 60);
                examPoints = passedExams.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
            } catch (e) {
                console.warn("Gagal mengambil data poin/nilai ujian dari backend, menggunakan 0 pts.");
            }

            const userPts = (completedCoursesCount * 500) + examPoints;

            // 3. Buat leaderboard dinamis terurut berdasarkan pts tertinggi
            const initialLeaderboard = [
                { rank: 1, name: 'Aulia Rahma', pts: 4820, avatar: 'A' },
                { rank: 2, name: 'Dimas Prasetyo', pts: 4650, avatar: 'D' },
                { rank: 3, name: 'Reza Firmansyah', pts: 3980, avatar: 'R' },
                { rank: 4, name: 'Nadia Kusuma', pts: 3750, avatar: 'N' },
                { rank: 5, name: `${storedName} (Kamu)`, pts: userPts, avatar: storedName.charAt(0).toUpperCase(), isMe: true }
            ];

            const sorted = initialLeaderboard
                .sort((a, b) => b.pts - a.pts)
                .map((item, index) => ({
                    ...item,
                    rank: index + 1
                }));
            setLeaderboard(sorted);
        };
        
        fetchDashboardData();
    }, []);

    const dynamicStats = [
        { label: 'Kursus Aktif', value: activeCourses.length.toString(), sub: activeCourses.length > 0 ? '+1 minggu ini' : 'Mulai belajar', icon: PlayCircle, accent: '#3b82f6', bg: '#eff6ff', ring: '#bfdbfe' },
        { label: 'Jam Belajar', value: activeCourses.length > 0 ? '1j' : '0j', sub: activeCourses.length > 0 ? 'Baru mulai' : 'Ayo mulai!', icon: Clock, accent: '#f97316', bg: '#fff7ed', ring: '#fed7aa' },
        { label: 'Sertifikat', value: activeCourses.filter(c => c.progress === 100).length.toString(), sub: 'Selesaikan kursus', icon: Award, accent: '#10b981', bg: '#f0fdf4', ring: '#a7f3d0' },
        { label: 'Streak', value: activeCourses.length > 0 ? '1' : '0', sub: 'hari berturut-turut 🔥', icon: Flame, accent: '#ef4444', bg: '#fef2f2', ring: '#fecaca' },
    ];

    if (!mounted) return null;

    return (
        // Pembungkus Utama: Background Terang, Full Width (100% Layar)
        <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden pt-24 pb-12">

            {/* Kontainer dibatasi max-w-7xl agar rapi di monitor lebar, tapi layarnya tetap putih full */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ══════════════════════════════════════════════
                    HERO BANNER DENGAN GAMBAR BACKGROUND
                ══════════════════════════════════════════════ */}
                <motion.div {...fadeUp(0)} className="relative rounded-[2rem] overflow-hidden mb-10 shadow-md min-h-[340px] flex items-center">

                    {/* Gambar Background (Mengambil dari Unsplash) */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop")' }}
                    />

                    {/* Overlay Hitam Transparan agar teks tetap terbaca */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 w-full">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-1.5 mb-5 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                                    Semester Ganjil 2025
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                                Selamat kembali, <span className="text-emerald-400">{userName}!</span> 👋
                            </h1>
                            <p className="text-slate-200 text-base font-medium mb-8 leading-relaxed max-w-xl">
                                Kamu sudah belajar <strong className="text-white">7 hari berturut-turut</strong>. Lanjutkan momentum ini!
                                Waktunya menyelesaikan target kursus minggu ini.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/my-learning">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-colors"
                                    >
                                        <PlayCircle size={18} /> Lanjutkan Belajar
                                    </motion.button>
                                </Link>
                                <Link href="/courses">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all"
                                    >
                                        <BookOpen size={18} /> Katalog Kursus
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ══════════════════════════════════════════════
                    STATS ROW (KOTAK PUTIH BERSIH)
                ══════════════════════════════════════════════ */}
                <motion.div variants={stagger} initial="initial" animate="animate"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {dynamicStats.map((s, i) => (
                        <motion.div
                            key={i}
                            variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                            whileHover="hover" initial="rest" animate="rest"
                            // @ts-ignore
                            variants={cardHover}
                            className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-5 cursor-default transition-all shadow-sm"
                        >
                            <div className="p-3.5 rounded-2xl shrink-0" style={{ background: s.bg, border: `1px solid ${s.ring}` }}>
                                <s.icon size={26} style={{ color: s.accent }} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-3xl font-black text-slate-800 leading-none mb-1 tracking-tight">{s.value}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</p>
                                <p className="text-[10px] text-slate-400 mt-1 truncate font-medium">{s.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ══════════════════════════════════════════════
                    MAIN GRID: Kursus Aktif + Sidebar Kanan
                ══════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

                    {/* LEFT: Kursus Aktif */}
                    <motion.div {...fadeUp(0.1)} className="xl:col-span-2 space-y-6">
                        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                    Pembelajaran Aktif
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Lanjutkan {activeCourses.length} kursus yang sedang berjalan
                                </p>
                            </div>
                            <Link href="/my-learning">
                                <button className="text-sm font-bold flex items-center gap-1.5 transition-colors text-emerald-600 hover:text-emerald-700">
                                    Lihat semua <ArrowRight size={16} />
                                </button>
                            </Link>
                        </div>

                        {activeCourses.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={28} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada pembelajaran aktif</h3>
                                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                                    Anda belum terdaftar di kursus apa pun. Silakan kunjungi katalog untuk memulai pembelajaran pertama Anda!
                                </p>
                                <Link href="/courses">
                                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-emerald-600/10">
                                        Pilih Kursus di Katalog
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            activeCourses.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -4, boxShadow: `0 20px 40px ${course.color}15` }}
                                    className="bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer transition-all shadow-sm"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                        {/* Progress ring */}
                                        <div className="relative shrink-0 mx-auto sm:mx-0">
                                            <ProgressRing pct={course.progress} color={course.color} size={70} />
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-800">
                                                {course.progress}%
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md text-emerald-800 tracking-wide uppercase border border-emerald-200"
                                                            style={{ background: course.colorBg }}>
                                                            {course.category}
                                                        </span>
                                                        <LevelBadge level={course.level} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Instruktur:{' '}
                                                        <span className="font-bold text-slate-700">{course.instructor}</span>
                                                    </p>
                                                </div>
                                                <Link href={`/my-learning/${course.id}`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 text-xs font-bold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-md"
                                                        style={{ background: course.color }}
                                                    >
                                                        <PlayCircle size={16} /> Lanjutkan
                                                    </motion.button>
                                                </Link>
                                            </div>

                                            {/* Progress bar info */}
                                            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                                        <BookMarked size={12} style={{ color: course.color }} />
                                                        Selanjutnya:{' '}
                                                        <em className="not-italic text-slate-800 font-bold truncate max-w-[150px] sm:max-w-xs">
                                                            {course.nextLesson}
                                                        </em>
                                                    </span>
                                                    <span className="text-[10px] text-slate-600 font-bold px-2 py-1 rounded-md bg-white border border-slate-200">
                                                        {course.doneLessons} / {course.totalLessons}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 rounded-full overflow-hidden mb-2 bg-slate-200">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: course.color }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${course.progress}%` }}
                                                        transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                                    <Timer size={12} /> Estimasi sisa: {course.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* RIGHT SIDEBAR (Ujian & Leaderboard) */}
                    <div className="space-y-6">

                        {/* Ujian Mendatang */}
                        <motion.div {...fadeUp(0.2)} className="rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-sm">
                            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-amber-100 border border-amber-200">
                                        <Calendar size={18} className="text-amber-600" />
                                    </div>
                                    <span className="text-base font-black text-slate-800">Ujian Mendatang</span>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100 p-2">
                                {UPCOMING_EXAMS.map((exam, i) => (
                                    <div key={i} className="p-4 rounded-2xl transition-all m-1 hover:bg-slate-50 cursor-pointer">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 leading-tight truncate mb-1.5">
                                                    {exam.title}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                        {exam.subject}
                                                    </span>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                        <Clock size={12} /> {exam.date} • {exam.time}
                                                    </p>
                                                </div>
                                            </div>
                                            {exam.urgent && (
                                                <span className="shrink-0 text-[10px] font-black px-2 py-1 rounded-lg animate-pulse bg-red-100 text-red-600 border border-red-200">
                                                    URGENT
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Leaderboard */}
                        <motion.div {...fadeUp(0.25)} className="rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-sm">
                            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-100 border border-emerald-200">
                                        <Trophy size={18} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-800 leading-tight">
                                            Papan Peringkat
                                        </p>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Minggu ini</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                {leaderboard.map((u, i) => (
                                    <div key={i}
                                        className={`px-4 py-3 flex items-center gap-4 rounded-2xl mb-1 transition-all ${u.isMe ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                                        <span className={`w-6 text-center text-sm font-black shrink-0 ${u.rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                                            {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                                        </span>
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${u.isMe ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
                                            {u.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${u.isMe ? 'text-emerald-700' : 'text-slate-700'}`}>
                                                {u.name}
                                            </p>
                                        </div>
                                        <span className="text-xs font-black px-2.5 py-1 rounded-lg shrink-0 bg-white border border-slate-200 text-slate-600">
                                            {u.pts.toLocaleString('en-US')} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}