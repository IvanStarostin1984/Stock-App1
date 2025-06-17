import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/auth/auth_screen.dart';
import 'package:mobile_app/state/app_state.dart';
import 'package:smwa_services/services.dart';

class _OkAuthService extends AuthService {
  @override
  Future<bool> login(String email, String password) async => true;
}

class _FailAuthService extends AuthService {
  @override
  Future<bool> login(String email, String password) async => false;
}

void main() {
  group('AuthScreen login', () {
    testWidgets('shows success message on valid login', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authServiceProvider.overrideWithValue(_OkAuthService()),
          ],
          child: const MaterialApp(home: AuthScreen()),
        ),
      );
      await tester.enterText(find.byKey(const Key('email')), 'a@b.com');
      await tester.enterText(find.byKey(const Key('password')), 'pwd');
      await tester.tap(find.text('Sign In'));
      await tester.pump();
      expect(find.text('Login OK'), findsOneWidget);
    });

    testWidgets('shows error message on failed login', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authServiceProvider.overrideWithValue(_FailAuthService()),
          ],
          child: const MaterialApp(home: AuthScreen()),
        ),
      );
      await tester.enterText(find.byKey(const Key('email')), 'a@b.com');
      await tester.enterText(find.byKey(const Key('password')), '');
      await tester.tap(find.text('Sign In'));
      await tester.pump();
      expect(find.text('Login Failed'), findsOneWidget);
    });
  });
}
