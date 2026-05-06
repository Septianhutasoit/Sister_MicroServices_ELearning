import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// Pastikan path ke DashboardLayout ini benar sesuai folder kamu!
import DashboardLayout from "./layouts/DashboardLayout";

// Komponen Dummy agar tidak error saat dirender
const DummyPage = ({ title }: { title: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm h-full">
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute untuk halaman Login */}
        <Route path="/" element={<Login />} />

        {/* Rute untuk halaman Admin (Dibungkus oleh Layout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DummyPage title="Halaman Dashboard Utama" />} />
          <Route path="/users" element={<DummyPage title="Tabel Data Siswa" />} />
          <Route path="/courses" element={<DummyPage title="Manajemen Kursus & Materi" />} />
          <Route path="/exams" element={<DummyPage title="Data Ujian & Nilai" />} />
          <Route path="/notifications" element={<DummyPage title="Kirim Notifikasi (RabbitMQ)" />} />
          <Route path="/settings" element={<DummyPage title="Pengaturan Sistem" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;