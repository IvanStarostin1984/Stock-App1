class LruCache<K, V> {
  final int capacity;
  final _map = <K, V>{};
  final _expiry = <K, DateTime>{};

  LruCache([this.capacity = 128]);

  V? get(K key) {
    final value = _map.remove(key);
    if (value != null) {
      final exp = _expiry[key];
      if (exp != null && exp.isAfter(DateTime.now())) {
        _map[key] = value;
        return value;
      } else {
        _expiry.remove(key);
      }
    }
    return null;
  }

  void put(K key, V value, Duration ttl) {
    if (_map.length >= capacity) {
      final firstKey = _map.keys.first;
      _map.remove(firstKey);
      _expiry.remove(firstKey);
    }
    _map[key] = value;
    _expiry[key] = DateTime.now().add(ttl);
  }

  void delete(K key) {
    _map.remove(key);
    _expiry.remove(key);
  }
}
