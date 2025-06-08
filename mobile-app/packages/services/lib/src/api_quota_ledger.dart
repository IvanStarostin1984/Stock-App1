class ApiQuotaLedger {
  int _count = 0;
  DateTime _start = DateTime.now();
  final int limit;
  final Duration window;

  ApiQuotaLedger(this.limit, [this.window = const Duration(hours: 24)]);

  void increment() {
    final now = DateTime.now();
    if (now.difference(_start) >= window) {
      _start = now;
      _count = 0;
    }
    _count++;
  }

  bool isSafe() {
    final now = DateTime.now();
    if (now.difference(_start) >= window) {
      return true;
    }
    return _count < limit;
  }
}
