import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Screen allowing users to authenticate.
class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _emailController = TextEditingController();
  final _pwdController = TextEditingController();
  String _status = '';

  Future<void> _login() async {
    final app = ref.read(appStateProvider.notifier);
    final ok = await app.signIn(
      _emailController.text,
      _pwdController.text,
    );
    setState(() => _status = ok ? 'Login OK' : 'Login Failed');
  }

  Future<void> _register() async {
    final app = ref.read(appStateProvider.notifier);
    await app.register(_emailController.text, _pwdController.text);
    setState(() => _status = 'Registered');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              key: const Key('email'),
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              key: const Key('password'),
              controller: _pwdController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            ElevatedButton(
              onPressed: _login,
              child: const Text('Sign In'),
            ),
            ElevatedButton(
              onPressed: _register,
              child: const Text('Register'),
            ),
            Text(_status, key: const Key('status')),
          ],
        ),
      ),
    );
  }
}
