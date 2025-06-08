import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Screen reserved for the pro version of the app.
class ProScreen extends ConsumerWidget {
  const ProScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    return Scaffold(
      body: Center(child: Text('Pro Screen: ${state.count}')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(appStateProvider.notifier).increment(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
