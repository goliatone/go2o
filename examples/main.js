/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'go2o': 'go2o'
    }
});

define(['go2o', 'jquery'], function (Go2o, $) {
    console.log('Loading');
	var go2o = new Go2o();
	go2o.init();
});