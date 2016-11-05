angular
    .module('titi')
    .controller('SearchController', ['$cookies', '$http', '$window', '$location', 'authService',  'NgMap','helperService', SearchController])
    .controller('SearchHomeController', ['$cookies', '$http', '$window', '$location', 'authService',  'NgMap','helperService', SearchHomeController])
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
    vm.getEmptyStars = getEmptyStars;
    vm.partners = helperService.partnerOptions;
    vm.closeSearch = closeSearch;
    vm.loading = false;
    var cookies = $cookies.getObject('globals');
    if (cookies) {
    }
    else {
        $window.location.href = "#/users/login/customers?cep=" + getParameterByName('cep') + "&atuacao=" + getParameterByName('atuacao');
    }

    function getStars(number) {
        number = Math.floor(number);
        var arr = [];
        for (var i = 0; i < number; i++) {
            arr.push(i);
        }
        return arr;
    }

    function getEmptyStars(number) {
        number = (5 - Math.floor(number));
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

    if (globals.currentUser.pacientesID != null) {
        url = helperService.backendUrl + "/relat/pesquisa_completa.php?cep=" + getParameterByName('cep') + "&atuacao=" + getParameterByName('atuacao') + "&pacientesID=" + globals.currentUser.pacientesID;
        vm.loading = true;
        $http.get(url)
            .then(function (res) {
                console.log('succeess', res);
                vm.loading = false;
                vm.result = res.data;
                vm.loading = false;
                vm.location = res.data[vm.result.length - 1];
                for(var i=0;i<vm.result.length;i++) {
                  if(vm.result[i].foto != "") {
                    vm.result[i].foto = "data:image/png;base64," + vm.result[i].foto;
                  }
                }
                console.log(vm.location);
                console.log(vm.result);
            }, function (err) {
              vm.loading = false;
                console.log('error', err);
            });
    }
    else {
        $window.alert("Desculpe, essa pesquisa só pode ser realizada por um perfil de Paciente Cliente. Obrigado");
        $window.location.href = "#/";
    }


    vm.submitForm = submitForm;

    function submitForm(data) {
      closeSearch();
        $window.location.href = "#/search?cep=" + data.cep + "&atuacao=" + data.selectedPartner.id + "&pacientesID=" + globals.currentUser.pacientesID;
    }

}

function SearchHomeController($cookies, $http, $window, $location, authService, NgMap, helperService) {
  var vm = this;

  vm.submitForm = submitForm;

  function submitForm(form) {

    var data = angular.copy(form);
    console.log(data);
    var redirectLink = '/search-partners/' + data.cep + '/0';
    $location.path(redirectLink);
  }

  console.log("Hello World");
}
