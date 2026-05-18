'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ChevronDown, LogOut, Settings, User,
    Home, BookOpen, ClipboardList, Menu, X,
    Trophy, Calendar, PlayCircle, Brain,
} from 'lucide-react';

export default function StudentNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isQuickOpen, setIsQuickOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [userName, setUserName] = useState('Student');
    const [userEmail, setUserEmail] = useState('');
    const [userInitial, setUserInitial] = useState('S');

    /* ── Proteksi role student ─────────────────────────────── */
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('role') || Cookies.get('role');
        const name = localStorage.getItem('name') || 'Student';
        const email = localStorage.getItem('email') || '';
        if (!token || role?.toLowerCase() !== 'student') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
            setUserName(name);
            setUserEmail(email);
            setUserInitial(name.charAt(0).toUpperCase());
        }
    }, [router, pathname]);

    /* ── Scroll listener — pill muncul setelah 80px ────────── */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 80);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Logout ────────────────────────────────────────────── */
    const handleLogout = () => {
        if (!confirm('Yakin ingin keluar?')) return;
        localStorage.clear();
        ['token', 'role', 'name', 'email'].forEach(k => Cookies.remove(k, { path: '/' }));
        router.push('/login');
    };

    /* ── Nav items ─────────────────────────────────────────── */
    const navItems = [
        { name: 'Beranda', href: '/dashboard', icon: Home },
        { name: 'Katalog Kursus', href: '/courses', icon: BookOpen },
        { name: 'Pembelajaran Saya', href: '/my-learning', icon: PlayCircle },
        { name: 'Ujian', href: '/exam', icon: Brain },
        { name: 'Pencapaian', href: '/achievements', icon: Trophy },
    ];

    const quickItems = [
        { href: '/my-learning', icon: PlayCircle, label: 'Kursus Aktif', desc: 'Lanjutkan pembelajaran' },
        { href: '/exam', icon: Calendar, label: 'Ujian Mendatang', desc: 'Lihat jadwal ujian' },
        { href: '/achievements', icon: Trophy, label: 'Pencapaian', desc: 'Sertifikat & lencana' },
    ];

    if (!isAuthorized) return null;

    return (
        <>
            {/* ════════════════════════════════════════
                NAVBAR
            ════════════════════════════════════════ */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
                className="fixed top-0 left-0 right-0 z-[100]"
            >
                {/*
                  OUTER WRAPPER
                  Belum scroll  → padding 0, full-width
                  Sudah scroll  → padding horizontal muncul → inner jadi pill
                */}
                <div className={`
                    w-full transition-all duration-500 ease-in-out
                    ${isScrolled ? 'px-4 sm:px-8 pt-3 pb-2' : 'px-0 pt-0 pb-0'}
                `}>
                    {/*
                      INNER BAR
                      Belum scroll  → transparan, full-width, tanpa border
                      Sudah scroll  → pill melayang + backdrop-blur + border
                    */}
                    <div className={`
                        flex items-center justify-between gap-4
                        transition-all duration-500 ease-in-out
                        ${isScrolled
                            ? 'bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 px-5 py-2.5 shadow-2xl shadow-black/30'
                            : 'bg-gradient-to-b from-black/30 to-transparent px-6 sm:px-10 py-4'}
                    `}>

                        {/* ── Brand ───────────────────────────────── */}
                        <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shrink-0 border border-emerald-400">
                                <BookOpen size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-black tracking-tight text-white">
                                    Edu
                                    <span className={isScrolled ? 'text-emerald-400' : 'text-emerald-300'}>
                                        Learn
                                    </span>
                                </span>
                                <span className={`
                                    text-[9px] font-semibold tracking-wider uppercase
                                    transition-colors duration-500
                                    ${isScrolled ? 'text-slate-400' : 'text-white/50'}
                                `}>
                                    Student Portal
                                </span>
                            </div>
                        </Link>

                        {/* ── Nav items desktop ────────────────────── */}
                        <div className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-1">
                                {navItems.map((item) => {
                                    const active = pathname === item.href
                                        || pathname.startsWith(item.href + '/');
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={`
                                                    relative flex items-center gap-1.5
                                                    px-3 py-2 rounded-xl text-sm font-medium
                                                    transition-all duration-200 cursor-pointer
                                                    ${active
                                                        ? isScrolled
                                                            ? 'text-emerald-400'
                                                            : 'text-white'
                                                        : isScrolled
                                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                                            : 'text-white/75 hover:text-white hover:bg-white/10'}
                                                `}
                                            >
                                                <item.icon size={15} className="shrink-0" />
                                                <span>{item.name}</span>

                                                {/* Animated underline indicator */}
                                                {active && (
                                                    <motion.div
                                                        layoutId="navUnderline"
                                                        className={`
                                                            absolute bottom-0.5 left-3 right-3
                                                            h-0.5 rounded-full
                                                            ${isScrolled ? 'bg-emerald-400' : 'bg-white'}
                                                        `}
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Action kanan ─────────────────────────── */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* Quick access */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsQuickOpen(v => !v)}
                                    aria-label="Aktivitas saya"
                                    className={`
                                        relative p-2 rounded-xl transition-all
                                        ${isScrolled
                                            ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    <ClipboardList size={18} />
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                </motion.button>

                                <AnimatePresence>
                                    {isQuickOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-64 bg-[#0d1018]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden z-50"
                                        >
                                            <div className="px-5 py-3 border-b border-white/8">
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                    Aktivitas Saya
                                                </p>
                                            </div>
                                            <div className="p-1.5 space-y-0.5">
                                                {quickItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsQuickOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-all group cursor-pointer">
                                                            <div className="w-9 h-9 bg-white/7 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/14 transition-all">
                                                                <item.icon size={16} className="text-white/60 group-hover:text-emerald-400 transition-colors" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-white leading-tight">
                                                                    {item.label}
                                                                </p>
                                                                <p className="text-[11px] text-white/38 mt-0.5">
                                                                    {item.desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bell notifikasi */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Notifikasi"
                                className={`
                                    relative p-2 rounded-xl transition-all
                                    ${isScrolled
                                        ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'}
                                `}
                            >
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </motion.button>

                            {/* Profile button */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsProfileOpen(v => !v)}
                                    className="flex items-center gap-2 pl-2 pr-2 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/18 transition-all duration-300"
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-7 h-7 rounded-full ring-2 ring-emerald-400/50 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                                            <span className="text-white font-bold text-[10px]">
                                                {userInitial}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-[#0c0f1a]" />
                                    </div>

                                    {/* Nama */}
                                    <div className="hidden sm:flex flex-col text-left pr-0.5">
                                        <span className="text-[11px] font-semibold text-white leading-tight">
                                            {userName}
                                        </span>
                                        <span className="text-[9px] font-medium text-emerald-400">
                                            Siswa
                                        </span>
                                    </div>

                                    <ChevronDown
                                        size={12}
                                        className={`text-white/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </motion.button>

                                {/* Dropdown profile */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                                            className="absolute right-0 mt-2 w-60 bg-[#0d1018]/97 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
                                        >
                                            {/* Header gradien */}
                                            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white shrink-0">
                                                        {userInitial}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm text-white leading-tight truncate">
                                                            {userName}
                                                        </p>
                                                        <p className="text-[10px] text-emerald-100 mt-0.5 truncate">
                                                            {userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu items */}
                                            <div className="p-2 space-y-0.5">
                                                {[
                                                    { href: '/profile', icon: User, label: 'Profil Saya' },
                                                    { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                                ].map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/8 transition-all cursor-pointer">
                                                            <item.icon size={14} className="text-emerald-400 shrink-0" />
                                                            {item.label}
                                                        </div>
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-white/10 mx-1 my-1" />
                                                <button
                                                    onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                                                >
                                                    <LogOut size={14} className="shrink-0" />
                                                    Keluar
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Hamburger mobile */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileOpen(v => !v)}
                                aria-label="Buka menu"
                                className="lg:hidden p-2 rounded-xl text-white/70 hover:bg-white/10 transition-all"
                            >
                                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile menu ──────────────────────────────── */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="lg:hidden bg-black/75 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
                                {navItems.map((item, i) => {
                                    const active = pathname === item.href
                                        || pathname.startsWith(item.href + '/');
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-xl
                                                    text-sm font-medium transition-all
                                                    ${active
                                                        ? 'bg-emerald-500/15 text-emerald-400'
                                                        : 'text-white/70 hover:bg-white/8 hover:text-white'}
                                                `}
                                            >
                                                <item.icon size={16} />
                                                <span>{item.name}</span>
                                                {active && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <div className="pt-2 mt-1 border-t border-white/10 space-y-0.5">
                                    {[
                                        { href: '/profile', icon: User, label: 'Profil Saya' },
                                        { href: '/settings', icon: Settings, label: 'Pengaturan' },
                                    ].map((item) => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/65 hover:bg-white/8 transition-all">
                                                <item.icon size={16} /> {item.label}
                                            </div>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => { setIsMobileOpen(false); handleLogout(); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut size={16} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Backdrop — tutup dropdown saat klik di luar */}
            {(isProfileOpen || isQuickOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => { setIsProfileOpen(false); setIsQuickOpen(false); }}
                />
            )}
        </>
    );
}