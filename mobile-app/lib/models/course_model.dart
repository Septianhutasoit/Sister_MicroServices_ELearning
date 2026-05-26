class CourseModel {
  final String id;
  final String title;
  final String description;
  final String instructor;
  final String imageUrl; 

  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.instructor,
    required this.imageUrl,
  });

  // Fungsi untuk mengubah data JSON dari Backend (API) menjadi Object Flutter
  factory CourseModel.fromJson(Map<String, dynamic> json) {
    return CourseModel(
      id: json['_id'] ?? '', // MongoDB menggunakan _id
      title: json['title'] ?? 'Tanpa Judul',
      description: json['description'] ?? 'Tidak ada deskripsi',
      instructor: json['instructor_id'] ?? 'Instruktur',
      imageUrl:
          json['image_url'] ??
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', // Gambar default jika kosong
    );
  }
}
