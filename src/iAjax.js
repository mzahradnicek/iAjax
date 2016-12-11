//Main iAjax container

import request from './iAjax-Request';
import httpHelpersBase from './iAjax-HttpHelpersBase';
import jsonp from './iAjax-Jsonp';

require('./iAjax-Core');

var iAjax = {
	request,
	jsonp,
	get: function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('get');
		return httpHelpersBase.apply(null, args);
	},
	post: function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('post');
		return httpHelpersBase.apply(null, args);
	},
	put: function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('put');
		return httpHelpersBase.apply(null, args);
	},
	delete: function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('delete');
		return httpHelpersBase.apply(null, args);
	}
};

module.exports = iAjax;
