angular
	.module('titi')
  .controller('HomeController', ['$location', 'helperService', HomeController])
  .config(['$routeProvider', routes]);

function routes($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController',
      controllerAs: 'Home'
    });
}

function HomeController($location, helperService) {
  var vm = this;

  vm.links = helperService.linkOptions;

  vm.partners = helperService.partnerOptions;

  vm.submitForm = submitForm;

  function submitForm(data) {
    var redirectLink = '/search-partners/' + data.cep + '/' + data.selectedPartner.id;
    $location.path(redirectLink);
  }
}
