import 'package:flutter/material.dart';
import 'dashboard_mobile.dart';
import 'dashboard_web.dart';
import '../../core/responsive/responsive_layout.dart';

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: ResponsiveLayout(
        mobile: DashboardMobile(),
        web: DashboardWeb(), 
      ),
    );
  }
}
