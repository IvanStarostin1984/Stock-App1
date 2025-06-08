import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Screen allowing users to authenticate.
class AuthScreen extends ConsumerWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    return Scaffold(
      body: Center(child: Text('Auth Screen: ${state.count}')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(appStateProvider.notifier).increment(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
