'use client';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

export default function MyLearningPage() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Pembelajaran Saya</h1>
            <p className="text-slate-500 font-medium mb-8">Lanjutkan materi yang sedang Anda pelajari.</p>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-center gap-6">
                <img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&auto=format" alt="Course" className="w-full md:w-48 h-32 object-cover rounded-2xl" />
                <div className="flex-1 w-full">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SEDANG BERJALAN</span>
                    <h2 className="text-xl font-bold text-slate-800 mt-1 mb-4">Mastering Docker & Microservices</h2>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-[65%] h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-600">65%</span>
                    </div>
                </div>
                <button className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2">
                    <PlayCircle size={18} /> Lanjutkan
                </button>
            </div>
        </motion.div>
    );
}