# Panduan Penambahan Materi & Soal Ujian untuk Admin

Panduan operasional terstruktur ini digunakan oleh Admin untuk mengelola penambahan materi dan soal ujian dalam arsitektur microservices terdistribusi.

---

## 🍃 1. Penambahan Materi (MongoDB - LMS Service)

### Cara Kerja:
* Ketika Admin menambahkan materi baru melalui **Admin Panel**, data tersebut akan disimpan langsung di database MongoDB (`lms` database) pada **Laptop 1**.
* Hubungan sinkronisasi antara MongoDB **Laptop 1** dan **Laptop 2** dikonfigurasi menggunakan **Replica Set**.
* Berkat Replica Set ini, semua data materi baru maupun pembaruan progress belajar siswa akan otomatis disinkronkan ke **Laptop 2** secara *real-time* tanpa adanya latensi atau intervensi manual.

### Panduan Operasional:
1. Masuk ke halaman **Admin Panel** (`http://10.206.80.189:8080` atau port admin yang sesuai).
2. Arahkan ke menu **Kelola Kursus / Materi**.
3. Klik tombol **Tambah Kursus Baru** atau **Tambah Bab**.
4. Isi data materi (Judul, Kategori, Bab, Konten, Instruktur) secara lengkap dan klik **Simpan**.
5. **Verifikasi**: Buka Portal Siswa di **Laptop 2** (`http://localhost:3005/courses`), materi baru akan langsung muncul di katalog kursus seketika.

---

## 🐘 2. Penambahan Soal Ujian (PostgreSQL - Exam Service)

### Cara Kerja:
* Ketika Admin membuat ujian atau pertanyaan kuis baru, datanya akan disimpan langsung di database PostgreSQL (`exam_db`) pada **Laptop 1**.
* **Exam Service** yang berjalan di **Laptop 3** dikonfigurasi secara terpusat untuk mengakses database PostgreSQL milik **Laptop 1** melalui variabel lingkungan `DB_HOST` yang mengarah ke IP Laptop 1 (`10.206.80.189`).
* Dengan model database bersama (*shared database*) ini, soal ujian baru langsung dapat diakses dari **Laptop 3** secara instan saat ujian dibuka oleh siswa tanpa memerlukan proses replikasi data database.

### Panduan Operasional:
1. Masuk ke halaman **Admin Panel** dan buka modul **Ujian / Soal Kuis**.
2. Buat ujian baru dengan menentukan durasi, ambang batas kelulusan (passing score minimum 60), serta asosiasi materi/kursus terkait.
3. Tambahkan daftar pertanyaan dan kunci jawaban, kemudian simpan.
4. **Verifikasi**: Buka menu **Ujian Mendatang** atau klik **Buka Portal Ujian** di dashboard portal siswa. Pastikan soal baru berhasil dimuat langsung dari Exam Service Laptop 3.

---

> [!NOTE]
> Pastikan koneksi jaringan antara Laptop 1 (`10.206.80.189`), Laptop 2 (Client), dan Laptop 3 (`10.206.80.79`) selalu berada dalam subnet LAN yang sama agar proses sinkronisasi replikasi dan query database bersama berjalan dengan lancar.
