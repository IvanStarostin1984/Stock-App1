import 'package:flutter/material.dart';
import 'screens/main/main_screen.dart';
import 'screens/news/news_screen.dart';
import 'screens/detail/detail_screen.dart';
import 'screens/auth/auth_screen.dart';
import 'screens/portfolio/portfolio_screen.dart';
import 'screens/pro/pro_screen.dart';

void main() => runApp(const SmwaApp());

class SmwaApp extends StatelessWidget {
  const SmwaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SMWA',
      initialRoute: '/',
      onGenerateRoute: generateRoute,
    );
  }
}

/// Generates routes with optional parameters.
Route<dynamic>? generateRoute(RouteSettings settings) {
  final uri = Uri.parse(settings.name ?? '/');
  final path = uri.pathSegments.isEmpty ? '/' : '/${uri.pathSegments.first}';
  switch (path) {
    case '/':
      return MaterialPageRoute(builder: (_) => const MainScreen());
    case '/news':
      return MaterialPageRoute(builder: (_) => const NewsScreen());
    case '/detail':
      final symbol = uri.pathSegments.length > 1 ? uri.pathSegments[1] : null;
      return MaterialPageRoute(builder: (_) => DetailScreen(symbol: symbol));
    case '/auth':
      return MaterialPageRoute(builder: (_) => const AuthScreen());
    case '/portfolio':
      return MaterialPageRoute(builder: (_) => const PortfolioScreen());
    case '/pro':
      return MaterialPageRoute(builder: (_) => const ProScreen());
  }
  return null;
}
