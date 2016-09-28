angular
    .module('titi')
    .controller('HomeController', ['$location', 'helperService', '$cookies', '$window','$http', HomeController])
    .config(['$routeProvider', routes]);

function routes($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'Home'
        });
}

function HomeController($location, helperService, $cookies, $window,$http) {
    var vm = this;
    vm.links = helperService.linkOptions;
    vm.setLoggedMenu = setLoggedMenu;
    vm.partners = helperService.partnerOptions;
    vm.contactModal = contactModal;
    vm.submitContactForm = submitContactForm;

    vm.submitForm = submitForm;

    function submitForm(data) {
        var redirectLink = '/search-partners/' + data.cep + '/' + data.selectedPartner.id;
        $location.path(redirectLink);
    }
    function contactModal() {
      angular.element("#modalContact").openModal();
    }
    function submitContactForm(form) {
      var data = angular.copy(form);

      var url = helperService.backendUrl + '/cadastro/contato.php';

      vm.loading = true;
      $http.post(url, data)
          .then(function(res) {
              console.log('succeess', res);
              vm.loading = false;
              $window.alert('Enviado');
              // Redirect to login
              $location.path('/users/login/customers');
          }, function(err) {
              console.log('error', err);
              vm.errorMessage = err.statusText || 'Ops! Não foi possível enviar';
              $window.alert('Ops! Não foi possível enviar');
              vm.loading = false;
          });
      console.log(data);
    }
    console.log($location.$$path);


    function setLoggedMenu(userType) {
        var cookies = $cookies.getObject('globals');
        if (cookies) {
            if (userType == 2) {
                if (cookies.currentUser.userType == "partners") {
                    return true;
                } else {
                    return false;
                }
            }
            if (userType == 3) {
                if (cookies.currentUser.userType == "customers") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }

        } else {
            return true;
        }
    }
}
