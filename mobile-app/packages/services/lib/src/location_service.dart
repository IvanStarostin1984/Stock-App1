import 'api_quota_ledger.dart';

/// S-04 – LocationService
class LocationService {
  final ApiQuotaLedger _ledger = ApiQuotaLedger(1);

  Future<Map<String, dynamic>> resolveCountry() async {
    if (!_ledger.isSafe()) throw Exception('quota exceeded');
    _ledger.increment();
    return {'iso2': 'US'};
  }
}
