//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'news_article.g.dart';

/// NewsArticle
///
/// Properties:
/// * [title] 
/// * [url] 
@BuiltValue()
abstract class NewsArticle implements Built<NewsArticle, NewsArticleBuilder> {
  @BuiltValueField(wireName: r'title')
  String get title;

  @BuiltValueField(wireName: r'url')
  String get url;

  NewsArticle._();

  factory NewsArticle([void updates(NewsArticleBuilder b)]) = _$NewsArticle;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(NewsArticleBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<NewsArticle> get serializer => _$NewsArticleSerializer();
}

class _$NewsArticleSerializer implements PrimitiveSerializer<NewsArticle> {
  @override
  final Iterable<Type> types = const [NewsArticle, _$NewsArticle];

  @override
  final String wireName = r'NewsArticle';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    NewsArticle object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'title';
    yield serializers.serialize(
      object.title,
      specifiedType: const FullType(String),
    );
    yield r'url';
    yield serializers.serialize(
      object.url,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    NewsArticle object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required NewsArticleBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'title':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.title = valueDes;
          break;
        case r'url':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.url = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  NewsArticle deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = NewsArticleBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

