import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/api_config.dart';

class AuthController {
  Future<bool> register(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/register'), // Tembak ke API Gateway
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": name,
          "email": email,
          "password": password,
        }),
      );

    if (response.statusCode == 200 || response.statusCode == 201) {
        print("Berhasil mendaftar di sistem terdistribusi!");
        return true;
      } else {
        print("Gagal mendaftar: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Error koneksi ke Gateway: $e");
      return false;
    }
  }

  Future<bool> forgotPassword(String email) async {
    try {
      final response = await http.post (
        Uri.parse('${ApiConfig.baseUrl}/auth/forgot-password'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email}),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
