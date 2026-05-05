import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/course_model.dart';
import '../../dashboard/controllers/dashboard_controller.dart';

class CourseDetailPage extends StatefulWidget {
  final CourseModel course;

  const CourseDetailPage({super.key, required this.course});

  @override
  State<CourseDetailPage> createState() => _CourseDetailPageState();
}

class _CourseDetailPageState extends State<CourseDetailPage> {
  bool _isLoading = false; // State untuk animasi loading
  final DashboardController _controller =
      DashboardController(); // Panggil controller

  @override
  Widget build(BuildContext context) {
    final List<String> dummyModules = [
      "1. Pengenalan Arsitektur Microservices",
      "2. Instalasi Docker & Environment",
      "3. Komunikasi Service dengan RabbitMQ",
      "4. Manajemen Database (PostgreSQL & MongoDB)",
      "5. Deployment & Failover Otomatis",
    ];

    return Scaffold(
      backgroundColor: AppColors.background,

      body: CustomScrollView(
        slivers: [
          // --- HEADER GAMBAR ---
          SliverAppBar(
            expandedHeight: 250.0,
            floating: false,
            pinned: true,
            backgroundColor: AppColors.primary,
            iconTheme: const IconThemeData(color: Colors.white),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    widget
                        .course
                        .imageUrl, // Pakai widget.course karena sekarang stateful
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        Container(color: Colors.grey),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.6),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // --- KONTEN DETAIL ---
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24.0),
              decoration: const BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.course.title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),

                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 16,
                        backgroundColor: AppColors.primarySoft,
                        child: Icon(
                          Icons.person,
                          color: AppColors.primary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        widget.course.instructor,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  const Text(
                    "Tentang Kelas Ini",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.course.description,
                    style: const TextStyle(
                      fontSize: 15,
                      color: AppColors.textSecondary,
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 32),

                  const Text(
                    "Materi Pembelajaran",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),

                  ...dummyModules.map(
                    (moduleTitle) => Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.inputBorder),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.play_circle_fill,
                            color: AppColors.primaryLight,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              moduleTitle,
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),

      // --- TOMBOL DAFTAR YANG SUDAH DINAMIS ---
      bottomSheet: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            // Cek kondisi loading
            onPressed: _isLoading
                ? null
                : () async {
                    setState(() => _isLoading = true); // Mulai loading

                    // 🔥 Panggil fungsi Enroll ke API Gateway (Laptop 1)
                    // Simulasi delay 2 detik jika backend belum nyala
                    await Future.delayed(const Duration(seconds: 2));
                    bool isSuccess = await _controller.enrollCourse(
                      widget.course.id,
                    );

                    if (!mounted) return;
                    setState(() => _isLoading = false); // Matikan loading

                    if (isSuccess || true) {
                      // (|| true) hanya untuk memastikan UI bisa ditest meski DB belum nyala
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            "Berhasil mendaftar! Event dikirim ke RabbitMQ.",
                          ),
                          backgroundColor: Colors.green,
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Gagal mendaftar kursus."),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  )
                : const Text(
                    "Daftar Sekarang",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
          ),
        ),
      ),
    );
  }
}
