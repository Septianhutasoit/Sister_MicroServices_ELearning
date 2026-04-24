import { useEffect, useState } from "react";
import API from "../services/api";
import { Course } from "../types";

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);

    const fetchCourses = async () => {
        try {
            const res = await API.get<{ data: Course[] }>("/course");
            setCourses(res.data.data);
        } catch (error) {
            console.error("Gagal mengambil data course", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Yakin hapus course ini dari aplikasi Mobile?")) {
            await API.delete(`/course/${id}`);
            fetchCourses(); // Refresh tabel setelah hapus
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Kelola Courses (Aplikasi Mobile)</h2>
            <button style={{ marginBottom: "15px" }}>+ Tambah Course Baru</button>

            <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Judul Course</th>
                        <th>Instruktur</th>
                        <th>Aksi (Admin)</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length === 0 ? (
                        <tr><td colSpan={4}>Belum ada course.</td></tr>
                    ) : (
                        courses.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.title}</td>
                                <td>{c.instructor}</td>
                                <td>
                                    <button>Edit</button>
                                    <button onClick={() => handleDelete(c.id)} style={{ color: "red", marginLeft: "10px" }}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}