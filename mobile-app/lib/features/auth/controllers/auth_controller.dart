import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart'; // Untuk simpan JWT
import 'package:e_learning_app/core/config/api_config.dart';

class AuthController {
  // --- 1. FUNGSI REGISTER (DAFTAR) ---
  Future<bool> register(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/register'), // Sesuai API Gateway
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"name": name, "email": email, "password": password}),
      );

      // Sesuai dokumen postman-mu (Status 200/201 artinya sukses)
      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        print("Error Backend: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Koneksi ke API Gateway gagal: $e");
      return false;
    }
  }

  // --- 2. FUNGSI LOGIN & SIMPAN JWT (Sesuai BPMN Halaman 8) ---
  Future<bool> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'), // Sesuai API Gateway
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      if (response.statusCode == 200) {
        // Parse hasil dari backend Node.js kamu
        final data = jsonDecode(response.body);

        // Asumsi token ada di response (sesuaikan dengan format respon Node.js-mu)
        // Biasanya: data['token'] atau data['data']['token']
        String token = data['token'] ?? data['data']['token'];

        // Simpan JWT ke memori HP
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', token);

        print("Login sukses, Token tersimpan!");
        return true;
      } else {
        print("Login Gagal: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Koneksi ke API Gateway gagal: $e");
      return false;
    }
  }
  // --- 3. FUNGSI UNTUK MENGAMBIL TOKEN (Dinamis untuk halaman lain) ---
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  // --- 4. FUNGSI LOGOUT (Hapus Token) ---
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token'); // Menghapus memori sesi
    print("Logout sukses, Token dihapus!");
  }
}
