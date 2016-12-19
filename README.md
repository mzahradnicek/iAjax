#improved Ajax library
## Introduction

`iAjax` is standalone library over Ajax operations in browser. It has helpers for GET, POST, PUT, DELETE operations.
It has built-in **parser**, which automatically parse response data due to the `Content-Type` header from server. In base are parsers for JSON and XML. You can also add your own parser functions based on mime type of response(eg. csv).
`beforeRequestProcess` handler is function called before response is processed. If function returns false, the response will not be processed and callbacks will not be called. It's usefull if user session has expired, you can show login window in app. It's defined as prototype, so it's working in whole app - see example.

## Examples
### Basic usage
```javascript
iAjax.request({
	url: '/foo/bar',
	success: function(data) {
		//success
		console.log(data);
	},
	error: function(type, e, xhr) {
		//error handler
	}
}).send();
```
### Helpers
All helpers GET, POST, PUT, DELETE has a same syntax
```javascript
iAjax.get('/mypage', { param1:'hello', who: 'world' }, function(data, event, xhr) {
	//process data
	console.log(data);
}, function(errorType, event, xhr) {
	console.log(error);
});
```
### Parser example
JSON and XML parsers are built-in. You can add custom parser by mime-type. Mimes can be separated by commas.
```javascript
iAjax.responseParser('addParser', 'text/csv,application/csv', function(inp) {
	//one line csv parser
	return inp.split(';');
});
```
### Before request process handler
```javascript
iAjax.request('prototype', 'beforeProcessRequest', function(xhr) {
	if (xhr.status != 401) return true;
	//if user session has expire on server
	//show login window
	//response process will be canceled
	return false;
});
```

## Roadmap

Here you will see goals of project - [ROADMAP](https://github.com/mzahradnicek/iAjax/blob/master/ROADMAP.md)

## License
[MIT](http://opensource.org/licenses/MIT)
