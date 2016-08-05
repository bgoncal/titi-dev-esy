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
    .controller('CustomerController', ['$cookies', '$http', '$window', '$location', 'authService', 'currentSearch', 'helperService', CustomerController])
    .config(['$routeProvider', routes]);

function routes($routeProvider) {
    $routeProvider
        .when('/customers', {
            templateUrl: 'views/customers/index.html',
            controller: 'CustomerController',
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
    vm.username = cookies.currentUser.username;
    url = 'http://titi.net.br/_homolog/cadastro/usuario.php';
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
    var managelink = '/customers/manage';
    var resetPass = '/customers/reset';

    if (!cookies) {
        $location.path(loginLink);
        return;
    }
    vm.submitForm = submitForm;

    function submitForm(data) {
        $window.location.href = "#/search?cep=" + data.cep + "&atuacao=" + data.selectedPartner.id + "&refresh=0";
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

    function logout() {
        authService.clearCredentials();
        $location.path(loginLink);
    };

    function manage() {
        $location.path(managelink);
    };

    function resetpass() {
        $location.path(resetPass);
    };
}

function CustomerSignupController($scope, $http, $window, $location, helperService) {
    var vm = this;

    vm.submitSignupForm = submitSignupForm;

    function submitSignupForm(form) {
        // TODO: submit form to server
        console.log('Customer signup', form);

        var data = angular.copy(form);

        data.perfilID = '3';
        var url = 'http://titi.net.br/_homolog/cadastro/paciente_update.php';

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
    url = 'http://titi.net.br/_homolog/cadastro/usuario.php';
    globals = $cookies.getObject('globals');
    data = {
        "usuariosID": globals.currentUser.usuariosID
    };
    $http.post(url, data)
        .then(function(res) {
            console.log(res);
            vm.form = res.data[0];
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
        var url = 'http://titi.net.br/_homolog/cadastro/paciente_update.php';

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
        var url = 'http://titi.net.br/_homolog/cadastro/reset_pass.php';

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
