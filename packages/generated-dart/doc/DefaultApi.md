# openapi.api.DefaultApi

## Load the API package
```dart
import 'package:openapi/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**newsGet**](DefaultApi.md#newsget) | **GET** /news | Get news
[**quoteGet**](DefaultApi.md#quoteget) | **GET** /quote | Get quote


# **newsGet**
> BuiltList<NewsArticle> newsGet(symbol)

Get news

### Example
```dart
import 'package:openapi/api.dart';

final api = Openapi().getDefaultApi();
final String symbol = symbol_example; // String | 

try {
    final response = api.newsGet(symbol);
    print(response);
} catch on DioException (e) {
    print('Exception when calling DefaultApi->newsGet: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **symbol** | **String**|  | 

### Return type

[**BuiltList&lt;NewsArticle&gt;**](NewsArticle.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quoteGet**
> Quote quoteGet(symbol)

Get quote

### Example
```dart
import 'package:openapi/api.dart';

final api = Openapi().getDefaultApi();
final String symbol = symbol_example; // String | 

try {
    final response = api.quoteGet(symbol);
    print(response);
} catch on DioException (e) {
    print('Exception when calling DefaultApi->quoteGet: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **symbol** | **String**|  | 

### Return type

[**Quote**](Quote.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

