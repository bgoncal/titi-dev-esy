angular
	.module('titi')
  .controller('SearchController', ['$cookies','$http', '$window', '$location', 'authService', SearchController])
	.controller('SearchCepController', ['$cookies','$http', '$window', '$location', 'authService', SearchCepController])
	.controller('SearchRedirectController', ['$cookies','$http', '$window', '$location', 'authService', SearchRedirectController])
  .config(['$routeProvider', routes]);

  function routes($routeProvider) {
    $routeProvider
  	  .when('/search', {
  	    templateUrl: 'views/search/index.html',
  	    controller: 'SearchController',
  	    controllerAs: 'Search'
  	  })
			.when('/redirect', {
  	    templateUrl: 'views/search/redirect.html',
  	    controller: 'SearchRedirectController',
  	    controllerAs: 'Search'
  	  })
			.when('/search/:cep', {
  	    templateUrl: 'views/search/index.html',
  	    controller: 'SearchCepController',
  	    controllerAs: 'Search'
  	  });
  }
  function SearchController($cookies, $http, $window, $location, authService) {
    var vm = this;

  }
	function SearchCepController($cookies, $http, $window, $location, authService) {

	}
	function SearchRedirectController($cookies, $http, $window, $location, authService) {

	}
