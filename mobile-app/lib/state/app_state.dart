import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Application level state provider managing a simple counter.
class AppStateNotifier extends StateNotifier<int> {
  /// Creates an [AppStateNotifier] with an initial count of zero.
  AppStateNotifier() : super(0);

  /// Increments the counter by one.
  void increment() => state++;

  /// Resets the counter to zero.
  void reset() => state = 0;
}

/// Riverpod provider exposing the application counter.
final appStateProvider =
    StateNotifierProvider<AppStateNotifier, int>((ref) => AppStateNotifier());
