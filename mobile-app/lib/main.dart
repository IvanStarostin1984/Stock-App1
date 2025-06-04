import 'package:flutter/material.dart';
import 'screens/main/main_screen.dart';
import 'screens/news/news_screen.dart';
import 'screens/detail/detail_screen.dart';
import 'screens/auth/auth_screen.dart';
import 'screens/portfolio/portfolio_screen.dart';
import 'screens/pro/pro_screen.dart';

/// Entry point of the mobile application.
void main() => runApp(const SmwaApp());

/// Root widget of the stock market mobile app.
class SmwaApp extends StatelessWidget {
  const SmwaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SMWA',
      initialRoute: '/',
      routes: {
        '/': (_) => const MainScreen(),
        '/news': (_) => const NewsScreen(),
        '/detail': (_) => const DetailScreen(),
        '/auth': (_) => const AuthScreen(),
        '/portfolio': (_) => const PortfolioScreen(),
        '/pro': (_) => const ProScreen(),
      },
    );
  }
}
