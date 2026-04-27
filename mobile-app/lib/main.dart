import 'package:flutter/material.dart';
import 'core/theme/app_colors.dart';
import 'features/auth/pages/login_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Learning App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // 👇 Memanggil warna langsung dari file app_colors.dart
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        // Menyeragamkan warna background seluruh aplikasi
        scaffoldBackgroundColor: AppColors.background,
        useMaterial3: true,
      ),
      home: const LoginPage(),
    );
  }
}
