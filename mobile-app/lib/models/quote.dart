/// Simple quote model used by the app state.
class Quote {
  final String symbol;
  final double price;
  final double open;
  final double high;
  final double low;
  final double close;

  const Quote({
    required this.symbol,
    required this.price,
    required this.open,
    required this.high,
    required this.low,
    required this.close,
  });
}
