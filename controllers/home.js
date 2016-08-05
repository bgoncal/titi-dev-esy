angular
    .module('titi')
    .controller('HomeController', ['$location', 'helperService', '$cookies', '$window', HomeController])
    .config(['$routeProvider', routes]);

function routes($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'Home'
        });
}

function HomeController($location, helperService, $cookies, $window) {
    var vm = this;

    vm.links = helperService.linkOptions;

    vm.partners = helperService.partnerOptions;

    vm.submitForm = submitForm;

    function submitForm(data) {
        var redirectLink = '/search-partners/' + data.cep + '/' + data.selectedPartner.id;
        $location.path(redirectLink);
    }
    console.log($location.$$path);
	if($location.$$path == '/') {
    vm.type = 2;
		// checks if user is logged in
	  var cookies = $cookies.getObject('globals');
	  if (cookies) {
	    if (cookies.currentUser.perfilID == vm.type) {
	      // redirects to index page according to the user type
	      //var redirectLoggedUser = '/search?refresh=1';
	      //$location.path(redirectLoggedUser);
				  $window.location.href = "#/search";
	      return;
	    } else {

	    }
	  }
  }

}
