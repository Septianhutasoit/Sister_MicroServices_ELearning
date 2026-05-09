import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/api_config.dart';
import '../../auth/controllers/auth_controller.dart';

class ExamController {
  // 1. AMBIL SOAL UJIAN BERDASARKAN COURSE ID
  Future<List<dynamic>> getQuestions(String courseId) async {
    try {
      String? token = await AuthController.getToken();
      final response = await http.get(
        Uri.parse(
          '${ApiConfig.baseUrl}/exams/$courseId',
        ), // Tembak ke Exam Service
        headers: {"Authorization": "Bearer $token"},
      );
      if (response.statusCode == 200) return jsonDecode(response.body)['data'];
      return [];
    } catch (e) {
      return [];
    }
  }

  // 2. SUBMIT JAWABAN UJIAN
  Future<int?> submitExam(String courseId, List<int> answers) async {
    try {
      String? token = await AuthController.getToken();
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/exams/$courseId/submit'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({"answers": answers}),
      );

      if (response.statusCode == 200) {
        // Asumsi backend mengembalikan score: { "data": { "score": 90 } }
        return jsonDecode(response.body)['data']['score'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
