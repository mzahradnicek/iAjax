
const Form = function(opt, data) {
	this.opt = Object.assign({
		formEl	: null,
		method : 'post',
		success	: function(data, form, e, xhr) {
		},
		error	: function(type, form, ev, xhr) {
			throw "Error "+type;
		}
	}, opt);

	this.fields = data || {};
	this.formData = null;
}

Form.prototype = {
	submit	: function() {
		var reqOpt = {};

		//create formData
		if (this.opt.formEl) {
			this.fields = {};
			if (this.opt.formEl.method == 'post') { //PUT ???
				this.formData = new FormData(this.opt.formEl);
			} else this.serializeFormData(this.opt.formEl);

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

		if (this.fields.length > 0 && this.formData) {
			//add virtual fields to form
			for(var i in this.fields) {
				if (this.fields[i] instanceof Array) {
					for (var j in this.fields[i]) this.formData.append(i, this.fields[i][j]);
					continue;
				}

				this.formData.append(i, this.fields[i]);
			}
		}

		if (this.opt.beforeSend && !this.opt.beforeSend.call(this)) return;

		if (this.formData) {
			reqOpt.data = this.formData ;
			//reqOpt.headers = { 'Content-Type': 'multipart/form-data' };
		} else {
			reqOpt.data = this.fields;
			if (['post','put'].indexOf(this.opt.method) != -1) {
				reqOpt.data = this.makeQS(reqOpt.data);
				reqOpt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
			}
		}

		reqOpt['loadstart'] = this.frmLoadStartEvent.bind(this);
		reqOpt['progress'] = this.frmProgressEvent.bind(this);
		reqOpt['error'] = this.frmErrorEvent.bind(this);
		reqOpt['abort'] = this.frmAbortEvent.bind(this);
		reqOpt['load'] = this.frmLoadEvent.bind(this);
		reqOpt['loadend'] = this.frmLoadEndEvent.bind(this);
		reqOpt['success'] = this.frmSuccessEvent.bind(this);

		//send form
		iAjax.request(reqOpt).send();
	},
	frmLoadStartEvent : function(e, xhr) {
		if (this.opt.loadStart) this.opt.loadStart(this, e, xhr);
	},
	frmProgressEvent: function(loaded, total, e, xhr) {
		if (this.opt.progress) this.opt.progress(loaded, total, this, e, xhr);
	},
	frmErrorEvent: function(error, e, xhr) {
		this.opt.error(error, this, e, xhr);
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
		if (this.opt.loadEnd) this.opt.loadEnd(this, e, xhr);
	},
	append	: function(name, value) {
		if (this.formData) return this.formData.append.apply(this.formData, arguments);

			if (this.fields[name]) {
				if (this.fields[name] instanceof Array) this.fields[name].push(value);
					else this.fields[name] = [ this.fields[name], value ];
			} else this.fields[name] = value;
	},
	set		: function(name, value) {
		if (this.formData) return this.formData.set.apply(this.formData, arguments);
		this.fields[name] = value;
	},
	delete	: function(name) {
		if (this.formData) return this.formData.delete(name);
		delete this.fields[name];
		return true;
	},
	get		: function(name) {
		if (this.formData) return this.formData.get(name);
		if (!this.fields[name]) return null;
		if (this.fields[name] instanceof Array) return this.fields[name];
	},
	getAll	: function(name) {
		if (this.formData) return this.formData.get(name);
		return this.fields[name];
	},
	has		: function(name) {
		if (this.formData) return this.formData.has(name);
			else return this.fields.hasOwnProperty(name);
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
							//make files to blob later
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
		for(var i in data) {
			if (data[i] instanceof Array) {
				for(var j in data [i]) rqs.push(i+'='+encodeURIComponent(data[i][j]));
			} else rqs.push(i+'='+encodeURIComponent(data[i]));
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
