'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import API from '@/lib/api';
import {
    Mail, Lock, Loader2, ArrowRight, BookOpen,
    Eye, EyeOff, Sparkles, GraduationCap, Trophy, Users,
    CheckCircle2, Star,
} from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Kirim request ke Laptop 1 (Gateway)
            const res = await API.post('/auth/login', { email, password });

            // Asumsi respon backend: { data: { token: '...', user: { name: '...', role: '...' } } }
            // Sesuaikan dengan format JSON asli dari temanmu di Laptop 1
            const { token, user } = res.data.data;

            // 2. Simpan ke Cookies (untuk kebutuhan Server Side / Middleware)
            Cookies.set('token', token, { expires: 1 });
            Cookies.set('role', user.role, { expires: 1 });
            Cookies.set('name', user.name, { expires: 1 });

            // 3. Simpan ke LocalStorage (untuk kebutuhan Client Side)
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('name', user.name);
            localStorage.setItem('email', email);

            alert("Login Berhasil!");

            // 4. Redirect berdasarkan Role
            if (user.role === 'admin') {
                // Jika admin nyasar ke sini, arahkan ke portal admin (opsional)
                setError('Silakan gunakan portal Admin untuk masuk.');
            } else {
                router.push('/courses'); // Siswa diarahkan ke Katalog Kursus
            }

        } catch (err: any) {
            console.error("Login Error:", err);

            // Tampilkan pesan error dari backend jika ada
            const serverMessage = err.response?.data?.message;
            setError(serverMessage || 'Gagal terhubung ke server. Pastikan Laptop 1 aktif.');

            // --- Demo fallback (HAPUS BAGIAN INI JIKA SUDAH FIX KONEK KE LAPTOP 1) ---
            if (email === 'student@edu.ai' && password === 'student123') {
                Cookies.set('token', 'dummy');
                router.push('/courses');
                return;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { icon: GraduationCap, value: '240+', label: 'Kursus Aktif' },
        { icon: Users, value: '12K+', label: 'Siswa Terdaftar' },
        { icon: Trophy, value: '8K+', label: 'Sertifikat Diterbitkan' },
    ];

    const features = [
        'Akses seumur hidup ke semua kursus',
        'Sertifikat resmi yang diakui industri',
        'Belajar dari instruktur berpengalaman',
        'Ujian & kuis interaktif terstruktur',
    ];

    return (
        /*
          Root: h-screen overflow-hidden — fullscreen, tidak ada scroll,
          tidak ada elemen lain (navbar tidak muncul karena ini
          page auth yang berdiri sendiri)
        */
        <div className="h-screen w-screen overflow-hidden flex">

            {/* ══════════════════════════════════════════════════════
                PANEL KIRI — Branding & Visual
                55% lebar desktop, tersembunyi di mobile
            ══════════════════════════════════════════════════════ */}
            <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative flex-col justify-between overflow-hidden bg-[#0a1628]">

                {/* ── Layer dekorasi ── */}
                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-[#0a1628] to-teal-900/40" />

                {/* Ambient glows */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[100px]" />
                    <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-emerald-400/8 blur-[80px]" />
                </div>

                {/* Grid dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Diagonal accent line */}
                <div className="pointer-events-none absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />

                {/* ── Konten ── */}
                <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                            <BookOpen size={20} className="text-emerald-400" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">
                            Edu<span className="text-emerald-400">Learn</span>
                        </span>
                    </div>

                    {/* Hero text + stats + features */}
                    <div className="space-y-10">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 w-fit">
                            <Sparkles size={12} className="text-emerald-400" />
                            <span className="text-[11px] font-bold text-emerald-300 tracking-widest uppercase">
                                Platform E-Learning #1
                            </span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-3">
                            <h1 className="text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight text-white">
                                Belajar Tanpa
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                    Batas Waktu
                                </span>
                            </h1>
                            <p className="text-white/50 text-base font-medium leading-relaxed max-w-sm">
                                Ratusan kursus premium, ujian terstruktur, dan sertifikasi
                                resmi — semua dalam satu platform modern.
                            </p>
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/8 transition-colors"
                                >
                                    <s.icon size={16} className="text-emerald-400 mb-3" />
                                    <p className="text-2xl font-black text-white">{s.value}</p>
                                    <p className="text-[11px] text-white/40 font-medium mt-0.5 leading-tight">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Feature list */}
                        <div className="space-y-2.5">
                            {features.map((f) => (
                                <div key={f} className="flex items-center gap-3">
                                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                    <span className="text-sm font-medium text-white/60">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-4">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <p className="text-white/70 text-sm font-medium leading-relaxed italic">
                            &ldquo;EduLearn membantu saya menyelesaikan kursus Data Science dalam 3 bulan.
                            Sertifikatnya langsung diakui perusahaan tempat saya melamar.&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                A
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold">Andi Pratama</p>
                                <p className="text-white/35 text-[10px]">Data Analyst · Lulusan 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                PANEL KANAN — Form Login
                45% lebar desktop, fullscreen di mobile
            ══════════════════════════════════════════════════════ */}
            <div className="flex-1 lg:w-[45%] xl:w-[42%] flex flex-col bg-white relative overflow-y-auto">

                {/* Top accent gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400 z-10" />

                {/* Subtle background pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Form area — centered vertically */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 sm:px-12 py-12">
                    <div className="w-full max-w-[380px] space-y-6">

                        {/* Logo mobile only */}
                        <div className="flex items-center gap-2 mb-2 lg:hidden">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <BookOpen size={17} className="text-white" />
                            </div>
                            <span className="text-xl font-black text-slate-800">
                                Edu<span className="text-emerald-500">Learn</span>
                            </span>
                        </div>

                        {/* Header */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="h-px flex-1 bg-slate-100" />
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2">
                                    Student Portal
                                </span>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>
                            <h2 className="text-[28px] font-black text-slate-900 leading-tight tracking-tight">
                                Selamat datang
                                <span className="ml-2">👋</span>
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
                                Masuk untuk melanjutkan perjalanan belajarmu.
                            </p>
                        </div>

                        {/* Demo credential hint */}
                        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                            <Sparkles size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                    Demo Akses
                                </p>
                                <p className="text-[12px] text-slate-500 mt-0.5">
                                    <span className="text-slate-700 font-semibold">student@edu.ai</span>
                                    {' / '}
                                    <span className="text-slate-700 font-semibold">student123</span>
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">

                            {/* Error message */}
                            {error && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    <p className="text-sm text-red-500 font-medium">{error}</p>
                                </div>
                            )}

                            {/* Email field */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <Mail
                                        size={15}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors duration-200"
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="student@edu.ai"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white hover:border-slate-300 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Kata Sandi
                                </label>
                                <div className="relative group">
                                    <Lock
                                        size={15}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors duration-200"
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white hover:border-slate-300 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                        aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot password */}
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-[12px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                                >
                                    Lupa kata sandi?
                                </Link>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] overflow-hidden group"
                            >
                                {/* Shimmer hover effect */}
                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Masuk Akun
                                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[11px] text-slate-300 font-medium px-1">atau</span>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>

                        {/* Register link */}
                        <p className="text-center text-sm font-medium text-slate-400">
                            Siswa baru?{' '}
                            <Link
                                href="/register"
                                className="text-emerald-500 font-bold hover:text-emerald-600 transition-colors"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 px-8 pb-6 text-center">
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        Dengan masuk, kamu menyetujui{' '}
                        <Link href="/terms" className="hover:text-slate-500 transition-colors">
                            Syarat &amp; Ketentuan
                        </Link>
                        {' '}dan{' '}
                        <Link href="/privacy" className="hover:text-slate-500 transition-colors">
                            Kebijakan Privasi
                        </Link>{' '}
                        EduLearn.
                    </p>
                </div>
            </div>
        </div>
    );
}