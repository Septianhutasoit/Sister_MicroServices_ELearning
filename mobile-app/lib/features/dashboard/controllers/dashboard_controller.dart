import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/api_config.dart';
import '../../../models/course_model.dart';
import '../../auth/controllers/auth_controller.dart';

class DashboardController {
  // Ambil daftar kursus (dengan token JWT)
  Future<List<CourseModel>> fetchCourses() async {
    try {
      final token = await AuthController.getToken();
      if (token == null) throw Exception('Token tidak ditemukan');

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        final List<dynamic> data = body['data'];
        return data.map((json) => CourseModel.fromJson(json)).toList();
      } else {
        throw Exception('Gagal memuat kursus');
      }
    } catch (e) {
      print('Error fetchCourses: $e');
      // Fallback dummy data agar tetap bisa test UI
      return _getDummyCourses();
    }
  }

  // Enroll ke kursus (POST /api/enroll)
  Future<bool> enrollCourse(String courseId) async {
    try {
      final token = await AuthController.getToken();
      if (token == null) return false;

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/enroll'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'courseId': courseId}),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('Error enrollCourse: $e');
      return false;
    }
  }

  // Dummy data untuk fallback
  List<CourseModel> _getDummyCourses() {
    return [
      CourseModel(
        id: '1',
        title: 'Mastering Node.js & Microservices',
        description: 'Belajar backend scalable dengan RabbitMQ dan Docker.',
        instructor: 'Kelompok Supabase',
        imageUrl: 'https://picsum.photos/200/150?random=1',
      ),
      CourseModel(
        id: '2',
        title: 'Flutter for Enterprise',
        description: 'Panduan lengkap membuat aplikasi mobile lintas platform.',
        instructor: 'Budi Santoso',
        imageUrl: 'https://picsum.photos/200/150?random=2',
      ),
    ];
  }
}
