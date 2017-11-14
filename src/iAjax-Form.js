import iAjaxRequest from './iAjax-Request';

// very nice async loop from stack overflow - maybe user Promises loop in future
const asyncLoop = function(iterations, func, callback) {
	let index = 0, done = false;
	let loop = {
		next: function() {
			if (done) {
				return
			}

			if (index < iterations) {
				index++;
				func(loop)
			} else {
				done = true
				callback()
			}
		},
		iteration: function() {
			return index - 1;
		},
		break: function() {
			done = true
			callback()
		}
	}

	loop.next()
	return loop
}

const Form = function(opt, data) {
	this.opt = Object.assign({
		formEl	: null,
		method 	: 'post',
		batch	: false,
		success	: function(data, form, e, xhr) {
		},
		error	: function(type, form, ev, xhr, data) {
			throw "Error "+type;
		}
	}, opt);

	this.fieldsStatic = [];
	this.fields = [];
	this.hasFiles = false;
	this.batchBytesLoaded = 0;
	this.batchBytesTotal = 0;
	this._submitting = false;

	if (data) {
		for(var i in data) this.fieldsStatic.push([ i, data[i] ]);
	}
}

Form.prototype = {
	submit	: function() {
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
			reqOpt.url = this.opt.url
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

		if (['post','put'].indexOf(this.opt.method) != -1) {	//make form data
			if (this.hasFiles) {
				reqOpt.data = this.mkFormData(this.fields);
			} else {
				reqOpt.data = this.makeQS(this.fields);
				reqOpt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
			}
		} else {	//GET
			if (this.fields) reqOpt.url += '?'+this.makeQS(this.fields);
		}

		//send form
		iAjaxRequest(reqOpt).send();
	},
	mkFormData: function(fields) {
		var formData = new FormData();

		for(var i = 0;fields.length > i;i++) {
			formData.append.apply(formData, fields[i]);
		}

		return formData;
	},
	runBatch: function(reqOpt) {
		var files = [], vals = [];
		this.batchBytesTotal = 0;
		this.batchBytesLoaded = 0;

		//split files and other fields
		for(var i = 0;this.fields.length > i;i++) {
			if (this.fields[i].length == 3) {
				files.push(this.fields[i]);		//filter out batch files
				this.batchBytesTotal += this.fields[i][1].size
			} else vals.push(this.fields[i]);
		}

		if (this.batchStartEvent(files, vals, this.batchBytesTotal) === false) {
			this._submitting = false;
			return;
		}

		asyncLoop(files.length, function(loop) {
			var data = vals.concat([ ]);
			data.push(files[loop.iteration()]);

			reqOpt['data'] = this.mkFormData(data);

			reqOpt['loadEnd'] = function() {
				if (this.frmLoadEndEvent.apply(this, arguments) !== false) loop.next();
			}.bind(this);

			//send file
			iAjaxRequest(reqOpt).send();
		}.bind(this), function() {
			//everything done
			this.batchDoneEvent();
		}.bind(this))
	},
	frmLoadStartEvent : function(e, xhr) {
		if (this.opt.loadStart) this.opt.loadStart(this, e, xhr);
	},
	frmProgressEvent: function(loaded, total, e, xhr) {
		if (this.opt.progress) this.opt.progress(loaded, total, this, e, xhr);
	},
	frmErrorEvent: function(error, e, xhr, data) {
		this.opt.error(error, this, e, xhr, data);
	},
	frmAbortEvent: function(e, xhr) {
		if (this.opt.abort) this.opt.abort(this, e, xhr);
	},
	frmLoadEvent: function(e, xhr) {
		if (this.opt.load) this.opt.load(this, e, xhr);
	},
	frmSuccessEvent: function(data, e, xhr) {
		this.opt.success(data, this, e, xhr);
	},
	frmLoadEndEvent: function(e, xhr) {
		if (this.opt.loadEnd) return this.opt.loadEnd(this, e, xhr);
	},

	// batch EVENTs
	batchStartEvent: function() {
		//get fields, files list
		if (this.opt.batchStart) return this.opt.batchStart.apply(this, arguments);
		return true;
	},
	batchDoneEvent: function() {
		if (this.opt.batchDone) return this.opt.batchDone.apply(this, arguments);
	},
	append	: function() {
		if (typeof arguments[1] == 'object') this.hasFiles = true;
		this['fields'+(this._submitting ? '':'Static')].push(arguments);
	},
	set		: function(name, value) {
		var f = 'fields'+(this._submitting ? '':'Static');
		//check if exists
		for(var i = 0,al = this[f].length;i < al;i++) {
			if (this[f][i][0] == name) {
				this[f][i] = arguments;
				return;
			}
		}
		this[f].push(arguments);
	},
	delete	: function(name, value) {
		var f = 'fields'+(this._submitting ? '':'Static');
		for(var i = 0,al = this[f].length;i < al;i++) {
			if (this[f][i][0] == name && (!value || this[f][i][1] == value)) {
				this[f].splice(i, 1);
			}
		}
		return true;
	},
	get		: function(name) {
		var f = 'fields'+(this._submitting ? '':'Static');
		for(var i = 0,al = this[f].length;i < al;i++) {
			if (this[f][i][0] == name) {
				return this[f][i][1];
			}
		}
	},
	getAll	: function(name) {
		var res = [], f = 'fields'+(this._submitting ? '':'Static');
		for(var i = 0,al = this[f].length;i < al;i++) {
			if (this[f][i][0] == name) {
				res.push(this[f][i][1]);
			}
		}
		return res;
	},
	has		: function(name) {
		var f = 'fields'+(this._submitting ? '':'Static');
		for(var i = 0,al = this.fieds.length;i < al;i++) {
			if (this[f][i][0] == name) return true;
		}
		return false;
	},
	serializeFormData: function(frmEl) {
		if (!frmEl || frmEl.tagName !== 'FORM') throw 'Element is not form';

		var i,e;

		for (i = frmEl.elements.length - 1; i>=0; i--) {
			e = frmEl.elements[i];
			if (e.name == '') continue;

			switch (e.nodeName) {
				case 'INPUT':
					switch (e.type) {
						case 'file':
							if ([ 'post','put' ].indexOf(frmEl.method) == -1) throw 'You cant send files with GET method.';
							if (e.files.length == 0) continue;
							for(var fi = 0;fi < e.files.length;fi++) this.append(e.name, e.files[fi], e.files[fi].name);
						break;

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
					for (j = e.options.length - 1; j >= 0; j = j -1) {
						if (!e.options[j].selected) continue;
						this.append(e.name, e.options[j].value);
					}
				break;
			}
		}
	},
	makeQS: function(data) {
		var rqs = [];
		for(var i = 0;data.length > i;i++) {
			if (data[i][1] instanceof Array) {
				for(var j in data[i][1])
					rqs.push(data[i][0]+'='+encodeURIComponent(data[i][1][j]));
				continue;
			}

			rqs.push(data[i][0]+'='+encodeURIComponent(data[i][1]));
		}

		return rqs.join('&');
	}
}

export default function(frm, opt) {
	//get form by selector
	if (typeof frm == 'string' && (!(opt.formEl = document.querySelector(frm)) || opt.formEl.tagName != 'FORM'))
		throw 'Form element not found or it is not a FORM!';
	
	//frm is element or data
	if (typeof frm == 'object') {
		if (frm instanceof Node) {
			if (frm.tagName == 'FORM') opt.formEl = frm;
				else throw 'Element is not FORM node.';
		} else var data = frm;
	}

	var f = new Form(opt, data);

	if (opt.formEl) opt.formEl.addEventListener('submit', function(e) {
		e.preventDefault();
		f.submit();
	});

	return f;
}
