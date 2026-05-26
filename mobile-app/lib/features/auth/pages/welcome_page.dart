import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'login_page.dart';

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Column(
        children: [

          Expanded(
            flex: 6, // Mengambil 60% tinggi layar
            child: SizedBox(
              width: double.infinity,
              // SEMENTARA MENGGUNAKAN GAMBAR DARI INTERNET (UNSPLASH)
              // Nanti bisa diganti dengan gambar lokal (assets)
              child: Image.network(
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
                fit: BoxFit
                    .cover, // Gambar akan memenuhi area tanpa merusak rasio
                // Efek loading gambar
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(
                    child: CircularProgressIndicator(color: Colors.white),
                  );
                },
              ),
            ),
          ),

          // --- SETENGAH BAWAH: CARD PUTIH MELENGKUNG ---
          Expanded(
            flex: 4, // Mengambil 40% tinggi layar
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
              decoration: const BoxDecoration(
                color: AppColors.background, // Warna putih/terang
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40), // Lengkungan kiri atas
                  topRight: Radius.circular(40), // Lengkungan kanan atas
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // --- JUDUL ---
                  Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.school,
                            color: AppColors.primary,
                            size: 32,
                          ),
                          const SizedBox(width: 12),
                          const Text(
                            "E-Learning",
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: AppColors.primary,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // --- DESKRIPSI ---
                      const Text(
                        "Tingkatkan keahlianmu kapan saja dan di mana saja dengan platform microservices modern.",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 15,
                          color: AppColors.textSecondary,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),

                  // --- TOMBOL GET STARTED ---
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // PINDAH KE HALAMAN LOGIN
                        // pushReplacement digunakan agar user tidak bisa 'back' ke halaman welcome
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginPage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            16,
                          ), // Tombol melengkung
                        ),
                      ),
                      child: const Text(
                        "Get Started",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}