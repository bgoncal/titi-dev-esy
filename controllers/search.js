angular
	.module('titi')
  .controller('SearchController', ['$cookies','$http', '$window', '$location', 'authService', 'helperService', SearchController])
  .config(['$routeProvider', routes]);

  function routes($routeProvider) {
    $routeProvider
  	  .when('/search', {
  	    templateUrl: 'views/search/index.html',
  	    controller: 'SearchController',
  	    controllerAs: 'Search'
  	  });
  }
  function SearchController($cookies, $http, $window, $location, authService, helperService) {
    var vm = this;
		vm.atuacaoOptions = helperService.partnerOptions;

  }
