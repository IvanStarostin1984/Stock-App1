import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('register returns stub credential', () async {
    final svc = AuthService();
    final cred = await svc.register('a@b.com', 'pwd');
    expect(cred['email'], 'a@b.com');
  });

  test('login returns true on non-empty', () async {
    final svc = AuthService();
    final ok = await svc.login('a@b.com', 'pwd');
    expect(ok, isTrue);
  });

  test('login fails with empty email or password', () async {
    final svc = AuthService();
    expect(await svc.login('', 'pwd'), isFalse);
    expect(await svc.login('a@b.com', ''), isFalse);
  });
}
