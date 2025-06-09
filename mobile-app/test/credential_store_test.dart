import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_app/repositories/credential_store.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('CredentialStore', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('saves and finds credential', () async {
      final store = CredentialStore();
      final cred = store.create('a@b.com', 'pwd');
      await store.save(cred);
      final found = await store.find('a@b.com');
      expect(found?.email, 'a@b.com');
      expect(found?.hash.startsWith('\$2b\$12'), true);
    });

    test('updateProFlag modifies stored value', () async {
      final store = CredentialStore();
      final cred = store.create('a@b.com', 'pwd');
      await store.save(cred);
      await store.updateProFlag(true);
      final found = await store.find('a@b.com');
      expect(found?.isPro, true);
    });

    test('find returns null when empty', () async {
      final store = CredentialStore();
      final found = await store.find('a@b.com');
      expect(found, isNull);
    });
  });
}

