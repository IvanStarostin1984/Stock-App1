import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/location_service.dart' as loc;
import 'package:smwa_services/src/country_setting_repository.dart';
import 'package:smwa_services/src/country_setting.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_test/flutter_test.dart';

class _FakeRepo implements CountrySettingRepository {
  CountrySetting? saved;

  @override
  Future<CountrySetting?> load() async => null;

  @override
  Future<void> save(CountrySetting setting) async {
    saved = setting;
  }
}

class _FakeGeolocator extends GeolocatorPlatform {
  @override
  Future<LocationPermission> checkPermission() async =>
      LocationPermission.always;

  @override
  Future<LocationPermission> requestPermission() async =>
      LocationPermission.always;

  @override
  Future<bool> isLocationServiceEnabled() async => true;
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
  TestWidgetsFlutterBinding.ensureInitialized();
  GeolocatorPlatform.instance = _FakeGeolocator();
  tearDown(() {
    loc.positionGetter = () => Geolocator.getCurrentPosition();
    loc.isoCodeGetter = (lat, lon) async => null;
  });

  test('ledger increments again after window expiry', () async {
    loc.positionGetter = () async => _pos();
    loc.isoCodeGetter = (lat, lon) async => 'US';
    final repo = _FakeRepo();
    final ledger = ApiQuotaLedger(1, const Duration(milliseconds: 50));
    final svc = LocationService(repository: repo, ledger: ledger);

    await svc.resolveCountry();
    expect(ledger.isSafe(), isFalse);
    await Future.delayed(const Duration(milliseconds: 60));
    expect(ledger.isSafe(), isTrue);
    await svc.resolveCountry();
    expect(repo.saved?.iso2, 'US');
  });

  test('throws when ledger disallows', () async {
    loc.positionGetter = () async => _pos();
    loc.isoCodeGetter = (lat, lon) async => 'US';
    final svc =
        LocationService(repository: _FakeRepo(), ledger: ApiQuotaLedger(0));
    expect(() async => await svc.resolveCountry(), throwsException);
  });

  test('throws when iso not found', () async {
    loc.positionGetter = () async => _pos();
    loc.isoCodeGetter = (lat, lon) async => null;
    final svc =
        LocationService(repository: _FakeRepo(), ledger: ApiQuotaLedger(1));
    expect(() async => await svc.resolveCountry(), throwsException);
  });
}
