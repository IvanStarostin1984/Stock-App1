import 'dart:convert';
import 'package:http/http.dart' as http;

import 'api_quota_ledger.dart';
import 'fetch_json.dart';

/// S-06 – ProUpgradeService
class ProUpgradeService {
  final NetClient _net;
  final http.Client _client;
  final Future<void> Function(bool) _update;

  ProUpgradeService(this._update, {ApiQuotaLedger? ledger, http.Client? client})
      : _client = client ?? http.Client(),
        _net = NetClient(ledger ?? ApiQuotaLedger(1000), client);

  /// Posts a mock checkout request to stripe-mock and updates the credential
  /// store when successful.
  Future<bool> checkoutMock() async {
    if (!_net.ledger.isSafe()) return false;
    try {
      final resp = await _client.post(
        Uri.parse('http://localhost:12111/v1/checkout/sessions'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:
            'mode=payment&success_url=http://localhost/s&cancel_url=http://localhost/c&line_items[0][price]=pro_demo',
      );
      if (resp.statusCode != 200) return false;
      final data = jsonDecode(resp.body) as Map<String, dynamic>;
      if (data['status'] != 'open') return false;
      _net.ledger.increment();
      await _update(true);
      return true;
    } catch (_) {
      return false;
    }
  }
}
