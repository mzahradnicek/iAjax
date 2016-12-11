//iAjax get helper
import request from './iAjax-Request';

//params: url, data, success, error, format
export default function(method, url) {
	if ([ 'get', 'post', 'put', 'delete' ].indexOf(method.toLowerCase())) {
		throw 'Method '+method+' not supported';
	}

	if (typeof url != 'string') {
		throw 'URL must be string'
	}

	//convert arguments object to array
	var args = Array.prototype.slice.call(arguments), opt = { method: args.shift(), url: args.shift() };

	//data
	if (args.length > 0 && typeof args[0] == 'object') 
		opt['data'] = args.shift();

	//success
	if (args.length > 0 && typeof args[0] == 'function')
		opt['success'] = args.shift();

	//error
	if (args.length > 0 && typeof args[0] == 'function')
		opt['error'] = args.shift();

	//format
	if (args.length > 0 && typeof args[0] == 'string')
		opt['format'] = args.shift();

	var req = request(opt);
	req.send();
	return req;
}
