var http = require('http');
var fs = require('fs');
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
		dispatcher.dispatch(req, res);
	} catch(e) {
		console.log(e);
	}
}).listen(8081);

console.log('Server is running on port 8081');
console.log('Open this link in browser: http://localhost:8081');
