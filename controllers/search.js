angular
    .module('titi')
    .controller('SearchController', ['$cookies', '$http', '$window', '$location', 'authService', 'helperService', SearchController])
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
    vm.partners = helperService.partnerOptions;
    if (getParameterByName("refresh") == 1) {
        $window.location.href = "#/search?cep=" + getParameterByName('cep') + "&atuacao=" + getParameterByName('atuacao') + "&refresh=0";
    }
    if (getParameterByName("refresh") == 0) {

    }
    vm.loading = true;
    url = "http://titi.net.br/_homolog/relat/pesquisa_completa.php?cep=" + getParameterByName('cep') + "&atuacao=" + getParameterByName('atuacao');
    $http.get(url)
        .then(function(res) {
            console.log('succeess', res);
            vm.loading = false;
            vm.result = res.data;
            console.log(vm.result);
        }, function(err) {
            console.log('error', err);
            vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
            vm.loading = false;
        });

    vm.submitForm = submitForm;

    function submitForm(data) {
        $window.location.href = "#/search?cep=" + data.cep + "&atuacao=" + data.selectedPartner.id + "&refresh=0";
    }

}
