angular
	.module('titi')
  .controller('UserLoginController', ['$scope','$routeParams', '$location',
    '$cookies', 'authService','helperService','$http','$window', UserLoginController])
  .config(['$routeProvider', routes]);

function routes($routeProvider) {
  $routeProvider
	  .when('/users/login/:type/', {
	    templateUrl: 'views/users/login.html',
	    controller: 'UserLoginController',
	    controllerAs: 'User'
	  });
}

function UserLoginController($scope, $routeParams, $location, $cookies, authService,helperService, $http, $window) {
  var vm = this;

  vm.type = $routeParams.type;

  // checks if user is logged in
  var cookies = $cookies.getObject('globals');
  if (cookies) {
    if (cookies.currentUser.userType === vm.type) {
      // redirects to index page according to the user type
      var redirectLoggedUser = '/' + vm.type;
      $location.path(redirectLoggedUser);
      return;
    } else {
      // if user logged in and type !== from logged type, logs out the user
      authService.clearCredentials();
    }
  }

  vm.loading = false;
  vm.invalidData = false;
  vm.title = vm.type === 'customers' ? 'Clientes' : 'Profissionais';
  vm.signupLink = '#/' + vm.type + '/signup';

  vm.submitLoginForm = submitLoginForm;
  function submitLoginForm(data) {
    vm.loading = true;
    vm.invalidData = false;

    // TODO: login from server. Observe the vm.type to redirect to correct endpoint
    console.log('Login data', vm.type, data);

    authService.login(data.email, data.password, vm.type, function(response) {
      console.log('callback', response);
      if (response.status === 200) {
        var credentialData = {
          username: data.email,
          password: data.password,
          perfilID: response.data[0].perfilID,
          usuariosID: response.data[0].usuariosID,
					pacientesID: response.data[0].pacientesID,
          userType: vm.type
        };
        authService.setCredentials(credentialData);
				if(getParameterByName('cep') != null) {
					var cookies = $cookies.getObject('globals');
					  $window.location.href ="#/search?cep=" + getParameterByName('cep') + "&atuacao=" + getParameterByName('atuacao') + "&pacientesID=" + cookies.currentUser.pacientesID;
				}
        var redirectLink = '/' + vm.type;

        $location.path(redirectLink);
      } else {
        vm.invalidData = true;
      }
      vm.loading = false;
    })

  }

	$scope.openResetModal = openResetModal;
	$scope.sendReset = sendReset;
	$scope.txtEmailReset = "";
	$scope.answerReset = "";
	function openResetModal() {
		angular.element("#modalReset").openModal();
	}
	function sendReset() {
		var url = helperService.backendUrl + "/cadastro/ForgotPassword.php?email=" + $scope.txtEmailReset;
		var data = "";
		vm.loading = true;
		$http.post(url, data)
				.then(function(res) {
						console.log('succeess', res);
						vm.loading = false;
						$scope.answerReset = res.data[0].mensagem;

				}, function(err) {
						console.log('error', err);
						$scope.answerReset = err.data[0].mensagem;
						vm.loading = false;
				});
		console.log(data);
	}

}
