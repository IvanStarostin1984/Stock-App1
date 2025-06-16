import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/location_service.dart' as loc;
import 'package:smwa_services/src/country_setting_repository.dart';
import 'package:smwa_services/src/country_setting.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:test/test.dart';

class _FakeRepo implements CountrySettingRepository {
  CountrySetting? saved;

  @override
  Future<CountrySetting?> load() async => null;

  @override
  Future<void> save(CountrySetting setting) async {
    saved = setting;
  }
}

Position _pos() => Position(
      latitude: 1.0,
      longitude: 2.0,
      timestamp: DateTime.now(),
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
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
    final fake = _FakeRepo();
    final svc = LocationService(repository: fake);
    final c = await svc.resolveCountry();
    expect(c.iso2, 'GB');
    expect(fake.saved?.iso2, 'GB');
  });

  test('resolveCountry throws when iso not found', () async {
    loc.positionGetter = () async => _pos();
    loc.isoCodeGetter = (lat, lon) async => null;
    final svc = LocationService(repository: _FakeRepo());
    expect(() async => await svc.resolveCountry(), throwsException);
  });
}
