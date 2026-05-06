import { Search, Settings, BellRing } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();

    // Ambil nama path untuk dijadikan judul halaman
    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
    };

    return (
        <header className="h-20 bg-white flex items-center justify-between px-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-10">

            {/* JUDUL HALAMAN */}
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[#008A5E] rounded-full"></div>
                <h1 className="text-lg font-extrabold text-gray-800 tracking-wide uppercase">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {/* SEARCH BAR */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Global search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:border-[#008A5E] focus:bg-white w-64 transition-all"
                    />
                </div>

                {/* SYNC BUTTON */}
                <button className="flex items-center gap-2 border border-[#008A5E] text-[#008A5E] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#EAF5F1] transition-colors">
                    <Settings size={14} /> SYNC AI
                </button>

                {/* NOTIFICATION BADGE */}
                <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-full transition-colors">
                    <BellRing className="text-gray-600" size={20} />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
                </div>

                {/* ADMIN PROFILE */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#008A5E] to-emerald-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        AD
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-gray-800 leading-tight">Admin Master</p>
                        <p className="text-[10px] text-[#008A5E] font-extrabold tracking-wider mt-0.5">SUPER ADMIN</p>
                    </div>
                </div>
            </div>
        </header>
    );
}