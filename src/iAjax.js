//Main iAjax container

import request from './iAjax-Request';
import form from './iAjax-Form';
import httpHelpersBase from './iAjax-HttpHelpersBase';
import responseParser from './iAjax-ResponseParser';

require('./iAjax-Core');

const iAjax = {
	request,
	responseParser,
	form
};

// generate helpers
['get','post','put','delete'].forEach(function (v) {
	iAjax[v] = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(v);
		return httpHelpersBase.apply(null, args);
	}
});

//export default iAjax;
module.exports = iAjax;
