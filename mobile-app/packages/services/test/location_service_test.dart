import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/location_service.dart' as loc;
import 'package:geolocator/geolocator.dart';
import 'package:test/test.dart';

Position _pos() => Position(
      latitude: 1.0,
      longitude: 2.0,
      timestamp: DateTime.now(),
      accuracy: 0,
      altitude: 0,
      heading: 0,
      headingAccuracy: 0,
      speed: 0,
      speedAccuracy: 0,
    );

void main() {
  tearDown(() {
    loc.positionGetter = () => Geolocator.getCurrentPosition();
    loc.isoCodeGetter = (lat, lon) async {
      final placemarks = await placemarkFromCoordinates(lat, lon);
      return placemarks.isEmpty ? null : placemarks.first.isoCountryCode;
    };
  });

  test('resolveCountry returns iso code', () async {
    loc.positionGetter = () async => _pos();
    loc.isoCodeGetter = (lat, lon) async => 'GB';
    final svc = LocationService();
    final c = await svc.resolveCountry();
    expect(c['iso2'], 'GB');
  });

  test('resolveCountry throws when iso not found', () async {
    loc.positionGetter = () async => _pos();
    loc.isoCodeGetter = (lat, lon) async => null;
    final svc = LocationService();
    expect(() async => await svc.resolveCountry(), throwsException);
  });
}

