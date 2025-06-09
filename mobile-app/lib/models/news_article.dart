/// SD-03 – Lightweight news DTO used across the app.
class NewsArticle {
  final String title;
  final String url;
  final String source;
  final DateTime published;

  const NewsArticle({
    required this.title,
    required this.url,
    required this.source,
    required this.published,
  });

  factory NewsArticle.fromMap(Map<String, dynamic> map) {
    return NewsArticle(
      title: map['title'] as String,
      url: map['url'] as String,
      source: map['source'] as String? ?? '',
      published: DateTime.parse(map['published'] as String),
    );
  }

  Map<String, dynamic> toMap() => {
        'title': title,
        'url': url,
        'source': source,
        'published': published.toIso8601String(),
      };
}
