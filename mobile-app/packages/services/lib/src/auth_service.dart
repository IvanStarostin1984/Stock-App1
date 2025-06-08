/// S-05 – AuthService
class AuthService {
  Future<Map<String, dynamic>> register(String email, String password) async {
    return {'email': email};
  }

  Future<bool> login(String email, String password) async {
    return email.isNotEmpty && password.isNotEmpty;
  }
}
