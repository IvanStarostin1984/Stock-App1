import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';
import '../../state/portfolio_state.dart';
import '../../models/portfolio_holding.dart';

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
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () => ref
                          .read(portfolioNotifierProvider.notifier)
                          .removeHolding(h.id),
                    ),
                  ),
              ],
            ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: Text('Total: ${portfolio.total.toStringAsFixed(2)} ($counter)'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          final now = DateTime.now().toUtc();
          ref.read(portfolioNotifierProvider.notifier).addHolding(
                PortfolioHolding(
                  id: now.toIso8601String(),
                  symbol: 'AAPL',
                  quantity: 1,
                  buyPrice: 1,
                  added: now,
                ),
              );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
