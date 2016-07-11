'use strict';

angular
	.module('titi', [
	  'ngRoute',
	  'ngCookies',
		'ngMask',
		'ngMessages',
		'ngCpfCnpj'
  ])
  .config(routesConfig)
  .config(['$httpProvider', resetHeaders]);

function routesConfig($routeProvider) {
  $routeProvider
    .when('/contact', {
      templateUrl: 'views/static/contact/contact.html'
    })
    .when('/faq', {
      templateUrl: 'views/static/faq/faq.html'
    })
    .when('/terms-of-use', {
      templateUrl: 'views/static/terms-of-use.html'
    })
    .when('/about', {
      templateUrl: 'views/static/about.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}

function resetHeaders($httpProvider) {
  //Reset headers to avoid OPTIONS request (aka preflight)
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
}
