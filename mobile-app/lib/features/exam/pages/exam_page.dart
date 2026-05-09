import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class ExamPage extends StatelessWidget {
  const ExamPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.all(24.0),
            child: Text(
              "Jadwal Ujian",
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
                _examListItem(
                  "Ujian Akhir Microservices",
                  "15 Menit",
                  "10 Soal",
                  true,
                ),
                const SizedBox(height: 16),
                _examListItem(
                  "Kuis Docker & Container",
                  "10 Menit",
                  "5 Soal",
                  false,
                ),
                const SizedBox(height: 16),
                _examListItem(
                  "Evaluasi API Gateway",
                  "20 Menit",
                  "15 Soal",
                  false,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _examListItem(
    String title,
    String duration,
    String questions,
    bool isActive,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive ? AppColors.primary : Colors.transparent,
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              if (isActive)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    "Tersedia",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.timer_outlined, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text(
                duration,
                style: const TextStyle(fontSize: 13, color: Colors.grey),
              ),
              const SizedBox(width: 16),
              const Icon(
                Icons.help_outline_rounded,
                size: 16,
                color: Colors.grey,
              ),
              const SizedBox(width: 4),
              Text(
                questions,
                style: const TextStyle(fontSize: 13, color: Colors.grey),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: isActive ? () {} : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: isActive
                    ? AppColors.primary
                    : Colors.grey.shade300,
                foregroundColor: isActive ? Colors.white : Colors.grey.shade600,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                isActive ? "Mulai Ujian" : "Sudah Dikerjakan",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
