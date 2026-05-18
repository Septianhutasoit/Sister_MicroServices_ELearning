'use client';

// app/components/ConditionalLayout.tsx
// ─────────────────────────────────────────────────────────────
// Wrapper yang cek pathname:
//   → halaman AUTH (/login, /register, dll) = tanpa navbar & footer
//   → halaman STUDENT (dashboard, courses, dll) = dengan navbar & footer
//
// Tidak perlu pindah folder apapun. Cukup 2 file ini saja.
// ─────────────────────────────────────────────────────────────

import { usePathname } from 'next/navigation';
import StudentNavbar from './StudentNavbar';

// ── Daftar path yang TIDAK perlu navbar ──────────────────────
const AUTH_PATHS = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
];

// ── Footer (dipindah ke sini agar tidak di layout server) ────
function SiteFooter() {
    return (
        <footer className="relative z-10 mt-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            <div className="bg-white/70 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                        {/* Brand */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[13px] font-black tracking-tight text-slate-700">
                                    Edu<span className="text-emerald-500">Learn</span>
                                </span>
                                <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                                    Student Portal
                                </span>
                            </div>
                        </div>

                        {/* Copyright */}
                        <span className="text-[11px] text-slate-400 font-medium">
                            © {new Date().getFullYear()}{' '}
                            <span className="text-emerald-500 font-semibold">EduLearn</span>.
                            Semua hak dilindungi.
                        </span>

                        {/* Links */}
                        <div className="flex items-center gap-4">
                            {[
                                { href: '/privacy', label: 'Kebijakan Privasi' },
                                { href: '/terms', label: 'Syarat & Ketentuan' },
                                { href: '/support', label: 'Bantuan' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-[11px] text-slate-400 font-medium hover:text-emerald-600 transition-colors duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ── Main export ──────────────────────────────────────────────
export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Cek apakah halaman ini termasuk AUTH (login, register, dll)
    const isAuthPage = AUTH_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
    );

    // ── HALAMAN AUTH → bersih total, tanpa navbar & footer ───
    if (isAuthPage) {
        return <>{children}</>;
    }

    // ── HALAMAN STUDENT → dengan navbar, ambient bg, footer ──
    return (
        <div className="bg-[#f8fafb] text-slate-800 min-h-screen flex flex-col">

            {/* Ambient background — fixed, tidak ikut scroll */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-100/60 blur-[120px]" />
                <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-[100px]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-white/80 blur-[80px]" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`,
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            {/* Navbar — hanya muncul di halaman student */}
            <StudentNavbar />

            {/* Konten halaman */}
            <main className="relative z-10 flex-grow pt-[68px]">
                {children}
            </main>

            {/* Footer — hanya muncul di halaman student */}
            <SiteFooter />
        </div>
    );
}