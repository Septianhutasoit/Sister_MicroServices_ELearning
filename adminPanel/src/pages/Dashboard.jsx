import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard Admin</h1>
            <p>Selamat datang, Anda bisa mengatur aplikasi mobile dari sini.</p>
            <ul>
                <li><Link to="/courses">Kelola Data Course</Link></li>
                {/* Nanti bisa ditambah: */}
                {/* <li><Link to="/users">Kelola User/Siswa</Link></li> */}
                {/* <li><Link to="/exams">Kelola Ujian & Kuis</Link></li> */}
            </ul>
            <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
                Logout
            </button>
        </div>
    );
}