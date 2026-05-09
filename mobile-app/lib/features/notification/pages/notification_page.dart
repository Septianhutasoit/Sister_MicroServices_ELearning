import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class NotificationPage extends StatelessWidget {
  const NotificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.all(24.0),
            child: Text(
              "Notifikasi",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              children: [
                _notificationItem(
                  Icons.check_circle_rounded,
                  "Pendaftaran Berhasil!",
                  "Anda telah terdaftar di kursus Node.js & Microservices.",
                  "Baru saja",
                  true,
                ),
                _notificationItem(
                  Icons.assignment_rounded,
                  "Ujian Tersedia",
                  "Ujian Akhir Microservices sudah bisa dikerjakan sekarang.",
                  "2 Jam yang lalu",
                  true,
                ),
                _notificationItem(
                  Icons.workspace_premium_rounded,
                  "Sertifikat Terbit",
                  "Selamat! Anda lulus kursus UI/UX Design.",
                  "Kemarin",
                  false,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _notificationItem(
    IconData icon,
    String title,
    String desc,
    String time,
    bool isUnread,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? AppColors.primarySoft.withOpacity(0.3) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundColor: isUnread
                ? AppColors.primary
                : Colors.grey.shade200,
            child: Icon(
              icon,
              color: isUnread ? Colors.white : Colors.grey.shade600,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: isUnread ? FontWeight.bold : FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade500,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
