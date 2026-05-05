import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/course_model.dart';
import '../widgets/course_card.dart';
import '../controllers/dashboard_controller.dart';
import '../../course/pages/course_detail_page.dart';

class DashboardMobile extends StatefulWidget {
  const DashboardMobile({super.key});

  @override
  State<DashboardMobile> createState() => _DashboardMobileState();
}

class _DashboardMobileState extends State<DashboardMobile> {
  int _selectedIndex = 0;
  final DashboardController _controller = DashboardController();

  @override
  Widget build(BuildContext context) {
    final Widget homePageContent = FutureBuilder<List<CourseModel>>(
      future: _controller.fetchCourses(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.primary),
          );
        } else if (snapshot.hasError) {
          return Center(child: Text("Gagal mengambil data: ${snapshot.error}"));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text("Belum ada kursus yang tersedia."));
        } else {
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
                      builder: (context) =>
                          CourseDetailPage(course: courses[index]),
                    ),
                  );
                },
              );
            },
          );
        }
      },
    );

    final List<Widget> pages = [
      homePageContent,
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
          "E-Learning",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: pages[_selectedIndex],
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
