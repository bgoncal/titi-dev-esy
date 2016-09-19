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
    vm.getStars = getStars;
    vm.partners = helperService.partnerOptions;
    vm.closeSearch = closeSearch;
    var cookies = $cookies.getObject('globals');
    if (cookies) {
    }
    else {
      $window.location.href ="#/users/login/customers/";
    }

    function getStars(number) {
        var arr = [];
        for (var i = 0; i < number; i++) {
            arr.push(i);
        }
        return arr;
    }

    function openSearch() {
        angular.element("#modalSearch").openModal();
    }
    function closeSearch() {
        angular.element("#modalSearch").closeModal();
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
      closeSearch();
        $window.location.href = "#/search?cep=" + data.cep + "&atuacao=" + data.selectedPartner.id + "&pacientesID=" + globals.currentUser.pacientesID;
    }

}
