'use client';
import { motion } from 'framer-motion';
import { Search, Star, Users } from 'lucide-react';

const DUMMY_COURSES = [
    { id: 1, title: 'Mastering Docker & Microservices', instructor: 'Budi S.', rating: 4.8, students: 1240, img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format&fit=crop' },
    { id: 2, title: 'UI/UX Design Masterclass', instructor: 'Sarah J.', rating: 4.9, students: 3420, img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop' },
    { id: 3, title: 'Backend Node.js Advanced', instructor: 'Alex W.', rating: 4.7, students: 890, img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop' },
];

export default function CoursesPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Katalog Kursus</h1>
                    <p className="text-slate-500 font-medium">Temukan skill baru dan tingkatkan karirmu.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Cari kursus..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DUMMY_COURSES.map((course) => (
                    <div key={course.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <div className="h-48 overflow-hidden relative">
                            <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1"><Star size={12} fill="currentColor" /> {course.rating}</span>
                                <span className="text-slate-400 text-xs font-semibold flex items-center gap-1"><Users size={12} /> {course.students}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 leading-snug mb-1 group-hover:text-emerald-600 transition-colors">{course.title}</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6">Oleh {course.instructor}</p>
                            <button className="w-full py-2.5 bg-slate-50 text-emerald-600 font-bold rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">Daftar Sekarang</button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}