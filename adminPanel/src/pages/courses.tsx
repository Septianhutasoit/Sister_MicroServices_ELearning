export default function Courses() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] h-full w-full border border-slate-100">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manajemen Kursus</h1>
            <div className="w-12 h-1 bg-[#008A5E] rounded-full mt-3 mb-6"></div>

            <p className="text-slate-500 font-medium leading-relaxed">
                Di sini Anda dapat mengelola materi kursus, video, dan modul pembelajaran. Data ini terhubung langsung dengan <strong className="text-[#008A5E]">Course Service (MongoDB)</strong>.
            </p>

            {/* Tempat tabel/form nantinya */}
            <div className="mt-8 border-2 border-dashed border-slate-200 rounded-xl h-64 flex items-center justify-center bg-slate-50">
                <p className="text-slate-400 font-semibold">Tabel Kursus Akan Tampil Di Sini</p>
            </div>
        </div>
    );
}