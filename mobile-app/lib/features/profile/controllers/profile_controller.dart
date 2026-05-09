import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/api_config.dart';
import '../../auth/controllers/auth_controller.dart';

class ProfileController {
  // 1. AMBIL PROFIL USER
  Future<Map<String, dynamic>?> getProfile() async {
    try {
      String? token = await AuthController.getToken();
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/users/me'), // Tembak ke User Service
        headers: {"Authorization": "Bearer $token"},
      );
      if (response.statusCode == 200) return jsonDecode(response.body)['data'];
      return null;
    } catch (e) {
      return null;
    }
  }

  // 2. AMBIL NOTIFIKASI
  Future<List<dynamic>> getNotifications() async {
    try {
      String? token = await AuthController.getToken();
      final response = await http.get(
        Uri.parse(
          '${ApiConfig.baseUrl}/notifications',
        ), // Tembak ke Notification Service
        headers: {"Authorization": "Bearer $token"},
      );
      if (response.statusCode == 200) return jsonDecode(response.body)['data'];
      return [];
    } catch (e) {
      return [];
    }
  }
}
