import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0; 

  final List<Widget> _pages = [
    const Center(
      child: Text(
        "Halaman Home (Daftar Course)",
        style: TextStyle(fontSize: 20),
      ),
    ),
    const Center(
      child: Text("Halaman Ujian (Exam)", style: TextStyle(fontSize: 20)),
    ),
    const Center(
      child: Text("Halaman Notifikasi", style: TextStyle(fontSize: 20)),
    ),
    const Center(child: Text("Profil Saya", style: TextStyle(fontSize: 20))),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      // HEADER (APP BAR)
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text(
          "E-Learning",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () {
              // Fungsi Logout sementara, kembali ke halaman login
              Navigator.pop(context);
            },
          ),
        ],
      ),

      body: _pages[_selectedIndex],

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index; 
          });
        },
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
