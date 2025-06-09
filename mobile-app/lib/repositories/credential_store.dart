import 'dart:convert';

import 'package:bcrypt/bcrypt.dart';
import 'package:encrypt/encrypt.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user_credential.dart';

/// R-03 – AES-256 encrypted persistence for [UserCredential].
class CredentialStore {
  static const _prefsKey = 'user_cred';
  // Simplified static key for demo (32 chars → AES-256).
  static final _aesKey = Key.fromUtf8('0123456789abcdef0123456789abcdef');
  static final _iv = IV.fromLength(16);

  Future<void> save(UserCredential cred) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = json.encode(cred.toJson());
    final enc = Encrypter(AES(_aesKey));
    final encrypted = enc.encrypt(jsonStr, iv: _iv);
    await prefs.setString(_prefsKey, encrypted.base64);
  }

  Future<UserCredential?> find(String email) async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_prefsKey);
    if (stored == null) return null;
    final enc = Encrypter(AES(_aesKey));
    final decrypted = enc.decrypt(Encrypted.fromBase64(stored), iv: _iv);
    final data = json.decode(decrypted) as Map<String, dynamic>;
    if (data['email'] != email) return null;
    return UserCredential.fromJson(data);
  }

  Future<void> updateProFlag(bool isPro) async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_prefsKey);
    if (stored == null) return;
    final enc = Encrypter(AES(_aesKey));
    final decrypted = enc.decrypt(Encrypted.fromBase64(stored), iv: _iv);
    final data = json.decode(decrypted) as Map<String, dynamic>;
    data['isPro'] = isPro;
    final encrypted = enc.encrypt(json.encode(data), iv: _iv);
    await prefs.setString(_prefsKey, encrypted.base64);
  }

  /// Utility to create a hashed credential.
  UserCredential create(String email, String password) {
    final salt = BCrypt.gensaltWithRounds(12);
    final hash = BCrypt.hashpw(password, salt);
    return UserCredential(
      email: email,
      hash: hash,
      salt: salt,
      isPro: false,
      created: DateTime.now(),
    );
  }
}
