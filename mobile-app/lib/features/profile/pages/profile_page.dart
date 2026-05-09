import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 32),
            const CircleAvatar(
              radius: 50,
              backgroundColor: AppColors.primarySoft,
              child: Icon(Icons.person, size: 50, color: AppColors.primary),
            ),
            const SizedBox(height: 16),
            const Text(
              "Budi Mahasiswa",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              "budi@mahasiswa.edu.ai",
              style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 32),

            // Statistik
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  _statBox("Kursus", "4"),
                  const SizedBox(width: 16),
                  _statBox("Lulus", "2"),
                  const SizedBox(width: 16),
                  _statBox("Sertifikat", "1"),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Menu Profil
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _profileMenuItem(Icons.person_outline, "Edit Profil"),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _profileMenuItem(Icons.security, "Keamanan & Sandi"),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _profileMenuItem(Icons.help_outline_rounded, "Pusat Bantuan"),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.logout, color: Colors.red),
                    ),
                    title: const Text(
                      "Keluar",
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Colors.red,
                      ),
                    ),
                    onTap: () {
                      // Nanti fungsi logout panggil AuthController disini
                      Navigator.pop(context); // Kembali ke Login
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _statBox(String title, String count) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Text(
              count,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _profileMenuItem(IconData icon, String title) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primarySoft.withOpacity(0.5),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppColors.primary),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
      ),
      trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
      onTap: () {},
    );
  }
}
