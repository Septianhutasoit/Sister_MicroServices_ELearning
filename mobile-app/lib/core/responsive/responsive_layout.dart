import 'package:flutter/material.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget web;

  const ResponsiveLayout({Key? key, required this.mobile, required this.web})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 800) {
          return mobile; 
        } else {
          return web; 
        }
      },
    );
  }
}
