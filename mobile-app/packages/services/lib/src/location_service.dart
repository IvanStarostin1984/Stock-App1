import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

import 'api_quota_ledger.dart';

/// Function returning the current position. Overridden in tests.
Future<Position> Function() positionGetter = () => Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.medium,
      timeLimit: const Duration(seconds: 5),
    );

/// Function mapping coordinates to an ISO 3166 code. Overridden in tests.
Future<String?> Function(double lat, double lon) isoCodeGetter =
    (lat, lon) async {
  final placemarks = await placemarkFromCoordinates(lat, lon);
  return placemarks.isEmpty ? null : placemarks.first.isoCountryCode;
};

/// S-04 – LocationService
class LocationService {
  final ApiQuotaLedger _ledger = ApiQuotaLedger(1);

  Future<Map<String, dynamic>> resolveCountry() async {
    if (!_ledger.isSafe()) throw Exception('quota exceeded');

    final permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      final req = await Geolocator.requestPermission();
      if (req == LocationPermission.denied ||
          req == LocationPermission.deniedForever) {
        throw Exception('permission denied');
      }
    }

    final pos = await positionGetter();
    final iso2 = await isoCodeGetter(pos.latitude, pos.longitude);
    if (iso2 == null) throw Exception('country not found');

    _ledger.increment();
    return {'iso2': iso2};
  }
}

