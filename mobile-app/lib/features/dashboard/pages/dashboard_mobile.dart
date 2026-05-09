import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/course_model.dart';
import '../controllers/dashboard_controller.dart';
import '../../course/pages/course_detail_page.dart';
import '../../achievement/pages/achievement_page.dart';
import '../../profile/pages/profile_page.dart';
import '../../notification/pages/notification_page.dart';

// ========== 1. MODEL PROGRESS MATERI ==========
class MateriProgress {
  final String courseId;
  bool isCompleted;
  int? examScore;

  MateriProgress({
    required this.courseId,
    this.isCompleted = false,
    this.examScore,
  });

  Map<String, dynamic> toJson() => {
    'courseId': courseId,
    'isCompleted': isCompleted,
    'examScore': examScore,
  };

  factory MateriProgress.fromJson(Map<String, dynamic> json) => MateriProgress(
    courseId: json['courseId'],
    isCompleted: json['isCompleted'] ?? false,
    examScore: json['examScore'],
  );
}

class ProgressManager {
  static const String _key = 'materi_progress';
  static late SharedPreferences _prefs;
  static Map<String, MateriProgress> _progressMap = {};

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _load();
  }

  static void _load() {
    final String? data = _prefs.getString(_key);
    if (data != null) {
      final List<dynamic> list = List<dynamic>.from(
        _prefs.getStringList(_key) ?? [],
      );
      for (var item in list) {
        final map = Map<String, dynamic>.from(item as Map);
        final progress = MateriProgress.fromJson(map);
        _progressMap[progress.courseId] = progress;
      }
    }
  }

  static void _save() {
    final List<String> list = _progressMap.values
        .map((p) => p.toJson().toString())
        .toList();
    _prefs.setStringList(_key, list);
  }

  static MateriProgress? getProgress(String courseId) {
    return _progressMap[courseId];
  }

  static void markCompleted(String courseId, {int? examScore}) {
    _progressMap[courseId] = MateriProgress(
      courseId: courseId,
      isCompleted: true,
      examScore: examScore,
    );
    _save();
  }

  static void resetProgress(String courseId) {
    _progressMap.remove(courseId);
    _save();
  }
}

// ========== 2. HALAMAN DAFTAR MATERI (BELAJAR) ==========
class MateriListPage extends StatefulWidget {
  final DashboardController controller;
  const MateriListPage({super.key, required this.controller});

  @override
  State<MateriListPage> createState() => _MateriListPageState();
}

class _MateriListPageState extends State<MateriListPage> {
  late Future<List<CourseModel>> _futureCourses;

  @override
  void initState() {
    super.initState();
    _futureCourses = widget.controller.fetchCourses();
  }

  void _refresh() {
    setState(() {
      _futureCourses = widget.controller.fetchCourses();
    });
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async => _refresh(),
      child: FutureBuilder<List<CourseModel>>(
        future: _futureCourses,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            );
          }
          if (snapshot.hasError ||
              !snapshot.hasData ||
              snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.grey),
                  const SizedBox(height: 16),
                  Text(
                    "Belum ada materi",
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _refresh,
                    child: const Text("Refresh"),
                  ),
                ],
              ),
            );
          }
          final courses = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: courses.length,
            itemBuilder: (context, index) {
              final course = courses[index];
              final progress = ProgressManager.getProgress(course.id);
              final isCompleted = progress?.isCompleted ?? false;
              final examScore = progress?.examScore;
              return GestureDetector(
                onTap: () async {
                  final result = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => MateriDetailPage(
                        course: course,
                        isCompleted: isCompleted,
                        examScore: examScore,
                      ),
                    ),
                  );
                  if (result == true) _refresh();
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(20),
                          bottomLeft: Radius.circular(20),
                        ),
                        child: Image.network(
                          course.imageUrl,
                          width: 100,
                          height: 100,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 100,
                            height: 100,
                            color: Colors.grey.shade200,
                            child: const Icon(Icons.broken_image),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                course.title,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                course.instructor,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isCompleted
                                          ? AppColors.primary
                                          : Colors.orange.shade100,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      isCompleted
                                          ? "Selesai (Nilai: ${examScore ?? '-'})"
                                          : "Belum dipelajari",
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: isCompleted
                                            ? Colors.white
                                            : Colors.orange.shade800,
                                      ),
                                    ),
                                  ),
                                  if (isCompleted) ...[
                                    const SizedBox(width: 8),
                                    const Icon(
                                      Icons.check_circle,
                                      color: AppColors.primary,
                                      size: 16,
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(Icons.chevron_right, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

// ========== 3. HALAMAN DETAIL MATERI (MEMBACA) ==========
class MateriDetailPage extends StatefulWidget {
  final CourseModel course;
  final bool isCompleted;
  final int? examScore;

  const MateriDetailPage({
    super.key,
    required this.course,
    required this.isCompleted,
    this.examScore,
  });

  @override
  State<MateriDetailPage> createState() => _MateriDetailPageState();
}

class _MateriDetailPageState extends State<MateriDetailPage> {
  bool _isMarked = false;

  @override
  void initState() {
    super.initState();
    _isMarked = widget.isCompleted;
  }

  void _markComplete() {
    setState(() {
      _isMarked = true;
    });
    ProgressManager.markCompleted(widget.course.id);
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Materi ditandai selesai!")));
  }

  void _startExam() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ExamPage(
          courseId: widget.course.id,
          courseTitle: widget.course.title,
        ),
      ),
    );
    if (result != null && result is int) {
      ProgressManager.markCompleted(widget.course.id, examScore: result);
      setState(() {});
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Ujian selesai! Nilai: $result")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.course.title),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.network(
                widget.course.imageUrl,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 200,
                  color: Colors.grey.shade200,
                  child: const Icon(Icons.broken_image, size: 50),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              widget.course.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Oleh: ${widget.course.instructor}",
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
            const SizedBox(height: 24),
            const Text(
              "Materi Pembelajaran",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              widget.course.description,
              style: const TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 32),
            // Tombol aksi
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isMarked ? null : _markComplete,
                    icon: const Icon(Icons.done_all),
                    label: Text(_isMarked ? "Telah Selesai" : "Tandai Selesai"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isMarked
                          ? Colors.grey
                          : AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isMarked ? _startExam : null,
                    icon: const Icon(Icons.quiz),
                    label: const Text("Ikuti Ujian"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isMarked
                          ? AppColors.primary
                          : Colors.grey.shade300,
                      foregroundColor: _isMarked ? Colors.white : Colors.grey,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
            if (widget.examScore != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.score, color: AppColors.primary),
                    const SizedBox(width: 8),
                    Text(
                      "Nilai ujian terakhir: ${widget.examScore}",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

// ========== 4. HALAMAN UJIAN (CONTOH SOAL) ==========
class ExamPage extends StatefulWidget {
  final String courseId;
  final String courseTitle;
  const ExamPage({
    super.key,
    required this.courseId,
    required this.courseTitle,
  });

  @override
  State<ExamPage> createState() => _ExamPageState();
}

class _ExamPageState extends State<ExamPage> {
  final List<Map<String, dynamic>> _questions = [
    {
      "text": "Apa singkatan dari ENIAC?",
      "options": [
        "Electronic Numerical Integrator and Computer",
        "Electronic Number Integrator and Calculator",
        "Electrical Numerical Integrator and Computer",
        "Electronic Network Integrator and Computer",
      ],
      "answer": 0,
    },
    {
      "text": "Tahun berapa ARPANET pertama kali beroperasi?",
      "options": ["1965", "1969", "1971", "1973"],
      "answer": 1,
    },
    {
      "text": "Siapa yang dikenal sebagai 'Bapak Kecerdasan Buatan'?",
      "options": [
        "Alan Turing",
        "John McCarthy",
        "Marvin Minsky",
        "Herbert Simon",
      ],
      "answer": 1,
    },
  ];

  late List<int?> _selectedAnswers;
  bool _submitted = false;
  int _score = 0;

  @override
  void initState() {
    super.initState();
    _selectedAnswers = List.filled(_questions.length, null);
  }

  void _submitExam() {
    int correct = 0;
    for (int i = 0; i < _questions.length; i++) {
      if (_selectedAnswers[i] == _questions[i]["answer"]) correct++;
    }
    final score = (correct / _questions.length * 100).round();
    setState(() {
      _submitted = true;
      _score = score;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Ujian: ${widget.courseTitle}"),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: _submitted
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.assignment_turned_in,
                    size: 80,
                    color: AppColors.primary,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    "Nilai Anda: $_score",
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Jawaban benar: ${(_score / 100 * _questions.length).round()} dari ${_questions.length}",
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context, _score),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text("Kembali ke Materi"),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _questions.length,
              itemBuilder: (context, index) {
                final q = _questions[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "${index + 1}. ${q["text"]}",
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        ...List.generate(q["options"].length, (optIndex) {
                          return RadioListTile<int>(
                            title: Text(q["options"][optIndex]),
                            value: optIndex,
                            groupValue: _selectedAnswers[index],
                            onChanged: (val) {
                              setState(() {
                                _selectedAnswers[index] = val;
                              });
                            },
                            activeColor: AppColors.primary,
                          );
                        }),
                      ],
                    ),
                  ),
                );
              },
            ),
      bottomNavigationBar: _submitted
          ? null
          : Padding(
              padding: const EdgeInsets.all(16),
              child: ElevatedButton(
                onPressed: _selectedAnswers.every((a) => a != null)
                    ? _submitExam
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text("Kirim Jawaban"),
              ),
            ),
    );
  }
}

// ========== 5. DASHBOARD MOBILE YANG SUDAH DIINTEGRASI ==========
class DashboardMobile extends StatefulWidget {
  const DashboardMobile({super.key});

  @override
  State<DashboardMobile> createState() => _DashboardMobileState();
}

class _DashboardMobileState extends State<DashboardMobile> {
  int _selectedIndex = 0;
  final DashboardController _controller = DashboardController();

  // Carousel
  final PageController _carouselController = PageController();
  int _currentCarouselIndex = 0;
  late Timer _carouselTimer;

  final List<Map<String, String>> _carouselItems = [
    {
      "title": "Sejarah Komputer",
      "subtitle": "Dari ENIAC hingga superkomputer modern",
      "image":
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format",
    },
    {
      "title": "Perkembangan Internet",
      "subtitle": "ARPANET, WWW, dan era digital",
      "image":
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format",
    },
    {
      "title": "Kecerdasan Buatan",
      "subtitle": "Dari Turing hingga AI modern",
      "image":
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format",
    },
    {
      "title": "Blockchain",
      "subtitle": "Revolusi desentralisasi",
      "image":
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format",
    },
  ];

  @override
  void initState() {
    super.initState();
    _startCarouselTimer();
    ProgressManager.init(); // inisialisasi shared preferences
  }

  void _startCarouselTimer() {
    _carouselTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_carouselController.hasClients) {
        final nextPage = (_currentCarouselIndex + 1) % _carouselItems.length;
        _carouselController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _carouselTimer.cancel();
    _carouselController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final homePageContent = SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCustomHeader(),
          const SizedBox(height: 16),
          _buildCarousel(),
          const SizedBox(height: 24),
          _buildCategories(),
          const SizedBox(height: 24),
          _buildPopularCoursesHeader(),
          _buildPopularCoursesGrid(),
          const SizedBox(height: 24),
          _buildExamAchievementsHeader(),
          _buildExamAchievements(),
          const SizedBox(height: 40),
        ],
      ),
    );

    final pages = [
      homePageContent,
      MateriListPage(controller: _controller),
      const Center(
        child: Text("Pencapaian Saya", style: TextStyle(fontSize: 20)),
      ),
      const Center(child: Text("Profil Saya", style: TextStyle(fontSize: 20))),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: pages[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: Colors.grey.shade400,
          showUnselectedLabels: true,
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_filled),
              label: "Home",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.menu_book_rounded),
              label: "Materi",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.emoji_events_rounded),
              label: "Pencapaian",
            ), // Pakai rounded
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: "Profil",
            ),
          ],
        ),
      ),
    );
  }

  // ========== TAMPILAN SAMA SEPERTI SEBELUMNYA (HEADER, CAROUSEL, KATEGORI, KURSUS POPULER, PENCAPAIAN) ==========
  Widget _buildCustomHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      decoration: const BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
        image: DecorationImage(
          image: NetworkImage(
            "https://www.transparenttextures.com/patterns/cubes.png",
          ),
          opacity: 0.05,
          fit: BoxFit.cover,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Hi, Mahasiswa 👋",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Jelajahi sejarah teknologi!",
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.8),
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: const Badge(
                  backgroundColor: Colors.redAccent,
                  smallSize: 10,
                  child: Icon(
                    Icons.notifications_none_rounded,
                    color: Colors.white,
                    size: 28,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: TextField(
              decoration: InputDecoration(
                hintText: "Cari materi sejarah...",
                hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                border: InputBorder.none,
                icon: const Icon(Icons.search, color: Colors.grey),
                suffixIcon: Container(
                  margin: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.tune_rounded,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCarousel() {
    return SizedBox(
      height: 160,
      child: PageView.builder(
        controller: _carouselController,
        onPageChanged: (index) => setState(() => _currentCarouselIndex = index),
        itemCount: _carouselItems.length,
        itemBuilder: (context, i) {
          final item = _carouselItems[i];
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              image: DecorationImage(
                image: NetworkImage(item["image"]!),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(
                  Colors.black.withOpacity(0.2),
                  BlendMode.darken,
                ),
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(28),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Colors.black.withOpacity(0.3), Colors.transparent],
                ),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    item["title"]!,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item["subtitle"]!,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCategories() {
    final categories = [
      {"icon": Icons.computer, "label": "Komputer", "color": Colors.blue},
      {"icon": Icons.wifi, "label": "Internet", "color": Colors.green},
      {"icon": Icons.psychology, "label": "AI", "color": Colors.purple},
      {"icon": Icons.link, "label": "Blockchain", "color": Colors.orange},
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: categories.map((cat) {
          final Color catColor = cat["color"] as Color;
          return Column(
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: catColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(cat["icon"] as IconData, color: catColor, size: 28),
              ),
              const SizedBox(height: 8),
              Text(
                cat["label"] as String,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildPopularCoursesHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            "Materi Populer",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          TextButton(
            onPressed: () {},
            child: const Text(
              "Lihat Semua",
              style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPopularCoursesGrid() {
    return FutureBuilder<List<CourseModel>>(
      future: _controller.fetchCourses(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(32),
              child: CircularProgressIndicator(color: AppColors.primary),
            ),
          );
        } else if (snapshot.hasError ||
            !snapshot.hasData ||
            snapshot.data!.isEmpty) {
          return _buildDummyCoursesGrid();
        }
        final courses = snapshot.data!;
        return GridView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.72,
          ),
          itemCount: courses.length,
          itemBuilder: (context, index) => _buildCourseCard(courses[index]),
        );
      },
    );
  }

  Widget _buildDummyCoursesGrid() {
    final dummyCourses = [
      CourseModel(
        id: "d1",
        title: "Design Thinking Fundamental",
        description: "Pelajari metode design thinking",
        instructor: "Robert Green",
        imageUrl:
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&auto=format",
      ),
      CourseModel(
        id: "d2",
        title: "3D Illustration Design",
        description: "Kuasai ilustrasi 3D",
        instructor: "John Doe",
        imageUrl:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format",
      ),
      CourseModel(
        id: "d3",
        title: "Sejarah Komputer",
        description: "Dari ENIAC hingga sekarang",
        instructor: "Prof. Alan",
        imageUrl:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format",
      ),
      CourseModel(
        id: "d4",
        title: "Blockchain Fundamental",
        description: "Dasar-dasar blockchain",
        instructor: "Dr. Satoshi",
        imageUrl:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format",
      ),
    ];
    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.72,
      ),
      itemCount: dummyCourses.length,
      itemBuilder: (context, index) => _buildCourseCard(dummyCourses[index]),
    );
  }

  Widget _buildCourseCard(CourseModel course) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => CourseDetailPage(course: course)),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                  child: Image.network(
                    course.imageUrl,
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 120,
                      color: Colors.grey.shade200,
                      child: const Icon(Icons.image, color: Colors.grey),
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                        SizedBox(width: 4),
                        Text(
                          "4.8",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.bookmark_border_rounded,
                      size: 16,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    course.title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.person, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          course.instructor,
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.grey.shade600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Rp 180.000",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      const Text(
                        "Baca Selengkapnya",
                        style: TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExamAchievementsHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            "Pencapaian Ujian",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          TextButton(
            onPressed: () {},
            child: const Text(
              "Riwayat",
              style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExamAchievements() {
    final exams = [
      {"title": "Sejarah Komputer", "score": "90", "status": "Lulus Memuaskan"},
      {"title": "Perkembangan Internet", "score": "85", "status": "Lulus"},
      {
        "title": "AI & Masa Depan",
        "score": "Menunggu",
        "status": "Dalam Penilaian",
      },
    ];
    return SizedBox(
      height: 110,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        itemCount: exams.length,
        separatorBuilder: (_, __) => const SizedBox(width: 16),
        itemBuilder: (_, i) {
          final exam = exams[i];
          return Container(
            width: 220,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.primary, AppColors.primaryLight],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  exam["title"]!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      exam["status"]!,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 12,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        exam["score"]!,
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
