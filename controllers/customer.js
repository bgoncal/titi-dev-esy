angular
    .module('titi')
    .controller('CustomerSignupController', ['$scope', '$http', '$window',
        '$location', 'helperService', CustomerSignupController
    ])
    .controller('CustomerManageController', ['$scope', '$http', '$window',
        '$location', 'helperService', '$cookies', CustomerManageController
    ])
    .controller('CustomerResetController', ['$http', '$window', '$location', '$cookies', 'helperService',
        CustomerResetController
    ])
    .controller('CustomerRateController', ['$http', '$window', '$location', '$cookies', 'helperService', '$scope',
        CustomerRateController
    ])
    .controller('TermsConfirmationController', ['$http', '$window', '$location', '$cookies', 'helperService', '$scope', 'authService', '$rootScope',
        TermsConfirmationController
    ])
    .controller('CustomerController', ['$cookies', '$http', '$window', '$location', 'authService', 'currentSearch', 'helperService', CustomerController])
    .config(['$routeProvider', routes])

function routes($routeProvider) {
    $routeProvider
        .when('/customers', {
            templateUrl: 'views/customers/index.html',
            controller: 'CustomerController',
            controllerAs: 'Customer'
        })
        .when('/customers/rate', {
            templateUrl: 'views/customers/rate.html',
            controller: 'CustomerRateController',
            controllerAs: 'Customer'
        })
        .when('/customers/signup', {
            templateUrl: 'views/customers/signup.html',
            controller: 'CustomerSignupController',
            controllerAs: 'Customer'
        })
        .when('/customers/reset', {
            templateUrl: 'views/customers/change-pass.html',
            controller: 'CustomerResetController',
            controllerAs: 'Customer'
        })
        .when('/termsconf', {
            templateUrl: 'views/customers/terms.html',
            controller: 'TermsConfirmationController',
            controllerAs: 'Customer'
        })
        .when('/customers/manage', {
            templateUrl: 'views/customers/manage-profile.html',
            controller: 'CustomerManageController',
            controllerAs: 'Customer'
        });
}

function CustomerController($cookies, $http, $window, $location, authService, currentSearch, helperService) {
    var vm = this;
    vm.atuacaoOptions = helperService.partnerOptions;
    vm.partners = helperService.partnerOptions;
    var cookies = $cookies.getObject('globals');
    var termos = $cookies.getObject('termos');
    if(termos != 1) {
      var termsLink = '/termsconf';
      $location.path(termsLink);
    }
    vm.username = cookies.currentUser.username;
    url = helperService.backendUrl + '/cadastro/usuario.php';
    data = {
        "usuariosID": cookies.currentUser.usuariosID
    };
    $http.post(url, data)
        .then(function(res) {
            console.log(res);
            vm.data = res.data[0];
        }, function(err) {
            console.log('error', err);
            $window.location.reload();
        });

    var loginLink = '/users/login/customers';
    var manageLink = '/customers/manage';
    var resetPass = '/customers/reset';
    var rateLink = '/customers/rate';

    if (!cookies) {
        $location.path(loginLink);
        return;
    }
    vm.submitForm = submitForm;

    function submitForm(data) {
        $window.location.href = "#/search?cep=" + data.cep + "&atuacao=" + data.selectedPartner.id + "&pacientesID=" + cookies.currentUser.pacientesID;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    vm.username = cookies.currentUser.username;
    vm.logout = logout;
    vm.manage = manage;
    vm.resetpass = resetpass;
    vm.rate = rate;

    function logout() {
        authService.clearCredentials();
        $location.path(loginLink);
    };

    function manage() {
        $location.path(manageLink);
    };

    function resetpass() {
        $location.path(resetPass);
    };

    function rate() {
        $location.path(rateLink);
    };
}

function CustomerSignupController($scope, $http, $window, $location, helperService) {
    var vm = this;

    vm.submitSignupForm = submitSignupForm;

    function submitSignupForm(form) {

        // TODO: submit form to server
        console.log('Customer signup', form);

        var data = angular.copy(form);

        if(data.termos == false || data.termos == null) {
          $window.alert('Por favor aceite os termos de uso.');
          return;
        }


        data.perfilID = '3';
        var url = helperService.backendUrl + '/cadastro/paciente_update.php';

        vm.loading = true;
        $http.post(url, data)
            .then(function(res) {
                console.log('succeess', res);
                vm.loading = false;
                $window.alert('Usuário cadastrado com sucesso. Faça login para continuar.');
                // Redirect to login
                $location.path('/users/login/customers');
            }, function(err) {
                console.log('error', err);
                vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
                $window.alert('Ops! Não foi possível efetuar seu cadastro');
                vm.loading = false;
            });
        console.log(data);
    }

    vm.regexCEP = helperService.regex.CEP;
    vm.regexPhone = helperService.regex.phone;
    vm.regexYear = helperService.regex.year;

    vm.states = helperService.UFOptions;

    vm.reset = function(form) {
        console.log('reset form');
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.Customer.form = angular.copy($scope.master);
    };

}

function CustomerManageController($scope, $http, $window, $location, helperService, $cookies) {
    var vm = this;
    url = helperService.backendUrl + '/cadastro/usuario.php';
    globals = $cookies.getObject('globals');
    data = {
        "usuariosID": globals.currentUser.usuariosID
    };
    $http.post(url, data)
        .then(function(res) {
            console.log(res);
            vm.form = res.data[0];
            vm.form.nascimento = new Date(vm.form.nascimento);
        }, function(err) {
            console.log('error', err);
            $window.location.reload();
        });

    vm.submitManageForm = submitManageForm;

    function submitManageForm(form) {
        // TODO: submit form to server
        console.log('Customer management', form);

        var data = angular.copy(form);

        data.perfilID = '3';
        globals = $cookies.getObject('globals');
        data.usuariosID = globals.currentUser.usuariosID;
        var url = helperService.backendUrl + '/cadastro/paciente_update.php';

        vm.loading = true;
        $http.post(url, data)
            .then(function(res) {
                console.log('succeess', res);
                vm.loading = false;
                $window.alert('Dados alterados com sucesso.');
                // Redirect to login
                $location.path('/users/login/customers');
            }, function(err) {
                console.log('error', err);
                vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
                vm.loading = false;
            });
        console.log(data);
    }

    vm.regexCEP = helperService.regex.CEP;
    vm.regexPhone = helperService.regex.phone;
    vm.regexYear = helperService.regex.year;
    vm.estadoOptions = helperService.UFOptions;

    vm.reset = function(form) {
        console.log('reset form');
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.Customer.form = angular.copy($scope.master);
    };



}

function CustomerResetController($http, $window, $location, $cookies, helperService) {
    var vm = this;
    vm.loading = false;
    vm.submitResetForm = submitResetForm;

    function submitResetForm(form) {
        // TODO: submit data to server
        vm.loading = false;
        var data = angular.copy(form);
        data.perfilID = '3';
        globals = $cookies.getObject('globals');
        data.usuariosID = globals.currentUser.usuariosID;
        var url = helperService.backendUrl + '/cadastro/reset_pass.php';

        vm.loading = true;
        $http.post(url, data)
            .then(function(res) {
                console.log('succeess', res);
                vm.loading = false;
                $window.alert('Senha alterada com sucesso.');
            }, function(err) {
                console.log('error', err);
                vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
                vm.loading = false;
            });
        console.log(data);
    }

    vm.reset = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.Partner.form = angular.copy($scope.master);
    };

}

function CustomerRateController($http, $window, $location, $cookies, helperService, $scope) {
    var vm = this;
    vm.partners = [];
    //vm.getPartnerContact = getPartnerContact;
    vm.getStars = getStars;
    vm.getEmptyStars = getEmptyStars;
    vm.openModal = openModal;
    vm.closeModal = closeModal;
    vm.onRating = onRating;
    vm.submitRateForm = submitRateForm;
    vm.getReviews = getReviews;
    vm.currentRate = "0";
    globals = $cookies.getObject('globals');
    var url = helperService.backendUrl + '/relat/pesquisa_historico.php';
    url = url + '?pacientesID=' + globals.currentUser.pacientesID;
    getReviews();

    function getReviews() {
        vm.loading = true;
        $http.get(url)
            .then(function(res) {
                vm.loading = false;
                vm.partners = res.data || [];
                for (var i = 0; i < vm.partners.length; i++) {
                    if (vm.partners[i].foto != "") {
                        vm.partners[i].foto = 'data:image/png;base64,' + vm.partners[i].foto;
                    }
                }
                console.log(res.data || []);
            }, function(err) {
                console.log('error', err);
                vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
                vm.loading = false;
            });
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

    function openModal(id) {
        angular.element("#modal-" + id).openModal();
        console.log(id);
    }

    function closeModal(id, refresh) {
        angular.element("#modal-" + id).closeModal();
        if (refresh === 1) {
            $window.location.reload();
        }
        console.log(id);
    }

    function onRating(rate) {
        console.log(rate);
        currentRate = rate;
    }

    function submitRateForm(form, especialistasID) {
        console.log('Customer rating', form);
        console.log(especialistasID);
        var data = angular.copy(form);
        data.myclass = currentRate;
        data.pacientesID = globals.currentUser.pacientesID;
        data.especialistasID = especialistasID;
        url = helperService.backendUrl + "/cadastro/usuario_update.php";
        $http.post(url, data)
            .then(function(res) {
                console.log('succeess', res);

                $window.alert('Classificação Enviada');
                // Redirect to login
                closeModal(especialistasID, 1);

            }, function(err) {
                console.log('error', err);
                vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';

            });
        console.log(data);

    }

}

function TermsConfirmationController($http, $window, $location, $cookies, helperService, $scope, authService, $rootScope) {
    var vm = this;
    vm.logout = logout;
    vm.changeTerms = changeTerms;
    var loginLink = '/users/login/customers';
    var home = '/';

    function logout() {
        authService.clearCredentials();
        $location.path(home);
    };

    function changeTerms() {
      var cookies = $cookies.getObject('globals');
      var data = {
          "usuariosID": cookies.currentUser.usuariosID,
          "termos": "1"
      };
      url = helperService.backendUrl + '/cadastro/termos_update.php';
      $http.post(url, data)
          .then(function(res) {
              //console.log(res);
              //vm.data = res.data[0];
              $cookies.put("termos", "1");
              $location.path(home);
          }, function(err) {
              console.log('error', err);
              $cookies.put("termos", "1");
              $location.path(home);
          });
    }
}
