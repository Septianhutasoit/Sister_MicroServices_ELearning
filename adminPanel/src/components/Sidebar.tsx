import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, BookOpen,
    FileText, BellRing, Settings, LogOut
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();

    // Mapping ke Microservices Backend
    const menus = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Data Siswa", path: "/users", icon: Users },         // Auth & User Service
        { name: "Manajemen Kursus", path: "/courses", icon: BookOpen }, // Course Service
        { name: "Data Ujian", path: "/exams", icon: FileText },         // Exam Service
        { name: "Notifikasi", path: "/notifications", icon: BellRing }, // RabbitMQ / Notification
        { name: "Pengaturan", path: "/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">

            {/* LOGO */}
            <div className="h-20 flex items-center px-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="bg-[#008A5E] text-white p-2 rounded-lg font-bold text-xl leading-none">E</div>
                    <span className="text-xl font-bold text-gray-800">E-Learning<span className="text-[#008A5E]">.AI</span></span>
                </div>
            </div>

            {/* INFO BADGE */}
            <div className="p-5">
                <div className="bg-[#EAF5F1] p-3.5 rounded-xl border border-[#BCE3D5]">
                    <p className="text-[11px] font-bold text-[#008A5E] tracking-wide">IT DEL MICROSERVICES</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Admin System Panel</p>
                </div>
            </div>

            {/* MENU NAVIGATION */}
            <div className="flex-1 px-4 py-2 overflow-y-auto">
                <p className="text-[11px] font-bold text-gray-400 mb-3 px-2 tracking-wider">MENU UTAMA</p>
                <nav className="space-y-1.5">
                    {menus.map((menu) => {
                        const isActive = location.pathname.includes(menu.path);
                        const Icon = menu.icon;
                        return (
                            <Link
                                key={menu.name}
                                to={menu.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-[#008A5E] text-white shadow-md shadow-green-200/50"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-[#008A5E]"
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`${isActive ? "font-semibold" : "font-medium"} text-sm`}>{menu.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* LOGOUT BUTTON */}
            <div className="p-5 border-t border-gray-50">
                <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 w-full rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}