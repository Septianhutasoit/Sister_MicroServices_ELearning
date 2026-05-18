'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import API from "@/lib/api"; // Memanggil file Axios yang kamu buat tadi
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Tembak API Gateway (Laptop 1) Endpoint Login
            const res = await API.post("/auth/login", { email, password });

            // 2. Simpan token JWT ke Cookies (Lebih aman untuk Next.js)
            Cookies.set("token", res.data.token, { expires: 1 }); // Berlaku 1 hari

            alert("Login Sukses!");

            // 3. Arahkan siswa ke halaman Katalog Kursus / Dashboard Siswa
            router.push("/courses");

        } catch (error: any) {
            // Bypass untuk keperluan testing (Jika backend belum jalan)
            if (email === "student@edu.ai" && password === "student123") {
                Cookies.set("token", "dummy_student_token");
                router.push("/courses");
                return;
            }

            alert(error.response?.data?.message || "Login gagal. Periksa koneksi ke Backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-slate-800 mb-2">Selamat Datang 👋</h1>
                    <p className="text-sm font-medium text-slate-500">Masuk untuk melanjutkan pembelajaranmu.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Alamat Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="student@edu.ai"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Kata Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Link href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Lupa kata sandi?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>Masuk Akun <ArrowRight size={18} /></>
                        )}
                    </button>

                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        Siswa baru? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Daftar sekarang</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}