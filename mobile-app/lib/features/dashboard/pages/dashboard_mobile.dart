import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/course_model.dart';
import '../widgets/course_card.dart';
import '../controllers/dashboard_controller.dart';
import '../../auth/pages/course_detail_page.dart';

class DashboardMobile extends StatefulWidget {
 const DashboardMobile({super.key});
 
  @override
  _DashboardMobileState createState() => _DashboardMobileState();
}

class _DashboardMobileState extends State<DashboardMobile> {
  int _selectedIndex = 0;
  final DashboardController _controller = DashboardController();

  @override
  Widget build(BuildContext context) {
    // --- KONTEN HALAMAN HOME MENGGUNAKAN FUTURE BUILDER (MICROSERVICES READY) ---
    final Widget homePageContent = FutureBuilder<List<CourseModel>>(
      future: _controller.fetchCourses(), // 👈 Menembak API Gateway
      builder: (context, snapshot) {
        // 1. Jika API sedang loading / sedang ditarik dari laptop temanmu
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.primary),
          );
        }
        // 2. Jika API Error (Backend mati / IP salah)
        else if (snapshot.hasError) {
          return Center(
            child: Text(
              "Gagal mengambil data: ${snapshot.error}",
              textAlign: TextAlign.center,
            ),
          );
        }
        // 3. Jika API kosong (belum ada course di MongoDB)
        else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text("Belum ada kursus yang tersedia."));
        }
        // 4. JIKA API SUKSES MENGEMBALIKAN DATA
        else {
          final courses = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: courses.length,
            itemBuilder: (context, index) {
              return CourseCard(
                course: courses[index],
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CourseDetailPage(course: courses[index]),
                    ),
                  );
                },
              );
            },
          );
        }
      },
    );

    // --- DAFTAR HALAMAN MENU ---
    final List<Widget> pages = [
      homePageContent, // <--- Halaman Home dipanggil di sini
      const Center(
        child: Text("Halaman Ujian (Exam)", style: TextStyle(fontSize: 20)),
      ),
      const Center(
        child: Text("Halaman Notifikasi", style: TextStyle(fontSize: 20)),
      ),
      const Center(child: Text("Profil Saya", style: TextStyle(fontSize: 20))),
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text(
          "E-Learning Mobile",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body:
          pages[_selectedIndex], // Menampilkan halaman sesuai menu yang diklik
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: "Exam"),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: "Notifikasi",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profil"),
        ],
      ),
    );
  }
}
