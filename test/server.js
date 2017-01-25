var http = require('http');
var qs = require('querystring');
var url = require('url');
var fs = require('fs');
var Busboy = require('busboy');
var path = require('path');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();

dispatcher.onGet('/simple-text', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Simple text request');
});

dispatcher.onGet('/error-500', function(req, res) {
	res.writeHead(500);
	res.end('http server error 500');
});

dispatcher.onGet('/error-404', function(req, res) {
	res.writeHead(404);
	res.end('http error not found 404');
});

dispatcher.onGet('/error-401', function(req, res) {
	res.writeHead(401);
	res.end('http error not found 401');
});

dispatcher.onGet('/error-301', function(req, res) {
	res.writeHead(301, { 'Location': '/simple-text' });
	res.end('moved permanently 301');
});

dispatcher.onGet('/json', function(req, res) {
	var str = {
		'species': 'cat',
		'name' : 'Garfield',
		'weight' : 30
	};
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(str));
});

//xml
dispatcher.onGet('/xml', function(req, res) {
	var filePath = path.join(__dirname, 'content.xml');
	var stat = fs.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'application/xml',
		'Content-Length': stat.size
	});

	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

//custom csv
dispatcher.onGet('/csv', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/csv' });
	res.end('10;30;some text;23456;LOL');
});

//form get
dispatcher.onGet('/form-get', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });

	var rUrl = url.parse(req.url, true);
	var jres = {};
	if (rUrl.query.multi) {
		jres['message'] = rUrl.query['foo[]'][0] == 'bar' && rUrl.query['foo[]'][1] == 'baz' ? 'Success multi':'Error multi param values';
	} else jres['message'] = rUrl.query.foo != 'bar' ? 'Error param value':'Success';

	res.end(JSON.stringify(jres));
});

//form post
dispatcher.onPost('/form-post', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });

	var   jres = {};

	if (req.params.multi) {
		jres['message'] = req.params['foo[]'] && req.params['foo[]'][0] == 'bar' && req.params['foo[]'][1] == 'baz' ? 'Recieve multi foo param':'Error recieving multi foo param';
	} else
		jres['message'] = req.params.foo && req.params.foo == 'bar' ? 'Recieved POST foo=bar':'Error recieving foo';

	res.end(JSON.stringify(jres));


/*
	var body = '';

	req.on('data', function(data) {
		body += data;
		console.log('dataaaa');
	});

	req.on('end', function() {
		var POST = qs.parse(body);
console.log('postdata', POST);
		var jres = {};
		if (POST.multi) {
			jres['message'] = POST['foo[]'][0] == 'bar' && POST['foo[]'][1] == 'baz' ? 'Success multi':'Error multi param values';
		} else jres['message'] = POST.foo != 'bar' ? 'Error param value':'Success';

		res.end(JSON.stringify(jres));
	});
*/
});

var multipartFormAction = function(req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });

	var busboy = new Busboy({ headers: req.headers }), jres = { data:{} };

	busboy.on('field', function(name, val) {
		jres['data'][name] = val;
	});

	busboy.on('finish', function() {
		jres['success'] = true;
		res.end(JSON.stringify(jres));
	});

	req.pipe(busboy);
}


//index.html
dispatcher.onGet('/', function(req, res) {
	var filePath = path.join(__dirname, 'index.html');
	var stat = fs.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Content-Length': stat.size
	});

	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

dispatcher.onGet('/iAjax.js', function(req, res) {
	var filePath = path.join(__dirname, '../dist/iAjax.js');
	var stat = fs.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'text/javascript',
		'Content-Length': stat.size
	});

	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

dispatcher.onGet('/tests.js', function(req, res) {
	var filePath = path.join(__dirname, 'tests.js');
	var stat = fs.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'text/javascript',
		'Content-Length': stat.size
	});

	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

http.createServer(function(req, res) {
	try {
		console.log(req.url);
		if (req.method == 'POST' && req.headers['content-type'].indexOf('multipart') > -1) multipartFormAction(req, res);
			else dispatcher.dispatch(req, res);
	} catch(e) {
		console.log(e);
	}
}).listen(8081);

console.log('Server is running on port 8081');
console.log('Open this link in browser: http://localhost:8081');
