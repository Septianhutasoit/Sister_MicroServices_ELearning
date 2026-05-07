'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CalendarCheck, Users, UserCog,
    CalendarDays, Brain, Stethoscope, Settings,
    LogOut, Search, Bell, ChevronDown, Menu, X,
    Database, Sparkles
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Reservations', href: '/admin/appointments', icon: CalendarCheck },
    { name: 'Daftar Pasien', href: '/admin/patients', icon: Users },
    { name: 'Manajemen Dokter', href: '/admin/doctors', icon: UserCog },
    { name: 'Manajemen Jadwal', href: '/admin/schedules', icon: CalendarDays },
    { name: 'AI Knowledge', href: '/admin/knowledge', icon: Brain },
    { name: 'Layanan Klinik', href: '/admin/services', icon: Stethoscope },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [logoError, setLogoError] = useState(false);

    const adminName = typeof window !== 'undefined' ? localStorage.getItem('full_name') || 'Admin' : 'Admin';
    const adminEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') || 'admin@klinik.ai' : 'admin@klinik.ai';
    const initials = adminName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        if (!token || role?.toLowerCase() !== 'admin') router.push('/login');
        else setIsAuthorized(true);
    }, [router, pathname]);

    const handleLogout = () => {
        if (confirm('Yakin ingin keluar?')) {
            localStorage.clear();
            Cookies.remove('token', { path: '/' });
            Cookies.remove('role', { path: '/' });
            router.push('/login');
        }
    };

    const activeLabel = navItems.find(n => pathname.startsWith(n.href))?.name || 'Dashboard';

    if (!isAuthorized) return null;

    // ── SIDEBAR CONTENT ──────────────────────────────────────────────────────
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-100">

            {/* Logo */}
            <div className="h-[72px] flex items-center px-5 border-b border-slate-100 flex-shrink-0">
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-[#0A1C14] shadow-md">
                        {!logoError ? (
                            <Image src="/images/logo1.png" alt="Logo" width={36} height={36}
                                className="object-cover w-full h-full"
                                onError={() => setLogoError(true)} />
                        ) : (
                            <span className="text-emerald-400 font-black text-lg">K</span>
                        )}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-base leading-none">
                            Klinik<span className="text-emerald-600">.AI</span>
                        </p>
                    </div>
                </Link>
            </div>

            {/* Clinic Info Badge */}
            <div className="px-4 pt-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                        Nauli Dental Care
                    </p>
                    <p className="text-[11px] text-emerald-500 font-medium mt-0.5">
                        Jl. Balige No. 12, Toba
                    </p>
                </div>
            </div>

            {/* Menu Label */}
            <div className="px-5 pt-5 pb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Admin System
                </p>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <motion.div
                                whileHover={{ x: 2 }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                                <span>{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarActive"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Card */}
            <div className="mx-3 mb-3 mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A1C14] flex items-center justify-center text-emerald-400 font-black text-xs flex-shrink-0">
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{adminName}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">SUPER ADMIN</p>
                </div>
            </div>

            {/* Logout */}
            <div className="px-3 pb-4 border-t border-slate-100 pt-3">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <LogOut size={17} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#EDF5F2] overflow-hidden font-sans">

            {/* ── SIDEBAR DESKTOP ────────────────────────────────────────── */}
            <div className="hidden md:flex flex-col w-[260px] flex-shrink-0 h-full shadow-sm">
                <SidebarContent />
            </div>

            {/* ── SIDEBAR MOBILE (Drawer) ────────────────────────────────── */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 z-50 w-[260px] md:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── MAIN AREA ──────────────────────────────────────────────── */}
            <div className="flex flex-col flex-1 min-w-0 h-full">

                {/* ── HEADER ─────────────────────────────────────────────── */}
                <header className="h-[72px] bg-white border-b border-slate-100 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Page title */}
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <div>
                            <h1 className="font-black text-slate-900 text-base uppercase tracking-tight leading-none">
                                {activeLabel}
                            </h1>
                        </div>
                    </div>

                    <div className="flex-1" />

                    {/* Search */}
                    <div className="hidden sm:flex items-center gap-2 bg-[#F5FAF7] border border-[#D4EDE5] px-4 py-2 rounded-xl">
                        <Search size={15} className="text-emerald-500 flex-shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Global search..."
                            className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-40 font-medium"
                        />
                    </div>

                    {/* Sync AI Button */}
                    <Link href="/admin/knowledge">
                        <button className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">
                            <Database size={14} />
                            Sync AI
                        </button>
                    </Link>

                    {/* Notifikasi */}
                    <button className="relative p-2 rounded-xl bg-[#F5FAF7] border border-[#D4EDE5] text-slate-500 hover:border-emerald-300 transition-all">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 pl-3 border-l border-slate-200"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#0A1C14] flex items-center justify-center text-emerald-400 font-black text-xs shadow-sm">
                                {initials}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-bold text-slate-800 leading-none">Admin</p>
                                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Super Admin</p>
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                                >
                                    {/* Header dropdown */}
                                    <div className="bg-[#0A1C14] px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white leading-tight">{adminName}</p>
                                                <p className="text-[10px] text-emerald-400 mt-0.5">{adminEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1.5 space-y-0.5">
                                        <Link href="/admin/settings" onClick={() => setIsProfileOpen(false)}>
                                            <button className="w-full px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-all">
                                                <Settings size={15} className="text-emerald-500" />
                                                Pengaturan
                                            </button>
                                        </Link>
                                        <div className="h-px bg-slate-100 mx-2" />
                                        <button
                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                            className="w-full px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-all"
                                        >
                                            <LogOut size={15} />
                                            Keluar
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Backdrop dropdown */}
                    {isProfileOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    )}
                </header>

                {/* ── KONTEN ─────────────────────────────────────────────── */}
                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}