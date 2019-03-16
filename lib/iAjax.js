(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["iAjax"] = factory();
	else
		root["iAjax"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/iAjax.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/iAjax-Core.js":
/*!***************************!*\
  !*** ./src/iAjax-Core.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if (typeof Object.assign != 'function') {\n  (function () {\n    Object.assign = function (target) {\n      'use strict'; //We must check against these specific cases.\n\n      if (target === undefined || target === null) {\n        throw new TypeError('Cannot convert undefined or null to object');\n      }\n\n      var output = Object(target);\n\n      for (var index = 1; index < arguments.length; index++) {\n        var source = arguments[index];\n\n        if (source !== undefined && source !== null) {\n          for (var nextKey in source) {\n            if (source.hasOwnProperty(nextKey)) {\n              output[nextKey] = source[nextKey];\n            }\n          }\n        }\n      }\n\n      return output;\n    };\n  })();\n}\n\n//# sourceURL=webpack://iAjax/./src/iAjax-Core.js?");

/***/ }),

/***/ "./src/iAjax-Form.js":
/*!***************************!*\
  !*** ./src/iAjax-Form.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\n\nvar _iAjaxRequest = _interopRequireDefault(__webpack_require__(/*! ./iAjax-Request */ \"./src/iAjax-Request.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\n// very nice async loop from stack overflow - maybe user Promises loop in future\nvar asyncLoop = function asyncLoop(iterations, func, callback) {\n  var index = 0,\n      done = false;\n  var loop = {\n    next: function next() {\n      if (done) {\n        return;\n      }\n\n      if (index < iterations) {\n        index++;\n        func(loop);\n      } else {\n        done = true;\n        callback();\n      }\n    },\n    iteration: function iteration() {\n      return index - 1;\n    },\n    break: function _break() {\n      done = true;\n      callback();\n    }\n  };\n  loop.next();\n  return loop;\n};\n\nvar Form = function Form(opt, data) {\n  this.opt = Object.assign({\n    formEl: null,\n    method: 'post',\n    batch: false,\n    success: function success(data, form, e, xhr) {},\n    error: function error(type, form, ev, xhr, data) {\n      throw \"Error \" + type;\n    }\n  }, opt);\n  this.fieldsStatic = [];\n  this.fields = [];\n  this.hasFiles = false;\n  this.batchBytesLoaded = 0;\n  this.batchBytesTotal = 0;\n  this._submitting = false;\n\n  if (data) {\n    for (var i in data) {\n      this.fieldsStatic.push([i, data[i]]);\n    }\n  }\n};\n\nForm.prototype = {\n  submit: function submit() {\n    var reqOpt = {};\n    this.fields = this.fieldsStatic.slice();\n    this._submitting = true; //create formData\n\n    if (this.opt.formEl) {\n      this.serializeFormData(this.opt.formEl);\n      this.opt.method = this.opt.formEl.method;\n    }\n\n    reqOpt['method'] = this.opt.method;\n\n    if (this.opt.url) {\n      reqOpt.url = this.opt.url;\n    } else if (this.opt.formEl !== null) {\n      reqOpt.url = this.opt.formEl.action;\n    } else {\n      throw 'URL is not set';\n    }\n\n    if (this.opt.beforeSend && !this.opt.beforeSend.call(this)) {\n      this._submitting = false;\n      return;\n    }\n\n    if (this.hasFiles && this.opt.batch) {\n      this.runBatch(reqOpt);\n      return;\n    }\n\n    reqOpt['loadStart'] = this.frmLoadStartEvent(this);\n    reqOpt['progress'] = this.frmProgressEvent(this);\n    reqOpt['error'] = this.frmErrorEvent(this);\n    reqOpt['abort'] = this.frmAbortEvent(this);\n    reqOpt['load'] = this.frmLoadEvent(this);\n    reqOpt['loadEnd'] = this.frmLoadEndEvent(this);\n    reqOpt['success'] = this.frmSuccessEvent(this);\n\n    if (['post', 'put'].indexOf(this.opt.method) != -1) {\n      //make form data\n      if (this.hasFiles) {\n        reqOpt.data = this.mkFormData(this.fields);\n      } else {\n        reqOpt.data = this.makeQS(this.fields);\n        reqOpt.headers = {\n          'Content-Type': 'application/x-www-form-urlencoded'\n        };\n      }\n    } else {\n      //GET\n      if (this.fields) reqOpt.url += '?' + this.makeQS(this.fields);\n    } //send form\n\n\n    (0, _iAjaxRequest.default)(reqOpt).send();\n  },\n  mkFormData: function mkFormData(fields) {\n    var formData = new FormData();\n\n    for (var i = 0; fields.length > i; i++) {\n      formData.append.apply(formData, fields[i]);\n    }\n\n    return formData;\n  },\n  runBatch: function runBatch(reqOpt) {\n    var files = [],\n        vals = [];\n    this.batchBytesTotal = 0;\n    this.batchBytesLoaded = 0; //split files and other fields\n\n    for (var i = 0; this.fields.length > i; i++) {\n      if (this.fields[i].length == 3) {\n        files.push(this.fields[i]); //filter out batch files\n\n        this.batchBytesTotal += this.fields[i][1].size;\n      } else vals.push(this.fields[i]);\n    }\n\n    if (this.batchStartEvent(files, vals, this.batchBytesTotal) === false) {\n      this._submitting = false;\n      return;\n    }\n\n    asyncLoop(files.length, function (loop) {\n      var data = vals.concat([]),\n          lI = loop.iteration();\n      data.push(files[lI]);\n      reqOpt['data'] = this.mkFormData(data);\n      reqOpt['loadStart'] = this.frmLoadStartEvent(this, lI);\n      reqOpt['progress'] = this.frmProgressEvent(this, lI);\n      reqOpt['error'] = this.frmErrorEvent(this, lI);\n      reqOpt['abort'] = this.frmAbortEvent(this, lI);\n      reqOpt['load'] = this.frmLoadEvent(this, lI);\n      reqOpt['success'] = this.frmSuccessEvent(this, lI);\n\n      reqOpt['loadEnd'] = function () {\n        if (this.frmLoadEndEvent(this, lI).apply(this, arguments) !== false) loop.next();\n      }.bind(this); //send file\n\n\n      (0, _iAjaxRequest.default)(reqOpt).send();\n    }.bind(this), function () {\n      //everything done\n      this.batchDoneEvent();\n    }.bind(this));\n  },\n  frmLoadStartEvent: function frmLoadStartEvent(ctx, batch) {\n    return function (e, xhr) {\n      if (ctx.opt.loadStart) ctx.opt.loadStart(ctx, e, xhr, batch);\n    };\n  },\n  frmProgressEvent: function frmProgressEvent(ctx, batch) {\n    return function (loaded, total, e, xhr) {\n      if (ctx.opt.progress) ctx.opt.progress(loaded, total, ctx, e, xhr, batch);\n    };\n  },\n  frmErrorEvent: function frmErrorEvent(ctx, batch) {\n    return function (error, e, xhr, data) {\n      ctx.opt.error(error, ctx, e, xhr, data, batch);\n    };\n  },\n  frmAbortEvent: function frmAbortEvent(ctx, batch) {\n    return function (e, xhr) {\n      if (ctx.opt.abort) ctx.opt.abort(ctx, e, xhr, batch);\n    };\n  },\n  frmLoadEvent: function frmLoadEvent(ctx, batch) {\n    return function (e, xhr, res) {\n      if (ctx.opt.load) ctx.opt.load(ctx, e, xhr, res, batch);\n    };\n  },\n  frmSuccessEvent: function frmSuccessEvent(ctx, batch) {\n    return function (data, e, xhr) {\n      ctx.opt.success(data, ctx, e, xhr, batch);\n    };\n  },\n  frmLoadEndEvent: function frmLoadEndEvent(ctx, batch) {\n    return function (e, xhr) {\n      if (ctx.opt.loadEnd) return ctx.opt.loadEnd(ctx, e, xhr, batch);\n    };\n  },\n  // batch EVENTs\n  batchStartEvent: function batchStartEvent() {\n    //get fields, files list\n    if (this.opt.batchStart) return this.opt.batchStart.apply(this, arguments);\n    return true;\n  },\n  batchDoneEvent: function batchDoneEvent() {\n    if (this.opt.batchDone) return this.opt.batchDone.apply(this, arguments);\n  },\n  append: function append() {\n    if (_typeof(arguments[1]) == 'object') this.hasFiles = true;\n    this['fields' + (this._submitting ? '' : 'Static')].push(arguments);\n  },\n  set: function set(name, value) {\n    var f = 'fields' + (this._submitting ? '' : 'Static'); //check if exists\n\n    for (var i = 0, al = this[f].length; i < al; i++) {\n      if (this[f][i][0] == name) {\n        this[f][i] = arguments;\n        return;\n      }\n    }\n\n    this[f].push(arguments);\n  },\n  delete: function _delete(name, value) {\n    var f = 'fields' + (this._submitting ? '' : 'Static');\n\n    for (var i = 0, al = this[f].length; i < al; i++) {\n      if (this[f][i][0] == name && (!value || this[f][i][1] == value)) {\n        this[f].splice(i, 1);\n      }\n    }\n\n    return true;\n  },\n  get: function get(name) {\n    var f = 'fields' + (this._submitting ? '' : 'Static');\n\n    for (var i = 0, al = this[f].length; i < al; i++) {\n      if (this[f][i][0] == name) {\n        return this[f][i][1];\n      }\n    }\n  },\n  getAll: function getAll(name) {\n    var res = [],\n        f = 'fields' + (this._submitting ? '' : 'Static');\n\n    for (var i = 0, al = this[f].length; i < al; i++) {\n      if (this[f][i][0] == name) {\n        res.push(this[f][i][1]);\n      }\n    }\n\n    return res;\n  },\n  has: function has(name) {\n    var f = 'fields' + (this._submitting ? '' : 'Static');\n\n    for (var i = 0, al = this.fieds.length; i < al; i++) {\n      if (this[f][i][0] == name) return true;\n    }\n\n    return false;\n  },\n  serializeFormData: function serializeFormData(frmEl) {\n    if (!frmEl || frmEl.tagName !== 'FORM') throw 'Element is not form';\n    var i, e;\n\n    for (i = frmEl.elements.length - 1; i >= 0; i--) {\n      e = frmEl.elements[i];\n      if (e.name == '') continue;\n\n      switch (e.nodeName) {\n        case 'INPUT':\n          switch (e.type) {\n            case 'file':\n              if (['post', 'put'].indexOf(frmEl.method) == -1) throw 'You cant send files with GET method.';\n              if (e.files.length == 0) continue;\n\n              for (var fi = 0; fi < e.files.length; fi++) {\n                this.append(e.name, e.files[fi], e.files[fi].name);\n              }\n\n              break;\n\n            case 'checkbox':\n            case 'radio':\n              if (!e.checked) continue;\n\n            default:\n              this.append(e.name, e.value);\n              break;\n          }\n\n          break;\n\n        case 'TEXTAREA':\n          this.append(e.name, e.value);\n          break;\n\n        case 'SELECT':\n          if (e.type == 'select-one') {\n            this.append(e.name, e.value);\n            break;\n          } //multiple select\n\n\n          for (j = e.options.length - 1; j >= 0; j = j - 1) {\n            if (!e.options[j].selected) continue;\n            this.append(e.name, e.options[j].value);\n          }\n\n          break;\n      }\n    }\n  },\n  makeQS: function makeQS(data) {\n    var rqs = [];\n\n    for (var i = 0; data.length > i; i++) {\n      if (data[i][1] instanceof Array) {\n        for (var j in data[i][1]) {\n          rqs.push(data[i][0] + '=' + encodeURIComponent(data[i][1][j]));\n        }\n\n        continue;\n      }\n\n      rqs.push(data[i][0] + '=' + encodeURIComponent(data[i][1]));\n    }\n\n    return rqs.join('&');\n  }\n};\n\nfunction _default(frm, opt) {\n  //get form by selector\n  if (typeof frm == 'string' && (!(opt.formEl = document.querySelector(frm)) || opt.formEl.tagName != 'FORM')) throw 'Form element not found or it is not a FORM!'; //frm is element or data\n\n  if (_typeof(frm) == 'object') {\n    if (frm instanceof Node) {\n      if (frm.tagName == 'FORM') opt.formEl = frm;else throw 'Element is not FORM node.';\n    } else var data = frm;\n  }\n\n  var f = new Form(opt, data);\n  if (opt.formEl) opt.formEl.addEventListener('submit', function (e) {\n    e.preventDefault();\n    f.submit();\n  });\n  return f;\n}\n\nmodule.exports = exports[\"default\"];\n\n//# sourceURL=webpack://iAjax/./src/iAjax-Form.js?");

/***/ }),

/***/ "./src/iAjax-HttpHelpersBase.js":
/*!**************************************!*\
  !*** ./src/iAjax-HttpHelpersBase.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\n\nvar _iAjaxRequest = _interopRequireDefault(__webpack_require__(/*! ./iAjax-Request */ \"./src/iAjax-Request.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\n//params: url, data, success, error, format\nfunction _default(method, url) {\n  if (['get', 'post', 'put', 'delete'].indexOf(method.toLowerCase()) == -1) {\n    throw 'Method ' + method + ' not supported';\n  }\n\n  if (typeof url != 'string') {\n    throw 'URL must be string';\n  } //convert arguments object to array\n\n\n  var args = Array.prototype.slice.call(arguments),\n      opt = {\n    method: args.shift(),\n    url: args.shift()\n  }; //data\n\n  if (args.length > 0 && _typeof(args[0]) == 'object') opt['data'] = args.shift(); //success\n\n  if (args.length > 0 && typeof args[0] == 'function') opt['success'] = args.shift(); //error\n\n  if (args.length > 0 && typeof args[0] == 'function') opt['error'] = args.shift(); //format\n\n  if (args.length > 0 && typeof args[0] == 'string') opt['format'] = args.shift();\n  var req = (0, _iAjaxRequest.default)(opt);\n  req.send();\n  return req;\n}\n\nmodule.exports = exports[\"default\"];\n\n//# sourceURL=webpack://iAjax/./src/iAjax-HttpHelpersBase.js?");

/***/ }),

/***/ "./src/iAjax-Request.js":
/*!******************************!*\
  !*** ./src/iAjax-Request.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\n\nvar _iAjaxResponseParser = _interopRequireDefault(__webpack_require__(/*! ./iAjax-ResponseParser */ \"./src/iAjax-ResponseParser.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Request = function Request(opt) {\n  this.opt = Object.assign({\n    method: 'GET',\n    async: true,\n    data: null,\n    headers: null,\n    jsonp: false,\n    baseUrl: '',\n    withCredentials: false,\n    success: function success(data, e, xhr) {},\n    error: function error(type, ev, xhr, data) {\n      throw \"Error \" + type;\n    }\n  }, this.baseOpt, opt);\n};\n\nRequest.prototype = {\n  baseOpt: {},\n  send: function send() {\n    if (!this.opt.url) throw 'URL parameter for Request is not set.'; //check domain - if use JSONP\n\n    var finalUrl = (this.opt.url.indexOf('//') != -1 ? '' : this.opt.baseUrl) + this.opt.url; //add data to url for GET and DELETE method\n\n    if (this.opt.data !== null && Object.prototype.toString.apply(this.opt.data) == '[object Object]') {\n      var qsData = [],\n          uData = this.opt.data;\n\n      for (var i in uData) {\n        if (uData[i] instanceof Array) {\n          for (var j in uData[i]) {\n            qsData.push(encodeURIComponent(i) + '=' + encodeURIComponent(uData[i][j]));\n          }\n\n          continue;\n        }\n\n        qsData.push(encodeURIComponent(i) + '=' + encodeURIComponent(uData[i]));\n      }\n\n      if (['get', 'delete'].indexOf(this.opt.method.toLowerCase()) != -1) finalUrl = finalUrl + (finalUrl.indexOf('?') > -1 ? '&' : '?') + qsData.join('&');else this.opt.data = qsData.join('&');\n    }\n\n    if (!this.opt.jsonp) {\n      //use XMLHttpRequest\n      this.sendXMLHttpRequest(finalUrl);\n    } else if (this.opt.method.toLowerCase() == 'get') {\n      //use JSONP\n      this.sendJSONPRequest(finalUrl);\n    } else {\n      throw 'This request cant be done!';\n    }\n  },\n  sendXMLHttpRequest: function sendXMLHttpRequest(finalUrl) {\n    //create and init xhr object\n    this.xhr = new XMLHttpRequest();\n    this.xhr.onreadystatechange = this.xhrOnreadyStateChangeEvent;\n    var xArgs = [this.opt.method, finalUrl, this.opt.async];\n\n    if (this.opt.user) {\n      xArgs.push(this.opt.user);\n      if (this.opt.password) xArgs.push(this.opt.password);\n    }\n\n    this.xhr.open.apply(this.xhr, xArgs);\n    if (this.opt.withCredentials) this.xhr.withCredentials = true; //set headers\n\n    if (this.opt.headers) {\n      var hs = this.opt.headers;\n\n      for (var i in hs) {\n        this.xhr.setRequestHeader(i, hs[i]);\n      }\n    }\n\n    this.xhr.addEventListener('loadstart', this.xhrLoadStartEvent.bind(this));\n    this.xhr.addEventListener('progress', this.xhrProgressEvent.bind(this));\n    this.xhr.addEventListener('error', this.xhrErrorEvent.bind(this));\n    this.xhr.addEventListener('timeout', this.xhrTimeoutEvent.bind(this));\n    this.xhr.addEventListener('abort', this.xhrAbortEvent.bind(this));\n    this.xhr.addEventListener('load', this.xhrLoadEvent.bind(this));\n    this.xhr.addEventListener('loadend', this.xhrLoadEndEvent.bind(this)); //send\n\n    this.xhr.send(this.opt.data != null && ['post', 'put'].indexOf(this.opt.method.toLowerCase()) !== -1 ? this.opt.data : null);\n  },\n  setConfig: function setConfig(c) {\n    this.opt = Object.assign(this.opt, c);\n    return this;\n  },\n  //XHR Events\n  xhrOnreadyStateChangeEvent: function xhrOnreadyStateChangeEvent() {//is this needed in modern browsers?\n  },\n  xhrLoadStartEvent: function xhrLoadStartEvent(e) {\n    if (this.opt.loadStart) this.opt.loadStart(e, this.xhr);\n  },\n  xhrProgressEvent: function xhrProgressEvent(e) {\n    if (this.opt.progress) {\n      if (e.lengthComputable) this.opt.progress(e.loaded, e.total, e, this.xhr);else this.opt.progress(false, e.total, e, this.xhr);\n    }\n  },\n  xhrErrorEvent: function xhrErrorEvent(e) {\n    this.opt.error('error', e, this.xhr);\n  },\n  xhrTimeoutEvent: function xhrTimeoutEvent(e) {\n    this.opt.error('timeout', e, this.xhr);\n  },\n  xhrAbortEvent: function xhrAbortEvent(e) {\n    if (this.opt.abort) this.opt.abort(e, this.xhr);\n  },\n  xhrLoadEvent: function xhrLoadEvent(e) {\n    var response = (0, _iAjaxResponseParser.default)(this.xhr);\n    if (this.opt.load) this.opt.load(e, this.xhr, response);\n    if (!this.beforeProcessRequest(this.xhr)) return;\n    if (this.xhr.status < 400) this.opt.success(response, e, this.xhr);else this.opt.error('http', e, this.xhr, response);\n  },\n  xhrLoadEndEvent: function xhrLoadEndEvent(e) {\n    if (this.opt.loadEnd) this.opt.loadEnd(e, this.xhr);\n  },\n  beforeProcessRequest: function beforeProcessRequest(xhr) {\n    return true;\n  },\n  sendJSONPRequest: function sendJSONPRequest(finalUrl) {\n    if (!this.opt.callbackName) {\n      this.opt.callbackName = 'callback_' + Math.round(100000 * Math.random());\n    }\n\n    if (!this.opt.timeout) {\n      this.opt.timeout = 10000;\n    }\n\n    finalUrl = finalUrl + (finalUrl.indexOf('?') > -1 ? '&' : '?') + 'callback=' + this.opt.callbackName;\n    var script = document.createElement('script');\n    script.type = 'text/javascript';\n    script.async = true;\n    script.src = finalUrl;\n    var timeoutID = window.setTimeout(function () {\n      this.opt.error('timeout');\n      clearRequest.apply(this);\n    }.bind(this), this.opt.timeout);\n\n    var clearRequest = function clearRequest() {\n      window.clearTimeout(timeoutID);\n      script.parentNode.removeChild(script);\n      delete window[this.opt.callbackName];\n    }; //add success\n\n\n    window[this.opt.callbackName] = function (data) {\n      this.opt.success(data);\n      clearRequest.apply(this);\n    }.bind(this); //add error\n\n\n    script.addEventListener('error', function (e) {\n      this.opt.error('error', e);\n      clearRequest.apply(this);\n    }.bind(this));\n    (document.getElementsByTagName('head')[0] || document.body).appendChild(script);\n  }\n};\n\nfunction _default(opt) {\n  if (opt === 'prototype') {\n    if (typeof arguments[2] == 'undefined') return Request.prototype[arguments[1]];\n    Request.prototype[arguments[1]] = arguments[2];\n    return;\n  }\n\n  return new Request(opt);\n}\n\nmodule.exports = exports[\"default\"];\n\n//# sourceURL=webpack://iAjax/./src/iAjax-Request.js?");

/***/ }),

/***/ "./src/iAjax-ResponseParser.js":
/*!*************************************!*\
  !*** ./src/iAjax-ResponseParser.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar parsers = {\n  'application/json,text/json': function applicationJsonTextJson(inp) {\n    return JSON.parse(inp);\n  },\n  'application/xml,text/xml': function applicationXmlTextXml(inp) {\n    var parser = new DOMParser();\n    return parser.parseFromString(inp, 'text/xml');\n  }\n};\n\nfunction _default(xhr) {\n  if (typeof xhr == 'string') {\n    if (xhr == 'addParser') {\n      parsers[arguments[1]] = arguments[2];\n      return;\n    }\n  }\n\n  var ct = xhr.getResponseHeader('Content-Type');\n  if (ct) ct = ct.split(';')[0];\n\n  for (var i in parsers) {\n    var mimes = i.split(',');\n\n    if (mimes.indexOf(ct) > -1) {\n      return parsers[i](xhr.responseText);\n    }\n  }\n\n  return xhr.responseText;\n}\n\nmodule.exports = exports[\"default\"];\n\n//# sourceURL=webpack://iAjax/./src/iAjax-ResponseParser.js?");

/***/ }),

/***/ "./src/iAjax.js":
/*!**********************!*\
  !*** ./src/iAjax.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _iAjaxRequest = _interopRequireDefault(__webpack_require__(/*! ./iAjax-Request */ \"./src/iAjax-Request.js\"));\n\nvar _iAjaxForm = _interopRequireDefault(__webpack_require__(/*! ./iAjax-Form */ \"./src/iAjax-Form.js\"));\n\nvar _iAjaxHttpHelpersBase = _interopRequireDefault(__webpack_require__(/*! ./iAjax-HttpHelpersBase */ \"./src/iAjax-HttpHelpersBase.js\"));\n\nvar _iAjaxResponseParser = _interopRequireDefault(__webpack_require__(/*! ./iAjax-ResponseParser */ \"./src/iAjax-ResponseParser.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//Main iAjax container\n__webpack_require__(/*! ./iAjax-Core */ \"./src/iAjax-Core.js\");\n\nvar iAjax = {\n  request: _iAjaxRequest.default,\n  responseParser: _iAjaxResponseParser.default,\n  form: _iAjaxForm.default\n}; // generate helpers\n\n['get', 'post', 'put', 'delete'].forEach(function (v) {\n  iAjax[v] = function () {\n    var args = Array.prototype.slice.call(arguments);\n    args.unshift(v);\n    return _iAjaxHttpHelpersBase.default.apply(null, args);\n  };\n});\nvar _default = iAjax; // module.exports = iAjax;\n\nexports.default = _default;\nmodule.exports = exports[\"default\"];\n\n//# sourceURL=webpack://iAjax/./src/iAjax.js?");

/***/ })

/******/ });
});