//Main iAjax container

import request from './iAjax-Request';
import httpHelpersBase from './iAjax-HttpHelpersBase';
import responseParser from './iAjax-ResponseParser';

require('./iAjax-Core');

var iAjax = {
	request,
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
	},
	responseParser
};

module.exports = iAjax;
