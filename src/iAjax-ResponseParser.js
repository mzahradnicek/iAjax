
let parsers = {
	'application/json,text/json': function(inp) {
		return JSON.parse(inp);
	},
	'application/xml,text/xml': function(inp) {
		let parser = new DOMParser();
		return parser.parseFromString(inp, 'text/xml');
	}
}

export default function(xhr) {
	if (typeof xhr == 'string') {
		if (xhr == 'addParser') {
			parsers[arguments[1]] = arguments[2];
			return;
		}
	}

	for(var i in parsers) {
		var mimes = i.split(','), rType = xhr.getResponseHeader('Content-Type').split(';');
		if (mimes.indexOf(rType[0]) > -1) {
			return parsers[i](xhr.responseText);
		}
	}

	return xhr.responseText;
}
