'use strict';

angular
    .module('titi', [
        'ngRoute',
        'ngCookies',
        'ngMask',
        'ngMessages',
        'ngCpfCnpj',
        'jkAngularRatingStars',
        'ngMap',
        'datePicker',
        'naif.base64',
        'angular.viacep',
				'facebook'
    ])
    .config(routesConfig)
    .config(['$httpProvider', resetHeaders])
		.config(function(FacebookProvider) {
		// Set your appId through the setAppId method or
		// use the shortcut in the initialize method directly.
		FacebookProvider.init('1005064979620683');
 })

 .controller('authenticationCtrl', function($scope, Facebook) {

	 $scope.login = function() {
		 // From now on you can use the Facebook service just as Facebook api says
		 Facebook.login(function(response) {
			 // Do something with response.
		 });
	 };

	 $scope.getLoginStatus = function() {
		 Facebook.getLoginStatus(function(response) {
			 if(response.status === 'connected') {
				 $scope.loggedIn = true;
			 } else {
				 $scope.loggedIn = false;
			 }
		 });
	 };

	 $scope.me = function() {
		 Facebook.api('/me', function(response) {
			 $scope.user = response;
		 });
	 };
 });

function routesConfig($routeProvider) {
    $routeProvider
        .when('/contact', {
            templateUrl: 'views/static/contact/contact.html'
        })
        .when('/faq', {
            templateUrl: 'views/static/faq.html'
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
