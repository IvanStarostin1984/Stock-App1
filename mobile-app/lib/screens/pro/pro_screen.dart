import 'package:flutter/material.dart';

/// Screen reserved for the pro version of the app.
class ProScreen extends StatelessWidget {
  const ProScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Pro Screen')),
    );
  }
}
