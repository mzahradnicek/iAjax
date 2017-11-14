define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _iAjaxRequest = __webpack_require__(1);

	var _iAjaxRequest2 = _interopRequireDefault(_iAjaxRequest);

	var _iAjaxForm = __webpack_require__(3);

	var _iAjaxForm2 = _interopRequireDefault(_iAjaxForm);

	var _iAjaxHttpHelpersBase = __webpack_require__(4);

	var _iAjaxHttpHelpersBase2 = _interopRequireDefault(_iAjaxHttpHelpersBase);

	var _iAjaxResponseParser = __webpack_require__(2);

	var _iAjaxResponseParser2 = _interopRequireDefault(_iAjaxResponseParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//Main iAjax container

	__webpack_require__(5);

	var iAjax = {
		request: _iAjaxRequest2.default,
		responseParser: _iAjaxResponseParser2.default,
		form: _iAjaxForm2.default
	};

	// generate helpers
	['get', 'post', 'put', 'delete'].forEach(function (v) {
		iAjax[v] = function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(v);
			return _iAjaxHttpHelpersBase2.default.apply(null, args);
		};
	});

	exports.default = iAjax;
	// module.exports = iAjax;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (opt) {
		if (opt === 'prototype') {
			if (typeof arguments[2] == 'undefined') return Request.prototype[arguments[1]];
			Request.prototype[arguments[1]] = arguments[2];
			return;
		}

		return new Request(opt);
	};

	var _iAjaxResponseParser = __webpack_require__(2);

	var _iAjaxResponseParser2 = _interopRequireDefault(_iAjaxResponseParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Request = function Request(opt) {
		this.opt = Object.assign({
			method: 'GET',
			async: true,
			data: null,
			headers: null,
			jsonp: false,
			baseUrl: '',
			withCredentials: false,
			success: function success(data, e, xhr) {},
			error: function error(type, ev, xhr, data) {
				throw "Error " + type;
			}
		}, this.baseOpt, opt);
	};

	Request.prototype = {
		baseOpt: {},
		send: function send() {
			if (!this.opt.url) throw 'URL parameter for Request is not set.';

			//check domain - if use JSONP
			var finalUrl = (this.opt.url.indexOf('//') != -1 ? '' : this.opt.baseUrl) + this.opt.url;

			//add data to url for GET and DELETE method
			if (this.opt.data !== null && Object.prototype.toString.apply(this.opt.data) == '[object Object]') {
				var qsData = [],
				    uData = this.opt.data;
				for (var i in uData) {
					if (uData[i] instanceof Array) {
						for (var j in uData[i]) {
							qsData.push(encodeURIComponent(i) + '=' + encodeURIComponent(uData[i][j]));
						}continue;
					}

					qsData.push(encodeURIComponent(i) + '=' + encodeURIComponent(uData[i]));
				}

				if (['get', 'delete'].indexOf(this.opt.method.toLowerCase()) != -1) finalUrl = finalUrl + (finalUrl.indexOf('?') > -1 ? '&' : '?') + qsData.join('&');else this.opt.data = qsData.join('&');
			}

			if (!this.opt.jsonp) {
				//use XMLHttpRequest
				this.sendXMLHttpRequest(finalUrl);
			} else if (this.opt.method.toLowerCase() == 'get') {
				//use JSONP
				this.sendJSONPRequest(finalUrl);
			} else {
				throw 'This request cant be done!';
			}
		},
		sendXMLHttpRequest: function sendXMLHttpRequest(finalUrl) {
			//create and init xhr object
			this.xhr = new XMLHttpRequest();

			this.xhr.onreadystatechange = this.xhrOnreadyStateChangeEvent;

			var xArgs = [this.opt.method, finalUrl, this.opt.async];

			if (this.opt.user) {
				xArgs.push(this.opt.user);
				if (this.opt.password) xArgs.push(this.opt.password);
			}

			this.xhr.open.apply(this.xhr, xArgs);
			if (this.opt.withCredentials) this.xhr.withCredentials = true;

			//set headers
			if (this.opt.headers) {
				var hs = this.opt.headers;
				for (var i in hs) {
					this.xhr.setRequestHeader(i, hs[i]);
				}
			}

			this.xhr.addEventListener('loadstart', this.xhrLoadStartEvent.bind(this));
			this.xhr.addEventListener('progress', this.xhrProgressEvent.bind(this));
			this.xhr.addEventListener('error', this.xhrErrorEvent.bind(this));
			this.xhr.addEventListener('timeout', this.xhrTimeoutEvent.bind(this));
			this.xhr.addEventListener('abort', this.xhrAbortEvent.bind(this));
			this.xhr.addEventListener('load', this.xhrLoadEvent.bind(this));
			this.xhr.addEventListener('loadend', this.xhrLoadEndEvent.bind(this));

			//send
			this.xhr.send(this.opt.data != null && ['post', 'put'].indexOf(this.opt.method.toLowerCase()) !== -1 ? this.opt.data : null);
		},

		setConfig: function setConfig(c) {
			this.opt = Object.assign(this.opt, c);
			return this;
		},

		//XHR Events
		xhrOnreadyStateChangeEvent: function xhrOnreadyStateChangeEvent() {
			//is this needed in modern browsers?
		},
		xhrLoadStartEvent: function xhrLoadStartEvent(e) {
			if (this.opt.loadStart) this.opt.loadStart(e, this.xhr);
		},
		xhrProgressEvent: function xhrProgressEvent(e) {
			if (this.opt.progress) {
				if (e.lengthComputable) this.opt.progress(e.loaded, e.total, e, this.xhr);else this.opt.progress(false, e.total, e, this.xhr);
			}
		},
		xhrErrorEvent: function xhrErrorEvent(e) {
			this.opt.error('error', e, this.xhr);
		},
		xhrTimeoutEvent: function xhrTimeoutEvent(e) {
			this.opt.error('timeout', e, this.xhr);
		},
		xhrAbortEvent: function xhrAbortEvent(e) {
			if (this.opt.abort) this.opt.abort(e, this.xhr);
		},
		xhrLoadEvent: function xhrLoadEvent(e) {
			if (this.opt.load) this.opt.load(e, this.xhr);

			if (!this.beforeProcessRequest(this.xhr)) return;

			if (this.xhr.status < 400) this.opt.success((0, _iAjaxResponseParser2.default)(this.xhr), e, this.xhr);else this.opt.error('http', e, this.xhr, (0, _iAjaxResponseParser2.default)(this.xhr));
		},
		xhrLoadEndEvent: function xhrLoadEndEvent(e) {
			if (this.opt.loadEnd) this.opt.loadEnd(e, this.xhr);
		},
		beforeProcessRequest: function beforeProcessRequest(xhr) {
			return true;
		},
		sendJSONPRequest: function sendJSONPRequest(finalUrl) {
			if (!this.opt.callbackName) {
				this.opt.callbackName = 'callback_' + Math.round(100000 * Math.random());
			}

			if (!this.opt.timeout) {
				this.opt.timeout = 10000;
			}

			finalUrl = finalUrl + (finalUrl.indexOf('?') > -1 ? '&' : '?') + 'callback=' + this.opt.callbackName;

			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			script.src = finalUrl;

			var timeoutID = window.setTimeout(function () {
				this.opt.error('timeout');
				clearRequest.apply(this);
			}.bind(this), this.opt.timeout);

			var clearRequest = function clearRequest() {
				window.clearTimeout(timeoutID);
				script.parentNode.removeChild(script);
				delete window[this.opt.callbackName];
			};

			//add success
			window[this.opt.callbackName] = function (data) {
				this.opt.success(data);
				clearRequest.apply(this);
			}.bind(this);

			//add error
			script.addEventListener('error', function (e) {
				this.opt.error('error', e);
				clearRequest.apply(this);
			}.bind(this));

			(document.getElementsByTagName('head')[0] || document.body).appendChild(script);
		}
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (xhr) {
		if (typeof xhr == 'string') {
			if (xhr == 'addParser') {
				parsers[arguments[1]] = arguments[2];
				return;
			}
		}

		for (var i in parsers) {
			var mimes = i.split(','),
			    rType = xhr.getResponseHeader('Content-Type').split(';');
			if (mimes.indexOf(rType[0]) > -1) {
				return parsers[i](xhr.responseText);
			}
		}

		return xhr.responseText;
	};

	var parsers = {
		'application/json,text/json': function applicationJsonTextJson(inp) {
			return JSON.parse(inp);
		},
		'application/xml,text/xml': function applicationXmlTextXml(inp) {
			var parser = new DOMParser();
			return parser.parseFromString(inp, 'text/xml');
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = function (frm, opt) {
		//get form by selector
		if (typeof frm == 'string' && (!(opt.formEl = document.querySelector(frm)) || opt.formEl.tagName != 'FORM')) throw 'Form element not found or it is not a FORM!';

		//frm is element or data
		if ((typeof frm === 'undefined' ? 'undefined' : _typeof(frm)) == 'object') {
			if (frm instanceof Node) {
				if (frm.tagName == 'FORM') opt.formEl = frm;else throw 'Element is not FORM node.';
			} else var data = frm;
		}

		var f = new Form(opt, data);

		if (opt.formEl) opt.formEl.addEventListener('submit', function (e) {
			e.preventDefault();
			f.submit();
		});

		return f;
	};

	var _iAjaxRequest = __webpack_require__(1);

	var _iAjaxRequest2 = _interopRequireDefault(_iAjaxRequest);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// very nice async loop from stack overflow - maybe user Promises loop in future
	var asyncLoop = function asyncLoop(iterations, func, callback) {
		var index = 0,
		    done = false;
		var loop = {
			next: function next() {
				if (done) {
					return;
				}

				if (index < iterations) {
					index++;
					func(loop);
				} else {
					done = true;
					callback();
				}
			},
			iteration: function iteration() {
				return index - 1;
			},
			break: function _break() {
				done = true;
				callback();
			}
		};

		loop.next();
		return loop;
	};

	var Form = function Form(opt, data) {
		this.opt = Object.assign({
			formEl: null,
			method: 'post',
			batch: false,
			success: function success(data, form, e, xhr) {},
			error: function error(type, form, ev, xhr, data) {
				throw "Error " + type;
			}
		}, opt);

		this.fieldsStatic = [];
		this.fields = [];
		this.hasFiles = false;
		this.batchBytesLoaded = 0;
		this.batchBytesTotal = 0;
		this._submitting = false;

		if (data) {
			for (var i in data) {
				this.fieldsStatic.push([i, data[i]]);
			}
		}
	};

	Form.prototype = {
		submit: function submit() {
			var reqOpt = {};
			this.fields = this.fieldsStatic.slice();
			this._submitting = true;

			//create formData
			if (this.opt.formEl) {
				this.serializeFormData(this.opt.formEl);
				this.opt.method = this.opt.formEl.method;
			}

			reqOpt['method'] = this.opt.method;

			if (this.opt.url) {
				reqOpt.url = this.opt.url;
			} else if (this.opt.formEl !== null) {
				reqOpt.url = this.opt.formEl.action;
			} else {
				throw 'URL is not set';
			}

			if (this.opt.beforeSend && !this.opt.beforeSend.call(this)) {
				this._submitting = false;
				return;
			}

			reqOpt['loadStart'] = this.frmLoadStartEvent.bind(this);
			reqOpt['progress'] = this.frmProgressEvent.bind(this);
			reqOpt['error'] = this.frmErrorEvent.bind(this);
			reqOpt['abort'] = this.frmAbortEvent.bind(this);
			reqOpt['load'] = this.frmLoadEvent.bind(this);
			reqOpt['loadEnd'] = this.frmLoadEndEvent.bind(this);
			reqOpt['success'] = this.frmSuccessEvent.bind(this);

			if (this.hasFiles && this.opt.batch) {
				this.runBatch(reqOpt);
				return;
			}

			if (['post', 'put'].indexOf(this.opt.method) != -1) {
				//make form data
				if (this.hasFiles) {
					reqOpt.data = this.mkFormData(this.fields);
				} else {
					reqOpt.data = this.makeQS(this.fields);
					reqOpt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
				}
			} else {
				//GET
				if (this.fields) reqOpt.url += '?' + this.makeQS(this.fields);
			}

			//send form
			(0, _iAjaxRequest2.default)(reqOpt).send();
		},
		mkFormData: function mkFormData(fields) {
			var formData = new FormData();

			for (var i = 0; fields.length > i; i++) {
				formData.append.apply(formData, fields[i]);
			}

			return formData;
		},
		runBatch: function runBatch(reqOpt) {
			var files = [],
			    vals = [];
			this.batchBytesTotal = 0;
			this.batchBytesLoaded = 0;

			//split files and other fields
			for (var i = 0; this.fields.length > i; i++) {
				if (this.fields[i].length == 3) {
					files.push(this.fields[i]); //filter out batch files
					this.batchBytesTotal += this.fields[i][1].size;
				} else vals.push(this.fields[i]);
			}

			if (this.batchStartEvent(files, vals, this.batchBytesTotal) === false) {
				this._submitting = false;
				return;
			}

			asyncLoop(files.length, function (loop) {
				var data = vals.concat([]);
				data.push(files[loop.iteration()]);

				reqOpt['data'] = this.mkFormData(data);

				reqOpt['loadEnd'] = function () {
					if (this.frmLoadEndEvent.apply(this, arguments) !== false) loop.next();
				}.bind(this);

				//send file
				(0, _iAjaxRequest2.default)(reqOpt).send();
			}.bind(this), function () {
				//everything done
				this.batchDoneEvent();
			}.bind(this));
		},
		frmLoadStartEvent: function frmLoadStartEvent(e, xhr) {
			if (this.opt.loadStart) this.opt.loadStart(this, e, xhr);
		},
		frmProgressEvent: function frmProgressEvent(loaded, total, e, xhr) {
			if (this.opt.progress) this.opt.progress(loaded, total, this, e, xhr);
		},
		frmErrorEvent: function frmErrorEvent(error, e, xhr, data) {
			this.opt.error(error, this, e, xhr, data);
		},
		frmAbortEvent: function frmAbortEvent(e, xhr) {
			if (this.opt.abort) this.opt.abort(this, e, xhr);
		},
		frmLoadEvent: function frmLoadEvent(e, xhr) {
			if (this.opt.load) this.opt.load(this, e, xhr);
		},
		frmSuccessEvent: function frmSuccessEvent(data, e, xhr) {
			this.opt.success(data, this, e, xhr);
		},
		frmLoadEndEvent: function frmLoadEndEvent(e, xhr) {
			if (this.opt.loadEnd) return this.opt.loadEnd(this, e, xhr);
		},

		// batch EVENTs
		batchStartEvent: function batchStartEvent() {
			//get fields, files list
			if (this.opt.batchStart) return this.opt.batchStart.apply(this, arguments);
			return true;
		},
		batchDoneEvent: function batchDoneEvent() {
			if (this.opt.batchDone) return this.opt.batchDone.apply(this, arguments);
		},
		append: function append() {
			if (_typeof(arguments[1]) == 'object') this.hasFiles = true;
			this['fields' + (this._submitting ? '' : 'Static')].push(arguments);
		},
		set: function set(name, value) {
			var f = 'fields' + (this._submitting ? '' : 'Static');
			//check if exists
			for (var i = 0, al = this[f].length; i < al; i++) {
				if (this[f][i][0] == name) {
					this[f][i] = arguments;
					return;
				}
			}
			this[f].push(arguments);
		},
		delete: function _delete(name, value) {
			var f = 'fields' + (this._submitting ? '' : 'Static');
			for (var i = 0, al = this[f].length; i < al; i++) {
				if (this[f][i][0] == name && (!value || this[f][i][1] == value)) {
					this[f].splice(i, 1);
				}
			}
			return true;
		},
		get: function get(name) {
			var f = 'fields' + (this._submitting ? '' : 'Static');
			for (var i = 0, al = this[f].length; i < al; i++) {
				if (this[f][i][0] == name) {
					return this[f][i][1];
				}
			}
		},
		getAll: function getAll(name) {
			var res = [],
			    f = 'fields' + (this._submitting ? '' : 'Static');
			for (var i = 0, al = this[f].length; i < al; i++) {
				if (this[f][i][0] == name) {
					res.push(this[f][i][1]);
				}
			}
			return res;
		},
		has: function has(name) {
			var f = 'fields' + (this._submitting ? '' : 'Static');
			for (var i = 0, al = this.fieds.length; i < al; i++) {
				if (this[f][i][0] == name) return true;
			}
			return false;
		},
		serializeFormData: function serializeFormData(frmEl) {
			if (!frmEl || frmEl.tagName !== 'FORM') throw 'Element is not form';

			var i, e;

			for (i = frmEl.elements.length - 1; i >= 0; i--) {
				e = frmEl.elements[i];
				if (e.name == '') continue;

				switch (e.nodeName) {
					case 'INPUT':
						switch (e.type) {
							case 'file':
								if (['post', 'put'].indexOf(frmEl.method) == -1) throw 'You cant send files with GET method.';
								if (e.files.length == 0) continue;
								for (var fi = 0; fi < e.files.length; fi++) {
									this.append(e.name, e.files[fi], e.files[fi].name);
								}break;

							case 'checkbox':
							case 'radio':
								if (!e.checked) continue;
							default:
								this.append(e.name, e.value);
								break;
						}
						break;
					case 'TEXTAREA':
						this.append(e.name, e.value);
						break;
					case 'SELECT':
						if (e.type == 'select-one') {
							this.append(e.name, e.value);
							break;
						}

						//multiple select
						for (j = e.options.length - 1; j >= 0; j = j - 1) {
							if (!e.options[j].selected) continue;
							this.append(e.name, e.options[j].value);
						}
						break;
				}
			}
		},
		makeQS: function makeQS(data) {
			var rqs = [];
			for (var i = 0; data.length > i; i++) {
				if (data[i][1] instanceof Array) {
					for (var j in data[i][1]) {
						rqs.push(data[i][0] + '=' + encodeURIComponent(data[i][1][j]));
					}continue;
				}

				rqs.push(data[i][0] + '=' + encodeURIComponent(data[i][1]));
			}

			return rqs.join('&');
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; //iAjax get helper


	//params: url, data, success, error, format


	exports.default = function (method, url) {
		if (['get', 'post', 'put', 'delete'].indexOf(method.toLowerCase()) == -1) {
			throw 'Method ' + method + ' not supported';
		}

		if (typeof url != 'string') {
			throw 'URL must be string';
		}

		//convert arguments object to array
		var args = Array.prototype.slice.call(arguments),
		    opt = { method: args.shift(), url: args.shift() };

		//data
		if (args.length > 0 && _typeof(args[0]) == 'object') opt['data'] = args.shift();

		//success
		if (args.length > 0 && typeof args[0] == 'function') opt['success'] = args.shift();

		//error
		if (args.length > 0 && typeof args[0] == 'function') opt['error'] = args.shift();

		//format
		if (args.length > 0 && typeof args[0] == 'string') opt['format'] = args.shift();

		var req = (0, _iAjaxRequest2.default)(opt);
		req.send();
		return req;
	};

	var _iAjaxRequest = __webpack_require__(1);

	var _iAjaxRequest2 = _interopRequireDefault(_iAjaxRequest);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.assign != 'function') {
		(function () {
			Object.assign = function (target) {
				'use strict';
				//We must check against these specific cases.

				if (target === undefined || target === null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}

				var output = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];
					if (source !== undefined && source !== null) {
						for (var nextKey in source) {
							if (source.hasOwnProperty(nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}

				return output;
			};
		})();
	}

/***/ }
/******/ ])});;