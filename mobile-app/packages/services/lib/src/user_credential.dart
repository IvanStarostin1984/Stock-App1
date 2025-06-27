class UserCredential {
  final String email;
  final String hash;
  final String salt;
  final bool isPro;
  final DateTime created;

  const UserCredential({
    required this.email,
    required this.hash,
    required this.salt,
    required this.isPro,
    required this.created,
  });

  factory UserCredential.fromJson(Map<String, dynamic> json) {
    return UserCredential(
      email: json['email'] as String,
      hash: json['hash'] as String,
      salt: json['salt'] as String,
      isPro: json['isPro'] as bool,
      created: DateTime.parse(json['created'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
        'email': email,
        'hash': hash,
        'salt': salt,
        'isPro': isPro,
        'created': created.toIso8601String(),
      };
}
