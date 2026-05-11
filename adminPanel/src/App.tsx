import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";

// Import halaman-halaman Admin Panel
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/courses";
import Users from "./pages/users";
import Quiz from "./pages/quiz";
import Notifications from "./pages/notifiications";

// --- DUMMY LANDING PAGE (Sangat sederhana) ---
// Nanti ini bisa kamu buatkan file terpisah (misal: src/pages/LandingPage.tsx)
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-emerald-50">
    <h1 className="text-4xl font-black text-[#008A5E] mb-4">EduLearn.AI</h1>
    <p className="text-gray-600 mb-8 font-medium">Platform Pembelajaran Berbasis Microservices</p>
    <a
      href="/login"
      className="bg-[#008A5E] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all"
    >
      Masuk sebagai Admin
    </a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 1. RUTE PUBLIK */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. RUTE LOGIN KHUSUS ADMIN */}
        <Route path="/login" element={<Login />} />

        {/* 3. RUTE ADMIN PANEL (Dibungkus Layout) */}
        <Route element={<DashboardLayout />}>

          {/* Default redirect jika seseorang mengetik /admin di URL */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/users" element={<Users />} />
          <Route path="/exams" element={<Quiz />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<div className="p-8">Halaman Pengaturan</div>} />
        </Route>

        {/* 4. RUTE FALLBACK (404 Not Found) */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-6xl font-black text-gray-300">404</h1>
            <p className="text-gray-500 mt-2 font-medium">Halaman tidak ditemukan.</p>
            <a href="/" className="mt-4 text-[#008A5E] font-bold hover:underline">Kembali ke Beranda</a>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;