import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/api_config.dart';
import '../../../models/course_model.dart';
import '../../auth/controllers/auth_controller.dart';

class DashboardController {
  Future<List<CourseModel>> fetchCourses() async {
    try {
      String? token = await AuthController.getToken();
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/courses'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseBody = jsonDecode(response.body);
        final List<dynamic> data = responseBody['data'];
        return data.map((json) => CourseModel.fromJson(json)).toList();
      } else {
        throw Exception('Gagal memuat data');
      }
    } catch (e) {
      return _getDummyData();
    }
  }

  Future<bool> enrollCourse(String courseId) async {
    try {
      String? token = await AuthController.getToken();
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/enroll'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({"courseId": courseId}),
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  List<CourseModel> _getDummyData() {
    return [
      CourseModel(
        id: "1",
        title: "Mastering Node.js & Microservices",
        description: "Belajar backend scalable dengan RabbitMQ.",
        instructor: "Kelompok Supabase",
        imageUrl:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      ),
      CourseModel(
        id: "2",
        title: "Flutter for Enterprise",
        description: "Panduan membuat aplikasi mobile lintas platform.",
        instructor: "Budi Santoso",
        imageUrl:
            "https://images.unsplash.com/photo-1617042375876-a13e36732a04?q=80&w=600&auto=format&fit=crop",
      ),
    ];
  }
}
