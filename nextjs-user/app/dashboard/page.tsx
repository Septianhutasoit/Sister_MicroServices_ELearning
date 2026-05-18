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
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
    hover: { y: -5, boxShadow: '0 24px 48px rgba(0,212,140,0.10)' },
};

/* ─── Static data ────────────────────────────────────────────── */
const STATS = [
    { label: 'Kursus Aktif', value: '3', sub: '+1 minggu ini', icon: PlayCircle, accent: '#60a5fa', bg: 'rgba(96,165,250,0.12)', ring: 'rgba(96,165,250,0.25)' },
    { label: 'Jam Belajar', value: '24j', sub: '15 menit hari ini', icon: Clock, accent: '#fb923c', bg: 'rgba(251,146,60,0.12)', ring: 'rgba(251,146,60,0.25)' },
    { label: 'Sertifikat', value: '2', sub: '1 hampir selesai', icon: Award, accent: '#34d399', bg: 'rgba(52,211,153,0.12)', ring: 'rgba(52,211,153,0.25)' },
    { label: 'Streak', value: '7', sub: 'hari berturut-turut 🔥', icon: Flame, accent: '#f87171', bg: 'rgba(248,113,113,0.12)', ring: 'rgba(248,113,113,0.25)' },
];

const ACTIVE_COURSES = [
    {
        id: 1, title: 'Microservices dengan Node.js', category: 'Backend', progress: 68,
        nextLesson: 'Service Discovery & Load Balancing', totalLessons: 42, doneLessons: 28,
        duration: '2j 15m tersisa', level: 'Menengah', color: '#00D48C', colorBg: 'rgba(0,212,140,0.10)', instructor: 'Rizky Pratama',
    },
    {
        id: 2, title: 'React & Next.js 14 Masterclass', category: 'Frontend', progress: 45,
        nextLesson: 'Server Components Deep Dive', totalLessons: 58, doneLessons: 26,
        duration: '4j 30m tersisa', level: 'Lanjutan', color: '#22d3ee', colorBg: 'rgba(34,211,238,0.10)', instructor: 'Siti Rahayu',
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
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
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
        'Pemula': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        'Menengah': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        'Lanjutan': 'bg-red-500/20 text-red-300 border border-red-500/30',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${map[level] ?? 'bg-white/10 text-white/60'}`}>
            {level}
        </span>
    );
}

/* ─── Animated background orbs ──────────────────────────────── */
function BgOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Deep base */}
            <div className="absolute inset-0 bg-[#060A14]" />

            {/* Mesh gradient top-left */}
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,212,140,0.12) 0%, transparent 70%)' }} />

            {/* Mesh gradient top-right */}
            <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />

            {/* Mesh gradient bottom-right */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)' }} />

            {/* Mesh gradient bottom-left */}
            <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,212,140,0.06) 0%, transparent 70%)' }} />

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }} />

            {/* Top noise grain */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }} />

            {/* Subtle horizontal glow line at top */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,140,0.4), rgba(34,211,238,0.3), transparent)' }} />
        </div>
    );
}

/* ─── Glassmorphism card wrapper ─────────────────────────────── */
function GlassCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    return (
        <div
            className={`rounded-3xl border border-white/[0.07] backdrop-blur-xl ${className}`}
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <>
            <BgOrbs />

            <div className="relative z-10 min-h-screen text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">

                    {/* ══════════════════════════════════════════
                        HERO BANNER
                    ══════════════════════════════════════════ */}
                    <motion.div {...fadeUp(0)} className="relative rounded-[2rem] overflow-hidden mb-10">
                        {/* Gradient background */}
                        <div className="absolute inset-0 rounded-[2rem]"
                            style={{ background: 'linear-gradient(135deg, rgba(0,90,60,0.95) 0%, rgba(0,60,40,0.98) 50%, rgba(4,20,40,0.99) 100%)' }} />

                        {/* Decorative glows */}
                        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30"
                            style={{ background: 'radial-gradient(circle, #00D48C, transparent)' }} />
                        <div className="absolute bottom-0 left-1/2 w-60 h-60 rounded-full blur-3xl opacity-20"
                            style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />

                        {/* Grid lines */}
                        <div className="absolute inset-0 rounded-[2rem] opacity-[0.04]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                            }} />

                        {/* Border glow */}
                        <div className="absolute inset-0 rounded-[2rem]"
                            style={{ boxShadow: 'inset 0 1px 0 rgba(0,212,140,0.3), inset 0 0 0 1px rgba(0,212,140,0.08)' }} />

                        <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
                                    style={{ background: 'rgba(0,212,140,0.15)', border: '1px solid rgba(0,212,140,0.3)' }}>
                                    <span className="w-2 h-2 rounded-full bg-[#00D48C] animate-pulse" />
                                    <span className="text-xs font-bold text-[#00D48C] uppercase tracking-wider">
                                        Mode Belajar Aktif
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
                                    style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif', letterSpacing: '-0.02em' }}>
                                    Selamat kembali, <span style={{ color: '#00D48C' }}>Budi!</span> 👋
                                </h1>
                                <p className="text-white/70 text-base font-medium mb-8 leading-relaxed">
                                    Kamu sudah belajar{' '}
                                    <strong className="text-white px-2 py-0.5 rounded-lg"
                                        style={{ background: 'rgba(0,212,140,0.2)', color: '#6ee7b7' }}>
                                        7 hari berturut-turut
                                    </strong>. Lanjutkan momentum ini!
                                    Hanya 32% lagi untuk menyelesaikan kursus Node.js.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Link href="/my-learning">
                                        <motion.button
                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm text-[#060A14] transition-all"
                                            style={{ background: 'linear-gradient(135deg, #00D48C, #00B87A)', boxShadow: '0 8px 24px rgba(0,212,140,0.35)' }}
                                        >
                                            <PlayCircle size={18} /> Lanjutkan Belajar
                                        </motion.button>
                                    </Link>
                                    <Link href="/courses">
                                        <motion.button
                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white/90 transition-all"
                                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
                                        >
                                            <BookOpen size={18} /> Katalog Kursus
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right — mini stats */}
                            <div className="flex gap-4 shrink-0 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto">
                                {[
                                    { v: '68%', l: 'Progress Node.js', icon: Target, color: '#00D48C' },
                                    { v: '7🔥', l: 'Hari Streak', icon: Flame, color: '#fb923c' },
                                    { v: '#3', l: 'Peringkatmu', icon: Trophy, color: '#fbbf24' },
                                ].map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="flex flex-col items-center justify-center min-w-[96px] h-[96px] rounded-3xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: `1px solid rgba(255,255,255,0.08)`,
                                            backdropFilter: 'blur(12px)',
                                        }}
                                    >
                                        <span className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.03em' }}>{s.v}</span>
                                        <span className="text-[10px] text-white/50 font-bold text-center leading-tight px-2">{s.l}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ══════════════════════════════════════════
                        STATS ROW
                    ══════════════════════════════════════════ */}
                    <motion.div variants={stagger} initial="initial" animate="animate"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {STATS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.07 }}
                                whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,0,0,0.4)` }}
                                className="rounded-3xl p-6 flex items-center gap-5 cursor-default transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                <div className="p-3.5 rounded-2xl shrink-0"
                                    style={{ background: s.bg, border: `1px solid ${s.ring}` }}>
                                    <s.icon size={22} style={{ color: s.accent }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-3xl font-black text-white leading-none mb-1"
                                        style={{ letterSpacing: '-0.03em' }}>{s.value}</p>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-wide">{s.label}</p>
                                    <p className="text-[10px] text-white/30 mt-1 truncate font-medium">{s.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ══════════════════════════════════════════
                        MAIN GRID
                    ══════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

                        {/* LEFT: Kursus Aktif */}
                        <motion.div {...fadeUp(0.1)} className="xl:col-span-2 space-y-6">
                            <div className="flex items-end justify-between pb-4"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <div>
                                    <h2 className="text-xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                                        Pembelajaran Aktif
                                    </h2>
                                    <p className="text-xs text-white/40 font-medium mt-1">
                                        Lanjutkan {ACTIVE_COURSES.length} kursus yang sedang berjalan
                                    </p>
                                </div>
                                <Link href="/my-learning">
                                    <button className="text-sm font-bold flex items-center gap-1.5 transition-colors"
                                        style={{ color: '#00D48C' }}>
                                        Lihat semua <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>

                            {ACTIVE_COURSES.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -4, boxShadow: `0 24px 48px rgba(0,0,0,0.4)` }}
                                    className="rounded-3xl p-6 cursor-pointer transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                        {/* Progress ring */}
                                        <div className="relative shrink-0 mx-auto sm:mx-0">
                                            <ProgressRing pct={course.progress} color={course.color} size={70} />
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-black"
                                                style={{ color: course.color }}>
                                                {course.progress}%
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md text-[#060A14] tracking-wide uppercase"
                                                            style={{ background: course.color }}>
                                                            {course.category}
                                                        </span>
                                                        <LevelBadge level={course.level} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white leading-tight mb-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-xs text-white/40 font-medium">
                                                        Instruktur:{' '}
                                                        <span className="font-bold text-white/70">{course.instructor}</span>
                                                    </p>
                                                </div>
                                                <Link href={`/my-learning/${course.id}`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 text-xs font-bold text-[#060A14] px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                                                        style={{ background: course.color, boxShadow: `0 8px 20px ${course.color}40` }}
                                                    >
                                                        <PlayCircle size={16} /> Lanjutkan
                                                    </motion.button>
                                                </Link>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mt-4 p-3 rounded-2xl"
                                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                                                        <BookMarked size={12} style={{ color: course.color }} />
                                                        Selanjutnya:{' '}
                                                        <em className="not-italic text-white/80 font-bold truncate max-w-[150px] sm:max-w-xs">
                                                            {course.nextLesson}
                                                        </em>
                                                    </span>
                                                    <span className="text-[10px] text-white/40 font-bold px-2 py-1 rounded-md"
                                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                        {course.doneLessons} / {course.totalLessons}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 rounded-full overflow-hidden mb-2"
                                                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)` }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${course.progress}%` }}
                                                        transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-white/30 font-semibold flex items-center gap-1">
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
                            <motion.div {...fadeUp(0.2)} className="rounded-[2rem] overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}>
                                <div className="px-6 py-5 flex items-center justify-between"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                            style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.25)' }}>
                                            <Calendar size={18} style={{ color: '#fbbf24' }} />
                                        </div>
                                        <span className="text-base font-black text-white">Ujian Mendatang</span>
                                    </div>
                                </div>
                                <div className="divide-y p-2" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                                    {UPCOMING_EXAMS.map((exam, i) => (
                                        <div key={i} className="p-4 rounded-2xl transition-all m-1 hover:bg-white/[0.04]">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-white/90 leading-tight truncate mb-1.5">
                                                        {exam.title}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white/50"
                                                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                                                            {exam.subject}
                                                        </span>
                                                        <p className="text-xs text-white/40 flex items-center gap-1 font-medium">
                                                            <Clock size={12} /> {exam.date} • {exam.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                {exam.urgent && (
                                                    <span className="shrink-0 text-[10px] font-black px-2 py-1 rounded-lg animate-pulse"
                                                        style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                                                        URGENT
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Leaderboard */}
                            <motion.div {...fadeUp(0.25)} className="rounded-[2rem] overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}>
                                <div className="px-6 py-5 flex items-center justify-between"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                            style={{ background: 'rgba(0,212,140,0.15)', border: '1px solid rgba(0,212,140,0.25)' }}>
                                            <Trophy size={18} style={{ color: '#00D48C' }} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-white leading-tight">
                                                Papan Peringkat
                                            </p>
                                            <p className="text-xs font-semibold text-white/30 mt-0.5">Minggu ini</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    {LEADERBOARD.map((u, i) => (
                                        <div key={i}
                                            className="px-4 py-3 flex items-center gap-4 rounded-2xl mb-1 transition-all"
                                            style={u.isMe ? {
                                                background: 'rgba(0,212,140,0.10)',
                                                border: '1px solid rgba(0,212,140,0.2)',
                                            } : {}}>
                                            <span className={`w-6 text-center text-sm font-black shrink-0 ${u.rank <= 3 ? 'text-amber-400' : 'text-white/30'}`}>
                                                {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                                            </span>
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                                                style={u.isMe ? {
                                                    background: 'linear-gradient(135deg, #00D48C, #00B87A)',
                                                    boxShadow: '0 4px 12px rgba(0,212,140,0.4)',
                                                    color: '#060A14',
                                                } : {
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'rgba(255,255,255,0.5)',
                                                }}>
                                                {u.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate"
                                                    style={{ color: u.isMe ? '#00D48C' : 'rgba(255,255,255,0.7)' }}>
                                                    {u.name}
                                                </p>
                                            </div>
                                            <span className="text-xs font-black px-2.5 py-1 rounded-lg shrink-0 text-white/60"
                                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                {u.pts.toLocaleString('en-US')} pts
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="h-10" />
                </div>
            </div>
        </>
    );
}