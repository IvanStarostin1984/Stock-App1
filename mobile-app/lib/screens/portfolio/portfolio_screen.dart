import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';
import '../../state/portfolio_state.dart';

/// Displays the user's stock portfolio.
class PortfolioScreen extends ConsumerStatefulWidget {
  const PortfolioScreen({super.key});

  @override
  ConsumerState<PortfolioScreen> createState() => _PortfolioScreenState();
}

class _PortfolioScreenState extends ConsumerState<PortfolioScreen> {
  @override
  void initState() {
    super.initState();
    ref.read(appStateProvider.notifier).syncWatchList();
    ref.read(portfolioNotifierProvider.notifier).load();
  }

  @override
  Widget build(BuildContext context) {
    final counter = ref.watch(appStateProvider).count;
    final portfolio = ref.watch(portfolioNotifierProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Portfolio')),
      body: portfolio.holdings.isEmpty
          ? const Center(child: Text('No holdings'))
          : ListView(
              children: [
                for (final h in portfolio.holdings)
                  ListTile(
                    title: Text(h.symbol),
                    subtitle: Text('Qty: ${h.quantity}'),
                  ),
              ],
            ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: Text('Total: ${portfolio.total.toStringAsFixed(2)} ($counter)'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            ref.read(appStateProvider.notifier).removeFromWatchList('AAPL'),
        child: const Icon(Icons.remove),
      ),
    );
  }
}
