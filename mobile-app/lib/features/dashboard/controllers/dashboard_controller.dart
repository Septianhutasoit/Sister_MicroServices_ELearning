import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/api_config.dart';
import '../../../models/course_model.dart';

class DashboardController {

  // Fungsi untuk mengambil data Course dari API Gateway (Microservices)
  Future<List<CourseModel>> fetchCourses() async {
    try {
      // 1. Tembak endpoint Course Service melalui API Gateway
      // Sesuai IP temanmu di api_config.dart
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses'),
      );

      // 2. Jika sukses (Status 200)
      if (response.statusCode == 200) {
        // Parse JSON dari Backend Node.js
        // Asumsi format backend: { "data": [ {...}, {...} ] }
        final Map<String, dynamic> responseBody = jsonDecode(response.body);
        final List<dynamic> data = responseBody['data'];

        // Ubah JSON array menjadi List<CourseModel>
        return data.map((json) => CourseModel.fromJson(json)).toList();
      } else {
        throw Exception('Gagal memuat data dari server');
      }
    } catch (e) {
      print('Error Microservices: $e');
      // JIKA BACKEND BELUM NYALA, KITA KEMBALIKAN DUMMY DATA AGAR UI TETAP BISA DI-TEST
      return _getDummyData();
    }
  }

  List<CourseModel> _getDummyData() {
    return [
      CourseModel(
        id: "1",
        title: "Mastering Node.js & Microservices",
        description:
            "Belajar backend scalable dengan RabbitMQ dan Docker. (Mode Offline/Dummy)",
        instructor: "Kelompok Supabase",
        imageUrl:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      ),
      CourseModel(
        id: "2",
        title: "Flutter for Enterprise",
        description:
            "Panduan lengkap membuat aplikasi mobile lintas platform. (Mode Offline/Dummy)",
        instructor: "Budi Santoso",
        imageUrl:
            "https://images.unsplash.com/photo-1617042375876-a13e36732a04?q=80&w=600&auto=format&fit=crop",
      ),
    ];
  }
}