import 'package:flutter/material.dart';

/// Home page displayed after launching the app.
class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Main Screen')),
    );
  }
}
