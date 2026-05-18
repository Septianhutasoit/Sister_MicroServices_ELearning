'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import API from "../../lib/api";
import { Mail, Lock, Loader2, ArrowRight, BookOpen, Eye, EyeOff, Sparkles, GraduationCap, Trophy, Users } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await API.post("/auth/login", { email, password });
            Cookies.set("token", res.data.token, { expires: 1 });
            Cookies.set("role", res.data.role || "student", { expires: 1 });
            Cookies.set("name", res.data.name || "Student", { expires: 1 });
            router.push("/courses");
        } catch (error: any) {
            if (email === "student@edu.ai" && password === "student123") {
                Cookies.set("token", "dummy_student_token");
                Cookies.set("role", "student");
                Cookies.set("name", "Student Demo");
                router.push("/courses");
                return;
            }
            setError(error.response?.data?.message || "Email atau kata sandi salah.");
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { icon: GraduationCap, label: "Kursus Aktif", value: "240+" },
        { icon: Users, label: "Siswa Terdaftar", value: "12K+" },
        { icon: Trophy, label: "Sertifikat Diterbitkan", value: "8K+" },
    ];

    return (
        <div className="min-h-screen flex bg-[#0c0f1a]">

            {/* ══════════════════════════════════════════
                PANEL KIRI — Branding & Visual
            ══════════════════════════════════════════ */}
            <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col justify-between p-12 overflow-hidden">

                {/* Background ambient glows */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-600/15 blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-900/20 blur-[80px]" />
                </div>

                {/* Decorative grid pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                    }}
                />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <BookOpen size={20} className="text-emerald-400" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-white">
                        Edu<span className="text-emerald-400">Learn</span>
                    </span>
                </div>

                {/* Hero teks tengah */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Sparkles size={13} className="text-emerald-400" />
                            <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                                Platform E-Learning #1
                            </span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-white">
                            Belajar Tanpa
                            <br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(135deg, #34d399, #14b8a6)' }}>
                                Batas Waktu
                            </span>
                        </h1>

                        <p className="text-white/50 text-lg font-medium leading-relaxed max-w-md">
                            Ratusan kursus premium, ujian terstruktur, dan sertifikasi resmi — semua dalam satu platform.
                        </p>
                    </div>

                    {/* Stats cards */}
                    <div className="flex gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex-1 bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm"
                            >
                                <stat.icon size={18} className="text-emerald-400 mb-2" />
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                                <p className="text-[11px] text-white/40 font-medium mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/5 border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
                        <p className="text-white/70 text-sm font-medium leading-relaxed italic">
                            &ldquo;EduLearn membantu saya menyelesaikan kursus Data Science dalam 3 bulan. Sertifikatnya langsung diakui perusahaan tempat saya melamar.&rdquo;
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                                A
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold">Andi Pratama</p>
                                <p className="text-white/40 text-[10px]">Data Analyst · Lulusan 2024</p>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom copyright */}
                <div className="relative z-10">
                    <p className="text-white/20 text-[11px] font-medium">
                        © 2025 EduLearn. All rights reserved.
                    </p>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                PANEL KANAN — Form Login
            ══════════════════════════════════════════ */}
            <div className="flex-1 lg:w-[45%] xl:w-[40%] flex items-center justify-center p-6 sm:p-10 relative">

                {/* Subtle right panel bg */}
                <div className="pointer-events-none absolute inset-0 bg-white/[0.02] border-l border-white/5" />

                <div className="relative z-10 w-full max-w-md space-y-8">

                    {/* Header form */}
                    <div className="space-y-2">
                        {/* Logo mobile only */}
                        <div className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <BookOpen size={16} className="text-emerald-400" />
                            </div>
                            <span className="text-lg font-black text-white">
                                Edu<span className="text-emerald-400">Learn</span>
                            </span>
                        </div>

                        <h2 className="text-3xl font-black text-white leading-tight">
                            Selamat datang
                            <span className="text-emerald-400"> 👋</span>
                        </h2>
                        <p className="text-white/40 text-sm font-medium">
                            Masuk untuk melanjutkan perjalanan belajarmu.
                        </p>
                    </div>

                    {/* Demo credential hint */}
                    <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-3.5">
                        <Sparkles size={15} className="text-emerald-400 shrink-0" />
                        <div>
                            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Demo Akses</p>
                            <p className="text-[12px] text-white/50 mt-0.5">
                                <span className="text-white/70">student@edu.ai</span>
                                {" / "}
                                <span className="text-white/70">student123</span>
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Error state */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Email field */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                Alamat Email
                            </label>
                            <div className="relative group">
                                <Mail
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-emerald-400 transition-colors"
                                />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@edu.ai"
                                    className="
                                        w-full pl-11 pr-4 py-3.5
                                        bg-white/5 border border-white/10
                                        rounded-xl text-sm font-medium text-white
                                        placeholder:text-white/20
                                        focus:outline-none focus:border-emerald-500/50 focus:bg-white/8
                                        hover:border-white/20
                                        transition-all duration-200
                                    "
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                Kata Sandi
                            </label>
                            <div className="relative group">
                                <Lock
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-emerald-400 transition-colors"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="
                                        w-full pl-11 pr-12 py-3.5
                                        bg-white/5 border border-white/10
                                        rounded-xl text-sm font-medium text-white
                                        placeholder:text-white/20
                                        focus:outline-none focus:border-emerald-500/50 focus:bg-white/8
                                        hover:border-white/20
                                        transition-all duration-200
                                    "
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Lupa password */}
                        <div className="flex justify-end">
                            <Link
                                href="#"
                                className="text-[12px] font-bold text-emerald-400/70 hover:text-emerald-400 transition-colors"
                            >
                                Lupa kata sandi?
                            </Link>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="
                                relative w-full flex items-center justify-center gap-2.5
                                bg-emerald-500 hover:bg-emerald-400
                                text-white font-bold text-sm
                                py-4 rounded-xl
                                transition-all duration-200
                                disabled:opacity-60 disabled:cursor-not-allowed
                                active:scale-[0.99]
                                overflow-hidden group
                            "
                        >
                            {/* Shimmer effect on hover */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Masuk Akun
                                    <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-[11px] text-white/25 font-medium">atau</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    {/* Daftar link */}
                    <p className="text-center text-sm font-medium text-white/40">
                        Siswa baru?{" "}
                        <Link
                            href="/register"
                            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                        >
                            Daftar sekarang
                        </Link>
                    </p>

                    {/* Footer note */}
                    <p className="text-center text-[11px] text-white/20 font-medium leading-relaxed">
                        Dengan masuk, kamu menyetujui{" "}
                        <Link href="/terms" className="hover:text-white/40 transition-colors">Syarat &amp; Ketentuan</Link>
                        {" "}dan{" "}
                        <Link href="/privacy" className="hover:text-white/40 transition-colors">Kebijakan Privasi</Link>
                        {" "}EduLearn.
                    </p>
                </div>
            </div>
        </div>
    );
}