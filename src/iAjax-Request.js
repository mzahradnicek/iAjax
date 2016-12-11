
const Request = function(opt) {
	this.opt = Object.assign({
		method	: 'GET',
		async	: true,
		data	: null,
		success	: function(data, e, xhr) {
		},
		error	: function(type, ev, xhr) {
			throw "Error "+type;
		}
	}, opt);
};

Request.prototype = {
	send: function() {
		if (!this.opt.url) throw 'URL parameter for Request is not set.';

		//check domain - if use JSONP
		var a = document.createElement('a'), finalUrl = this.opt.url;
		a.href = this.opt.url;

		//add data to url for GET and DELETE method
		if (this.opt.data !== null && [ 'get', 'delete' ].indexOf(this.opt.method.toLowerCase()) != -1) {
			var urlParams = [], uData = this.opt.data;
			for(var i in uData) urlParams.push(encodeURIComponent(i)+'='+encodeURIComponent(uData[i]));
			finalUrl = finalUrl + (finalUrl.indexOf('?') > -1 ? '&':'?') + urlParams.join('&');
		}

		if (window.location.hostname == a.hostname) {	//use XMLHttpRequest
			this.sendXMLHttpRequest(finalUrl);
		} else if(this.opt.method.toLowerCase() == 'get') {	//use JSONP
			this.sendJSONPRequest(finalUrl);
		} else {
			throw 'This request cant be done!';
		}
	},
	sendXMLHttpRequest: function(finalUrl) {
		//create and init xhr object
		this.xhr = new XMLHttpRequest();

		this.xhr.onreadystatechange = this.xhrOnreadyStateChangeEvent;

		var xArgs = [ this.opt.method, finalUrl, this.opt.async ];

		if (this.opt.user) {
			xArgs.push(this.opt.user);
			if (this.opt.password) xArgs.push(this.opt.password);
		}

		this.xhr.open.apply(this.xhr, xArgs);

		this.xhr.addEventListener('loadstart', this.xhrLoadStartEvent.bind(this));
		this.xhr.addEventListener('progress', this.xhrProgressEvent.bind(this));
		this.xhr.addEventListener('error', this.xhrErrorEvent.bind(this));
		this.xhr.addEventListener('timeout', this.xhrTimeoutEvent.bind(this));
		this.xhr.addEventListener('abort', this.xhrAbortEvent.bind(this));
		this.xhr.addEventListener('load', this.xhrLoadEvent.bind(this));
		this.xhr.addEventListener('loadend', this.xhrLoadEndEvent.bind(this));

		//send
		this.xhr.send(this.opt.data != null && this.opt.method.toLowerCase() == 'post' ? this.opt.data:null);
	},

	setConfig: function(c) {
		this.opt = Object.assign(this.opt, c);
		return this;
	},

	//XHR Events
	xhrOnreadyStateChangeEvent: function() {
		//is this needed in modern browsers?
	},
	xhrLoadStartEvent: function(e) {
		if (this.opt.loadStart) this.opt.loadStart(e, this.xhr);
	},
	xhrProgressEvent: function(e) {
		if (this.opt.progress) {
			if (e.lengthComputable) this.opt.progress(e.loaded, e.total, e, this.xhr);
				else this.opt.progress(false, e.total, e, this.xhr);
		}
	},
	xhrErrorEvent: function(e) {
		this.opt.error('error', e, this.xhr);
	},
	xhrTimeoutEvent: function(e) {
		this.opt.error('timeout', e, this.xhr);
	},
	xhrAbortEvent: function(e) {
		if (this.opt.abort) this.opt.abort(e, this.xhr);
	},
	xhrLoadEvent: function(e) {
		if (this.opt.load) this.opt.load(e, this.xhr);

		if (!this.beforeProcessRequest(this.xhr)) return;

		if (this.xhr.status < 400) this.opt.success(this.xhr.responseText, e, this.xhr);
			else this.opt.error('http', e, this.xhr);
	},
	xhrLoadEndEvent: function(e) {
		if (this.opt.loadEnd) this.opt.loadEnd(e, this.xhr);
	},
	beforeProcessRequest: function(xhr) {
		return true;
	},
	sendJSONPRequest: function(finalUrl) {
		if (!this.opt.callbackName) {
			this.opt.callbackName = 'callback_'+Math.round(100000 * Math.random());
		}

		if (!this.opt.timeout) {
			this.opt.timeout = 10000;
		}

		finalUrl = finalUrl + (finalUrl.indexOf('?') > -1 ? '&':'?') + 'callback=' + this.opt.callbackName;

		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = finalUrl;

		let timeoutID = window.setTimeout(function() {
			this.opt.error('timeout');
			clearRequest.apply(this);
		}.bind(this), this.opt.timeout);

		const clearRequest = function() {
			window.clearTimeout(timeoutID);
			script.parentNode.removeChild(script);
			delete window[this.opt.callbackName];
		};

		//add success
		window[this.opt.callbackName] = function(data) {
			this.opt.success(data);
			clearRequest.apply(this);
		}.bind(this);

		//add error
		script.addEventListener('error', function(e) {
			this.opt.error('http', e);
			clearRequest.apply(this);
		}.bind(this));

		(document.getElementsByTagName('head')[0] || document.body).appendChild(script);
	}
};

export default function(opt) {
	if (opt === 'prototype') {
		if (typeof arguments[2] == 'undefined') return Request.prototype[arguments[1]];
		Request.prototype[arguments[1]] = arguments[2];
		return;
	}

	return new Request(opt);
}
