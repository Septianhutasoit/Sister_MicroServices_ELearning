'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PlayCircle, Clock, Award, ArrowRight, BookOpen,
    Brain, TrendingUp, CheckCircle2, Lock, Star,
    Flame, Target, Bell, Zap, Calendar, Users, Trophy,
    Medal, BookMarked, GraduationCap, Timer, Sparkles,
} from 'lucide-react';
import Link from 'next/link';

/* ─── Framer variants ─────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 }, // Sedikit lebih jauh gerakannya
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    hover: { y: -6, boxShadow: '0 20px 40px rgba(16,185,129,0.12)' },
};

/* ─── Static data (Sama seperti sebelumnya) ───────────────────── */
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

const ACHIEVEMENTS = [
    { title: 'Fast Learner', desc: 'Selesaikan 3 modul dalam sehari', icon: Zap, earned: true, color: '#f59e0b' },
    { title: 'Perfect Score', desc: 'Raih nilai 100 dalam kuis', icon: Star, earned: true, color: '#10b981' },
    { title: 'Consistent', desc: '7 hari belajar berturut-turut', icon: Flame, earned: true, color: '#ef4444' },
    { title: 'Completionist', desc: 'Selesaikan 5 kursus penuh', icon: Trophy, earned: false, color: '#8b5cf6' },
    { title: 'Top Scorer', desc: 'Masuk 10 besar leaderboard', icon: Medal, earned: false, color: '#3b82f6' },
    { title: 'Explorer', desc: 'Coba 10 kategori berbeda', icon: Target, earned: false, color: '#06b6d4' },
];

const LEADERBOARD = [
    { rank: 1, name: 'Aulia Rahma', pts: 4820, avatar: 'A' },
    { rank: 2, name: 'Dimas Prasetyo', pts: 4650, avatar: 'D' },
    { rank: 3, name: 'Budi (Kamu)', pts: 4210, avatar: 'B', isMe: true },
    { rank: 4, name: 'Reza Firmansyah', pts: 3980, avatar: 'R' },
    { rank: 5, name: 'Nadia Kusuma', pts: 3750, avatar: 'N' },
];

const WEEKLY = [40, 65, 30, 80, 55, 90, 45];
const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const maxW = Math.max(...WEEKLY);

const RECOMMENDED = [
    { title: 'TypeScript Advanced Patterns', category: 'Frontend', rating: 4.9, students: '12.4k', duration: '18j', level: 'Lanjutan', color: '#3b82f6' },
    { title: 'AWS Cloud Practitioner', category: 'Cloud', rating: 4.8, students: '8.7k', duration: '24j', level: 'Pemula', color: '#f97316' },
    { title: 'PostgreSQL & Database Design', category: 'Database', rating: 4.7, students: '6.2k', duration: '14j', level: 'Menengah', color: '#8b5cf6' },
];

/* ─── Sub-components ──────────────────────────────────────────── */

function ProgressRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="shrink-0 -rotate-90">
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
        'Pemula': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        'Menengah': 'bg-amber-50 text-amber-600 border border-amber-200',
        'Lanjutan': 'bg-red-50 text-red-500 border border-red-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${map[level] ?? 'bg-slate-100 text-slate-500'}`}>
            {level}
        </span>
    );
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'progress' | 'activity'>('progress');
    const [mounted, setMounted] = useState(false);

    // Mencegah hydration error
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Render kosong saat di server

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">

            {/* ══════════════════════════════════════════════
                HERO BANNER
            ══════════════════════════════════════════════ */}
            <motion.div {...fadeUp(0)} className="relative rounded-[2rem] overflow-hidden mb-10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] via-[#008A5E] to-[#10B981]" />
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Mode Belajar Aktif
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                            Selamat kembali, <span className="text-emerald-200">Budi!</span> 👋
                        </h1>
                        <p className="text-emerald-50 text-base font-medium mb-8 leading-relaxed opacity-90">
                            Kamu sudah belajar <strong className="text-white bg-white/20 px-1.5 py-0.5 rounded">7 hari berturut-turut</strong>. Lanjutkan momentum ini!
                            Hanya 32% lagi untuk menyelesaikan kursus Node.js & Microservices.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/my-learning">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-colors"
                                >
                                    <PlayCircle size={18} /> Lanjutkan Belajar
                                </motion.button>
                            </Link>
                            <Link href="/courses">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-black/20 hover:bg-black/30 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-sm transition-all"
                                >
                                    <BookOpen size={18} /> Katalog Kursus
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* Right — mini stats */}
                    <div className="flex gap-4 shrink-0 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto hide-scrollbar">
                        {[
                            { v: '68%', l: 'Progress Node.js', icon: Target },
                            { v: '7🔥', l: 'Hari Streak', icon: Flame },
                            { v: '#3', l: 'Peringkatmu', icon: Trophy },
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex flex-col items-center justify-center min-w-[90px] h-[90px] bg-black/20 border border-white/10 rounded-3xl backdrop-blur-md"
                            >
                                <span className="text-2xl font-black text-white mb-1">{s.v}</span>
                                <span className="text-[10px] text-emerald-100/70 font-bold text-center leading-tight px-2">{s.l}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════
                STATS ROW
            ══════════════════════════════════════════════ */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {STATS.map((s, i) => (
                    <motion.div
                        key={i}
                        variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.5 }}
                        whileHover="hover" initial="rest" animate="rest"
                        // @ts-ignore
                        variants={cardHover}
                        className="bg-white border border-slate-100/60 rounded-3xl p-6 flex items-center gap-5 cursor-default transition-all"
                    >
                        <div className="p-4 rounded-2xl shrink-0" style={{ background: s.bg, border: `1px solid ${s.ring}` }}>
                            <s.icon size={26} style={{ color: s.accent }} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-3xl font-black text-slate-800 leading-none mb-1">{s.value}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</p>
                            <p className="text-[10px] text-slate-400 mt-1 truncate font-medium">{s.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ══════════════════════════════════════════════
                MAIN GRID: Kursus Aktif + Sidebar
            ══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

                {/* LEFT: Kursus Aktif (2/3 width) */}
                <motion.div {...fadeUp(0.1)} className="xl:col-span-2 space-y-6">
                    <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Pembelajaran Aktif</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Lanjutkan {ACTIVE_COURSES.length} kursus yang sedang berjalan</p>
                        </div>
                        <Link href="/my-learning">
                            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
                                Lihat semua <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>

                    {ACTIVE_COURSES.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -4, boxShadow: `0 20px 40px ${course.color}15` }}
                            className="bg-white border border-slate-100/80 rounded-3xl p-6 cursor-pointer transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                {/* Progress ring */}
                                <div className="relative shrink-0 mx-auto sm:mx-0">
                                    <ProgressRing pct={course.progress} color={course.color} size={70} />
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black" style={{ color: course.color }}>
                                        {course.progress}%
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md text-white tracking-wide uppercase"
                                                    style={{ background: course.color }}>
                                                    {course.category}
                                                </span>
                                                <LevelBadge level={course.level} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{course.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Instruktur: <span className="font-bold text-slate-700">{course.instructor}</span></p>
                                        </div>
                                        <Link href={`/my-learning/${course.id}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 text-xs font-bold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-md"
                                                style={{ background: course.color, boxShadow: `0 8px 20px ${course.color}40` }}
                                            >
                                                <PlayCircle size={16} /> Lanjutkan
                                            </motion.button>
                                        </Link>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                                <BookMarked size={12} className="text-emerald-600" />
                                                Selanjutnya: <em className="not-italic text-slate-800 font-bold truncate max-w-[150px] sm:max-w-xs">{course.nextLesson}</em>
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-1 rounded-md border border-slate-200">
                                                {course.doneLessons} / {course.totalLessons}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: course.color }}
                                                initial={{ width: 0 }} animate={{ width: `${course.progress}%` }}
                                                transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                            <Timer size={12} /> Estimasi sisa: {course.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-6">

                    {/* Ujian Mendatang */}
                    <motion.div {...fadeUp(0.2)} className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200">
                                    <Calendar size={18} className="text-amber-600" />
                                </div>
                                <span className="text-base font-black text-slate-800">Ujian Mendatang</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100 p-2">
                            {UPCOMING_EXAMS.map((exam, i) => (
                                <div key={i} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors m-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 leading-tight truncate mb-1.5">{exam.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{exam.subject}</span>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                    <Clock size={12} /> {exam.date} • {exam.time}
                                                </p>
                                            </div>
                                        </div>
                                        {exam.urgent && (
                                            <span className="shrink-0 text-[10px] font-black bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded-lg animate-pulse">
                                                HARI INI
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Leaderboard */}
                    <motion.div {...fadeUp(0.25)} className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#008A5E]/10 flex items-center justify-center border border-[#008A5E]/20">
                                    <Trophy size={18} className="text-[#008A5E]" />
                                </div>
                                <div>
                                    <p className="text-base font-black text-slate-800 leading-tight">Papan Peringkat</p>
                                    <p className="text-xs font-semibold text-slate-400 mt-0.5">Minggu ini</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-3">
                            {LEADERBOARD.map((u, i) => (
                                <div key={i} className={`px-4 py-3 flex items-center gap-4 rounded-2xl mb-1 ${u.isMe ? 'bg-[#008A5E]/10 border border-[#008A5E]/20' : 'hover:bg-slate-50'} transition-colors`}>
                                    <span className={`w-6 text-center text-sm font-black shrink-0 ${u.rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                                        {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                                    </span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0
                                        ${u.isMe ? 'bg-gradient-to-br from-[#008A5E] to-teal-600 shadow-md' : 'bg-slate-300'}`}>
                                        {u.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${u.isMe ? 'text-[#008A5E]' : 'text-slate-700'}`}>
                                            {u.name} {u.isMe && '(Kamu)'}
                                        </p>
                                    </div>
                                    <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg shrink-0">
                                        {u.pts.toLocaleString('en-US')} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Bottom padding */}
            <div className="h-10" />
        </div>
    );
}