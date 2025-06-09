/// SD-05 – Local portfolio holding model.
class PortfolioHolding {
  final String id;
  final String symbol;
  final double quantity;
  final double buyPrice;
  final DateTime added;

  const PortfolioHolding({
    required this.id,
    required this.symbol,
    required this.quantity,
    required this.buyPrice,
    required this.added,
  });

  factory PortfolioHolding.fromMap(Map<String, dynamic> map) {
    return PortfolioHolding(
      id: map['id'] as String,
      symbol: map['symbol'] as String,
      quantity: (map['quantity'] as num).toDouble(),
      buyPrice: (map['buyPrice'] as num).toDouble(),
      added: DateTime.parse(map['added'] as String),
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'symbol': symbol,
        'quantity': quantity,
        'buyPrice': buyPrice,
        'added': added.toIso8601String(),
      };

  PortfolioHolding copyWith({String? id, String? symbol, double? quantity, double? buyPrice, DateTime? added}) {
    return PortfolioHolding(
      id: id ?? this.id,
      symbol: symbol ?? this.symbol,
      quantity: quantity ?? this.quantity,
      buyPrice: buyPrice ?? this.buyPrice,
      added: added ?? this.added,
    );
  }
}
