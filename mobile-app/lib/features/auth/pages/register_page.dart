import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../controllers/auth_controller.dart'; // Pastikan file controller ini sudah kamu buat ya

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool _isPasswordVisible = false;
  bool _isLoading = false; 

  // 1. TAMBAHKAN CONTROLLER UNTUK MEMBACA KETIKAN USER
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Memanggil AuthController untuk tembak API Gateway
  final AuthController _authController = AuthController();

  // Jangan lupa dibersihkan agar memori HP tidak bocor
  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Buat Akun Baru",
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "Mulai perjalanan belajarmu hari ini",
                style: TextStyle(fontSize: 15, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 32),

              // --- FORM NAMA LENGKAP ---
              _buildInputContainer(
                child: TextField(
                  controller: _nameController, // <-- Pasang controller disini
                  decoration: _inputDecoration(
                    "Nama Lengkap",
                    Icons.person_outline,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // --- FORM EMAIL ---
              _buildInputContainer(
                child: TextField(
                  controller: _emailController, // <-- Pasang controller disini
                  keyboardType: TextInputType.emailAddress,
                  decoration: _inputDecoration(
                    "Email address",
                    Icons.email_outlined,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // --- FORM PASSWORD ---
              _buildInputContainer(
                child: TextField(
                  controller:
                      _passwordController, // <-- Pasang controller disini
                  obscureText: !_isPasswordVisible,
                  decoration: _inputDecoration("Password", Icons.lock_outline)
                      .copyWith(
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible
                                ? Icons.visibility_off
                                : Icons.visibility,
                            color: AppColors.textSecondary,
                          ),
                          onPressed: () {
                            setState(() {
                              _isPasswordVisible = !_isPasswordVisible;
                            });
                          },
                        ),
                      ),
                ),
              ),
              const SizedBox(height: 32),

              // --- TOMBOL DAFTAR (BAGIAN B YANG SUDAH DIPERBAIKI) ---
              ElevatedButton(
                // Jika sedang loading, tombol mati. Jika tidak, jalankan logic.
                onPressed: _isLoading
                    ? null
                    : () async {
                        // Ambil teks yang diketik user
                        String name = _nameController.text.trim();
                        String email = _emailController.text.trim();
                        String password = _passwordController.text.trim();

                        // Cek apakah ada yang kosong
                        if (name.isEmpty || email.isEmpty || password.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("Harap isi semua kolom!"),
                            ),
                          );
                          return; // Berhenti disini, jangan lanjut ke API
                        }

                        // Mulai animasi loading
                        setState(() => _isLoading = true);

                        // INILAH BAGIAN B: Memanggil Microservices lewat Controller
                        bool isSuccess = await _authController.register(
                          name,
                          email,
                          password,
                        );

                        // Mencegah error jika user menekan tombol 'back' saat loading
                        if (!mounted) return;

                        // Matikan animasi loading
                        setState(() => _isLoading = false);

                        // Cek hasil dari API
                        if (isSuccess) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                "Akun berhasil dibuat! Silakan masuk.",
                              ),
                              backgroundColor: Colors.green,
                            ),
                          );
                          Navigator.pop(
                            context,
                          ); // Sukses? Kembali ke halaman Login
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                "Gagal mendaftar. Silakan coba lagi.",
                              ),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                style: _buttonStyle(),
                // Ubah tulisan jadi animasi muter kalau lagi loading
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        "Daftar Sekarang",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
              const SizedBox(height: 24),

              // --- SUDAH PUNYA AKUN ---
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    "Sudah punya akun? ",
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context), // Kembali Login
                    child: const Text(
                      "Masuk",
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputContainer({required Widget child}) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: child,
    );
  }

  InputDecoration _inputDecoration(String hint, IconData icon) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(
        color: AppColors.textSecondary,
        fontWeight: FontWeight.normal,
      ),
      prefixIcon: Icon(icon, color: AppColors.primaryLight),
      filled: true,
      fillColor: AppColors.surface,
      contentPadding: const EdgeInsets.symmetric(vertical: 20),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
      ),
    );
  }

  ButtonStyle _buttonStyle() {
    return ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 18),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );
  }
}
