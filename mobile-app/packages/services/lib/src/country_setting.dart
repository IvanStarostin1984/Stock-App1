class CountrySetting {
  final String iso2;
  final String lastCurrency;
  final DateTime acquired;
  final String method;

  CountrySetting({
    required this.iso2,
    required this.lastCurrency,
    required this.acquired,
    required this.method,
  });

  factory CountrySetting.fromJson(Map<String, dynamic> json) {
    return CountrySetting(
      iso2: json['iso2'] as String,
      lastCurrency: json['lastCurrency'] as String,
      acquired: DateTime.parse(json['acquired'] as String),
      method: json['method'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'iso2': iso2,
        'lastCurrency': lastCurrency,
        'acquired': acquired.toIso8601String(),
        'method': method,
      };

  bool isExpired() {
    return DateTime.now().difference(acquired).inDays > 30;
  }
}
