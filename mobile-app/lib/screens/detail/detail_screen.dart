import 'package:flutter/material.dart';

/// Shows a detail view for a stock symbol if provided.
class DetailScreen extends StatelessWidget {
  /// The optional stock symbol to display.
  final String? symbol;

  /// Creates a [DetailScreen].
  const DetailScreen({this.symbol, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          symbol != null ? 'Detail Screen ($symbol)' : 'Detail Screen',
        ),
      ),
    );
  }
}
