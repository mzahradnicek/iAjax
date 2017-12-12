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

function postHelperTest() {
	return new Promise((resolve, reject) => {
		var pData = { name: 'Jack Daniels', food: 'klobasa' }, testStatus = false;
		iAjax.post('/form-post', pData, function(data) {

			if (data['success'] == true) {
				for(var k in pData) {
					if (data['data'][k] && pData[k] == data['data'][k]) continue;
						
					testStatus = false;
					break;
				}
			}
			addLogMsg('Post method helper - <span style="color:green;">passed</span>');
			resolve();
		},
		function(error) {
			addLogMsg('Post method helper - <span style="color:red">error</span>');
			reject();
		});
	});
}

function putHelperTest() {
	return new Promise((resolve, reject) => {
		var pData = { name: 'Jack Daniels', putmethod: true, food: 'klobasa' }, testStatus = false;
		iAjax.put('/check-put', pData, function(data) {

			if (data['success'] == true) {
				for(var k in pData) {
					if (data['data'][k] && pData[k] == data['data'][k]) continue;
						
					testStatus = false;
					break;
				}
			}

			addLogMsg('Put method helper - <span style="color:green;">passed</span>');
			resolve();
		},
		function(error) {
			addLogMsg('Put method helper - <span style="color:red">error</span>');
			reject();
		});
	})
}

function deleteHelperTest() {
	return new Promise((resolve, reject) => {
		iAjax.delete('/delete-check', function(data) {
			addLogMsg('Delete method helper - passed - '+data);
			resolve();
		},
		function(error) {
			addLogMsg('Delete method helper - error');
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

//json parser
function testJsonParser() {
	return new Promise((resolve, reject) => {
		iAjax.request({
			url: '/json',
			success: function(data) {
				addLogMsg('JSON parser test - passed');
				console.log('Parsed JSON object',data);
				resolve();
			},
			error: function(type, e, xhr) {
				addLogMsg('JSON parser - failed');
				console.log(arguments);
				reject();
			}
		}).send();
	});
}

//xml parser
function testXMLParser() {
	return new Promise((resolve, reject) => {
		iAjax.request({
			url: '/xml',
			success: function(data) {
				addLogMsg('XML parser test - passed');
				console.log('Parsed XML object',data);
				resolve();
			},
			error: function(type, e, xhr) {
				addLogMsg('XML parser - failed');
				console.log(arguments);
				reject();
			}
		}).send();
	});
}

//add custom parser
//very simple csv parser - dont use in production!!!
iAjax.responseParser('addParser', 'text/csv', function(inp) {
	return inp.split(';');
});

function testCustomParser() {
	return new Promise((resolve, reject) => {
		iAjax.request({
			url: '/csv',
			success: function(data) {
				addLogMsg('Custom parser test - passed');
				console.log('Parsed CSV object',data);
				resolve();
			},
			error: function(type, e, xhr) {
				addLogMsg('Custom parser - failed');
				console.log(arguments);
				reject();
			}
		}).send();
	});
}

//virtual form test
function testGetVirtualForm() {
	return new Promise((resolve, reject) => {
		var iFrm = iAjax.form({ 'foo': 'bar' }, {
			url: '/form-get',
			method: 'get',
			success: function(data, form, e, xhr) {
				addLogMsg('Basic Get Virtual Form - '+data['message']);
				resolve();
			},
			error: function(type, form, e, xhr) {
				addLogMsg('Basic Get Virtual Form - failed');
				console.log(arguments);
				reject();
			}
		});

		iFrm.submit();
	});
}

function testGetVirtualMultiForm() {
	return new Promise((resolve, reject) => {
		var iFrm = iAjax.form({ 'foo[]': [ 'bar','baz' ], 'multi': true }, {
			url: '/form-get',
			method: 'get',
			success: function(data, form, e, xhr) {
				addLogMsg('Basic Get Array Param Virtual Form - '+data['message']);
				resolve();
			},
			error: function(type, form, e, xhr) {
				addLogMsg('Basic Get Array Param Virtual Form - failed');
				console.log(arguments);
				reject();
			}
		});

		iFrm.submit();
	});
}

function testPostVirtualForm() {
	return new Promise((resolve, reject) => {
		var iFrm = iAjax.form({ 'foo': 'bar' }, {
			url: '/form-post',
			success: function(data, form, e, xhr) {
				console.log(data);
				if (data['success'] == true && data['data']['foo'] == 'bar') {
					addLogMsg('Basic Post Virtual Form - <i style="color:green">passed</i>');
					resolve();
					return;
				}

				addLogMsg('Basic Post Virtual Form - <i style="color:red">check failed</i>');
				reject();
			},
			error: function(type, form, e, xhr) {
				addLogMsg('Basic Post Virtual Form - failed');
				console.log(arguments);
				reject();
			}
		});

		iFrm.submit();
	});
}

function testPostVirtualMultiForm() {
	return new Promise((resolve, reject) => {
		var iFrm = iAjax.form({ 'foo[]': [ 'bar','baz' ], 'multi': true }, {
			url: '/form-post',
			success: function(data, form, e, xhr) {
				addLogMsg('Basic Post Array Param Virtual Form - '+data['message']);
				resolve();
			},
			error: function(type, form, e, xhr) {
				addLogMsg('Basic Post Array Param Virtual Form - failed');
				console.log(arguments);
				reject();
			}
		});

		iFrm.submit();
	});
}

function testGetRealForm() {
	var frm = document.querySelector('#getForm');
	frm.style.display = 'block';

	return new Promise((resolve, reject) => {
		var iFrm = iAjax.form('#getFrm', {
			beforeSend: function() {
				this.append('appendedField','yes');
				return true;
			},
			success: function(data, form, e, xhr) {
				addLogMsg('Real Get Form - '+data['message']);
				frm.style.display = 'none';
				resolve();
			},
			error: function(type, form, e, xhr) {
				addLogMsg('Real Get Form - failed');
				console.log(arguments);
				reject();
			}
		});
	});
}

function testPostRealForm() {
	var frm = document.querySelector('#postForm');
	frm.style.display = 'block';

	return new Promise((resolve, reject) => {
		var iFrm = iAjax.form('#postFrm', {
			beforeSend: function() {
				this.append('appendedField','yes');
				return true;
			},
			success: function(data, form, e, xhr) {
				frm.style.display = 'none';
				if (!data['success']) {
					addLogMsg('Real Post From - Failed on server');
					reject();
					return;
				}

				var fData = data['data'];
				if (
					fData['foo'] == 'bar' &&
					fData['input-text'] == 'World' &&
					fData['radvalue'] == 1 &&
					fData['select'] == 3 &&
					fData['appendedField'] == 'yes'
				) {
					addLogMsg('Real Post Form - Success');
					resolve();
					return;
				}

				addLogMsg('Real Post Form - Failed - Wrong values');
				reject();
			},
			error: function(type, form, e, xhr) {
				addLogMsg('Real Post Form - failed');
				console.log(arguments);
				reject();
			}
		});
	});
}

function testRealFileSend() {
	var frmDiv = document.querySelector('#realFile');
	frmDiv.style.display = 'block';

	return new Promise((resolve, reject) => {
		iAjax.form('#realFileForm', {
			success: function(data, form, e, xhr) {
				frmDiv.style.display = 'none';
				if (!data['success']) {
					addLogMsg('Real File Form - <i style="color:red">Failed on server</i>');
					reject(); return;
				}

				if (!data['data']['filesend'] || data['data']['filesend'] != 'true') {
					addLogMsg('Real File Form - <i style="color:red">Failed field send</i>');
					reject(); return;
				}

				//check file
				var files = form.opt.formEl.file.files;
				for (var i = 0; i < files.length;i++) {
					var frmFile = files[i], dFile = data['files'][frmFile.name] || false;

					if (!dFile || dFile.length != frmFile.size) {
						addLogMsg('Real File Form - <i style="color:red">Sending and recieving file "'+frmFile.name+'" doesnt match!</i>');
						console.log(dFile, frmFile);
						reject(); return;
					}
				}

				addLogMsg('Real File Form - <i style="color:green">passed</i>');
				resolve(); return;
			},
			error: function(type, form, e, xhr) {
				frmDiv.style.display = 'none';
				addLogMsg('Real File Form - <i style="color:red">failed</i>');
				console.log(arguments);
				reject();
			}
		});
	});
}

function testBatchFileSend() {
	var frmDiv = document.querySelector('#batchFile');
	frmDiv.style.display = 'block';

	return new Promise((resolve, reject) => {
		iAjax.form('#batchFileForm', {
			batch: true,
			success: function(data, form, e, xhr) {
				frmDiv.style.display = 'none';
				if (!data['success']) {
					addLogMsg('Batch File Form - <i style="color:red">Failed on server</i>');
					return;
				}

				if (!data['data']['filesend'] || data['data']['filesend'] != 'true') {
					addLogMsg('Batch File Form - <i style="color:red">Failed field send</i>');
					return;
				}

				//check file
				var files = form.opt.formEl.file.files,
					dFiles = data['files'];

				for (var i in dFiles) {
					for (var j = 0; j < files.length;j++) {
						if (files[j].name != i) continue;

						if (dFiles[i].length != files[j].size) {
							addLogMsg('Batch File Form - <i style="color:red">Sending and recieving file "'+files[j].name+'" doesnt match!</i>');
						} else {
							addLogMsg('Batch File Form - <i style="color:green">Sending and recieving file "'+files[j].name+'" passed!</i>');
						}
					}
				}
			},
			progress: function() {
				console.log('progress', arguments);
			},
			loadEnd: function(ctx, e, xhr, batch) {
				console.log('Batch loadEnd', arguments);
				if (batch == 2) {
					console.log('Batch cancel loop');
					return false;
				}
			},
			error: function(type, form, e, xhr) {
				frmDiv.style.display = 'none';
				addLogMsg('Batch File Form - <i style="color:red">failed</i>');
				console.log(arguments);
				reject();
			},
			batchStart: function() {
				console.log('batchStartEvent', arguments);
				return true;
			}
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
	.then(postHelperTest)
	.then(putHelperTest)
	.then(deleteHelperTest)
	.then(jsonpTest)
	.then(testJsonParser)
	.then(testXMLParser)
	.then(testCustomParser)
	.then(testGetVirtualForm)
	.then(testGetVirtualMultiForm)
	.then(testPostVirtualForm)
	.then(testPostVirtualMultiForm)
	.then(testGetRealForm)
	.then(testPostRealForm)
	.then(testRealFileSend)
	.then(testBatchFileSend)
	;
