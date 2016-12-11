function addLogMsg(msg) {
	var logEl = document.querySelector('#testLog');
	logEl.innerHTML = logEl.innerHTML + '<br>' + msg;
}

//Simple text
function testSimple() {
	return new Promise((resolve, reject) => {
		iAjax.request({
			url: '/simple-text',
			success: function() {
				addLogMsg('Simple Text - passed');
				resolve();
			},
			error: function(type, e, xhr) {
				addLogMsg('Simple Text - failed');
				console.log(arguments);
				reject();
			}
		}).send();
	});
}

//HTTP Error 500
function test500() {
	return new Promise((resolve, reject) => {

		iAjax.request({
			url: '/error-500',
			success: function() {
				addLogMsg('Error 500 - failed');
				console.log(arguments);
				reject();
			},
			error: function(type, e, xhr) {
				addLogMsg('Error 500 - passed');
				resolve();
			}
		}).send();
	});
}

//HTTP Error 404
function test404() {
	return new Promise((resolve, reject) => {

		iAjax.request({
			url: '/error-404',
			success: function() {
				addLogMsg('Error 404 - failed');
				console.log(arguments);
				reject();
			},
			error: function(type, e, xhr) {
				addLogMsg('Error 404 - passed');
				resolve();
			}
		}).send();
	});
}

//HTTP 301 Redirect
function test301() {
	return new Promise((resolve, reject) => {

		iAjax.request({
			url: '/error-301',
			success: function() {
				addLogMsg('Error 301 - passed');
				resolve();
			},
			error: function(type, e, xhr) {
				addLogMsg('Error 301 - failed');
				console.log(arguments);
				reject();
			}
		}).send();
	});
}

//Events test
function eventsTest() {
	return new Promise((resolve, reject) => {
		iAjax.request({
			url: '/simple-text',
			loadStart: function() {
				addLogMsg('Event test - loadStart EVENT');
			},
			progress: function(loaded, total, e, xhr) {
				addLogMsg('Event test - progress EVENT');
			},
			load: function() {
				addLogMsg('Event test - load EVENT');
			},
			loadEnd: function() {
				addLogMsg('Event test - loadEnd EVENT');
			},
			success: function() {
				addLogMsg('Event test - passed');
				resolve();
			},
			error: function(type, e, xhr) {
				addLogMsg('Event test - failed');
				reject();
			}
		}).send();
	});
}

//beforeProcessRequest
function beforeProcessRequestTest() {
	return new Promise((resolve, reject) => {

		iAjax.request('prototype', 'beforeProcessRequest', function(xhr) {
			if (xhr.status != 401) return true;
			addLogMsg('beforeProcessRequest - cancel request process with status 401');
			resolve();
			return false;
		});

		iAjax.request({
			url: '/error-401',
			success: function() {
				addLogMsg('Error 401 - failed');
				reject();
			},
			error: function(type, e, xhr) {
				addLogMsg('Error 401 - failed');
				console.log(arguments);
				reject();
			}
		}).send();
	});
}

function getHelperTest() {
	return new Promise((resolve, reject) => {
		iAjax.get('/simple-text', { name: 'Jack Daniels' }, function(data) {
			addLogMsg('Get method helper - passed - '+data);
			resolve();
		},
		function(error) {
			addLogMsg('Get method helper - error');
			reject();
		});
	});
}

function jsonpTest() {
	return new Promise((resolve, reject) => {
		iAjax.get('http://ip.jsontest.com', function(res) {
			addLogMsg('JSONP test passed - passed - '+JSON.stringify(res));
			resolve();
		}, function(error) {
			console.log(arguments);
			reject();
		});
	});
}

testSimple()
	.then(test500)
	.then(test404)
	.then(test301)
	.then(eventsTest)
	.then(beforeProcessRequestTest)
	.then(getHelperTest)
	.then(jsonpTest)
	;
