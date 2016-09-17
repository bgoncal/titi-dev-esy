angular
    .module('titi')
    .controller('SearchController', ['$cookies', '$http', '$window', '$location', 'authService',  'NgMap','helperService', SearchController])
    .config(['$routeProvider', routes]);

function routes($routeProvider) {
    $routeProvider
        .when('/search', {
            templateUrl: 'views/search/index.html',
            controller: 'SearchController',
            controllerAs: 'Search'
        });
}

function SearchController($cookies, $http, $window, $location, authService, NgMap, helperService) {

    var vm = this;
    vm.openSearch = openSearch;
    vm.partners = helperService.partnerOptions;

    var cookies = $cookies.getObject('globals');
    if (cookies) {
    }
    else {
      $window.location.href ="#/users/login/customers/";
    }


    function openSearch() {
        angular.element("#modalSearch").openModal();
    }
    vm.loading = true;
    var globals = $cookies.getObject('globals');
    url = "http://titi.net.br/_homolog/relat/pesquisa_completa.php?cep=" + getParameterByName('cep') + "&atuacao=" + getParameterByName('atuacao') + "&pacientesID=" + globals.currentUser.pacientesID;
    $http.get(url)
        .then(function(res) {
            console.log('succeess', res);
            vm.loading = false;
            vm.result = res.data;
            vm.location = res.data[vm.result.length -1];
            console.log(vm.location);
            console.log(vm.result);
        }, function(err) {
            console.log('error', err);
            $window.location.reload();
        });



    vm.submitForm = submitForm;

    function submitForm(data) {
        $window.location.href = "#/search?cep=" + data.cep + "&atuacao=" + data.selectedPartner.id + "&pacientesID=" + globals.currentUser.pacientesID;
    }

}
