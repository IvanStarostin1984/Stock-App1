/// S-05 – AuthService
import 'package:bcrypt/bcrypt.dart';

import 'credential_store.dart';
import 'user_credential.dart';

class AuthService {
  final CredentialStore _store;

  AuthService({CredentialStore? store}) : _store = store ?? CredentialStore();

  /// Register a new user and persist the credential.
  Future<UserCredential> register(String email, String password) async {
    if (email.isEmpty || password.isEmpty) {
      throw ArgumentError('invalid input');
    }
    final cred = _store.create(email, password);
    await _store.save(cred);
    return cred;
  }

  /// Validate credentials against the stored hash.
  Future<bool> login(String email, String password) async {
    if (email.isEmpty || password.isEmpty) return false;
    final cred = await _store.find(email);
    if (cred == null) return false;
    return BCrypt.checkpw(password, cred.hash);
  }
}
