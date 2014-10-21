// create angular module (with dependencies array)
var app = function(window) {

  var app = angular.module('Repository', ['angularBootstrapNavTree','ngAnimate','ngSanitize','mgcrea.ngStrap','xeditable']);  

	app.run(function(editableOptions) {
	  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	});

	app.config(function($dropdownProvider) {
	  angular.extend($dropdownProvider.defaults, {
	    html: true
	  });
	});

  return app;

}(window);