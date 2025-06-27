import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:smwa_services/services.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('register stores hashed and encrypted credential', () async {
    final svc = AuthService();
    final cred = await svc.register('a@b.com', 'pwd12345');
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString('user_cred');
    expect(cred.email, 'a@b.com');
    expect(cred.hash.startsWith('\u00242b\u002412'), true);
    expect(stored, isNotNull);
    expect(stored!.contains('a@b.com'), false);
  });

  test('login succeeds with correct password', () async {
    final svc = AuthService();
    await svc.register('a@b.com', 'pwd12345');
    expect(await svc.login('a@b.com', 'pwd12345'), isTrue);
  });

  test('login fails on wrong or missing data', () async {
    final svc = AuthService();
    await svc.register('a@b.com', 'pwd12345');
    expect(await svc.login('a@b.com', 'bad'), isFalse);
    expect(await svc.login('x@b.com', 'pwd12345'), isFalse);
    expect(await svc.login('', 'pwd'), isFalse);
    expect(await svc.login('a@b.com', ''), isFalse);
  });
}
