'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, LogOut, Loader2, Key, Settings, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import API from '@/lib/api';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    joinedDate: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Tembak Endpoint Auth Service di Laptop 1 untuk memvalidasi JWT Token
                const res = await API.get('/auth/me');
                setUser(res.data.data);
            } catch (error) {
                console.warn("Gagal fetch profile, menggunakan Dummy Data", error);
                // Fallback Dummy Data jika backend belum nyala
                setUser({
                    id: "STU-2025-0891",
                    name: "Budi Mahasiswa",
                    email: "student@edu.ai",
                    role: "Student",
                    joinedDate: "15 Mei 2025"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        if (confirm('Yakin ingin keluar dari portal?')) {
            localStorage.clear();
            Cookies.remove('token');
            router.push('/login');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Profil Saya</h1>
                <p className="text-slate-500 font-medium text-base">Kelola informasi pribadi dan pengaturan akun Anda.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-bold text-slate-500">Memuat profil...</p>
                </div>
            ) : user ? (
                <div className="space-y-6">
                    {/* --- KARTU PROFIL UTAMA --- */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative">
                        {/* Banner Background */}
                        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 w-full relative">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                        </div>

                        <div className="px-8 pb-8">
                            {/* Avatar menonjol ke atas */}
                            <div className="relative flex justify-between items-end -mt-12 mb-6">
                                <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
                                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-3xl font-black text-emerald-600">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-200 uppercase tracking-wider mb-2">
                                    {user.role}
                                </span>
                            </div>

                            {/* Info User */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-800 leading-none">{user.name}</h2>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2">
                                    <div className="flex items-center gap-2.5 text-slate-500 font-medium text-sm">
                                        <Mail size={18} className="text-emerald-500" /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-slate-500 font-medium text-sm">
                                        <Shield size={18} className="text-emerald-500" /> ID: {user.id}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-slate-500 font-medium text-sm">
                                        <Calendar size={18} className="text-emerald-500" /> Bergabung: {user.joinedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- KARTU PENGATURAN --- */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 sm:p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Keamanan & Sistem</h3>

                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                        <Key size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-700 text-sm">Ubah Kata Sandi</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">Perbarui kredensial login Anda</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                                        <Settings size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-700 text-sm">Preferensi Aplikasi</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">Atur tema dan notifikasi</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </button>

                            <div className="h-px bg-slate-100 my-2 mx-4"></div>

                            <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                        <LogOut size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-red-600 text-sm">Keluar dari Portal</p>
                                        <p className="text-xs text-red-400 font-medium mt-0.5">Hapus sesi token JWT Anda</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

        </motion.div>
    );
}