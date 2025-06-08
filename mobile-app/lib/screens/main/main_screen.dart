import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Landing page of the app showing market data.
class MainScreen extends ConsumerStatefulWidget {
  const MainScreen({super.key});

  @override
  ConsumerState<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends ConsumerState<MainScreen> {
  @override
  void initState() {
    super.initState();
    ref.read(appStateProvider.notifier).loadHeadline();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final quote = state.headline;
    return Scaffold(
      body: Center(
        child: quote != null
            ? Text('${quote.symbol}: ${quote.price}')
            : const Text('Loading...'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(appStateProvider.notifier).increment(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
