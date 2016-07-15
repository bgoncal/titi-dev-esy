angular
	.module('titi')
  .controller('PartnerSignupController', ['$http', '$window', '$location', 'helperService',
		PartnerSignupController])
	.controller('PartnerManageController', ['$http', '$window', '$location','$cookies', 'helperService',
		PartnerManageController])
  .controller('PartnerSearchController', ['$routeParams', '$location', '$http',
    'helperService', PartnerSearchController])
  .controller('PartnerController', ['$cookies', '$location', 'authService', PartnerController])
  .config(['$routeProvider', routes]);

function routes($routeProvider) {
  $routeProvider
	  .when('/partners', {
	    templateUrl: 'views/partners/index.html',
	    controller: 'PartnerController',
	    controllerAs: 'Partner'
	  })
	  .when('/partners/signup', {
	    templateUrl: 'views/partners/signup.html',
	    controller: 'PartnerSignupController',
	    controllerAs: 'Partner'
	  })
		.when('/partners/manage', {
	    templateUrl: 'views/partners/manage-profile.html',
	    controller: 'PartnerManageController',
	    controllerAs: 'Partner'
	  })
	  .when('/search-partners/:cep/:partner', {
	    templateUrl: 'views/partners/search.html',
	    controller: 'PartnerSearchController',
	    controllerAs: 'PartnerSearch'
	  });
}

function PartnerController($cookies, $location, authService) {
  var vm = this;

	vm.logout = logout;
	vm.manage = manage;

  var cookies = $cookies.getObject('globals');
	vm.username = cookies.currentUser.username;
  var loginLink = '/users/login/partners';
	var manageLink = '/partners/manage';

  if (!cookies) {
    $location.path(loginLink);
    return;
  }

  function logout() {
    authService.clearCredentials();
    $location.path(loginLink);
  };
	function manage() {
		$location.path(manageLink);
	};
}

function PartnerSearchController($routeParams, $location, $http, helperService) {
  var vm = this;

  vm.partners = [];
	vm.getPartnerContact = getPartnerContact;
	vm.getStars = getStars;

  var url = helperService.backendUrl + '/relat/pesquisa_resumo.php';
  url = url + '?cep=' + $routeParams.cep;
  url = url + '&atuacao=' + $routeParams.partner;

  vm.loading = true;
  $http.get(url)
    .then(function (res) {
      vm.loading = false;
      vm.partners = res.data || [];
    }, function (err) {
      console.log('error', err);
      vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
      vm.loading = false;
    }
  );

  function getPartnerContact() {
    $location.path('/users/login/customers');
  };

  function getStars(number) {
    var arr = [];
    for (var i = 0; i < number; i++) {
      arr.push(i);
    }
    return arr;
  }
}

function PartnerSignupController($http, $window, $location, helperService) {
  var vm = this;

	vm.loading = false;
  vm.submitSignupForm = submitSignupForm;
	vm.regexCEP = helperService.regex.CEP;
	vm.regexPhone = helperService.regex.phone;
	vm.regexYear = helperService.regex.year;

	vm.orgaoEmissorOptions = helperService.orgaoEmissorOptions;
	vm.atuacaoOptions = helperService.partnerOptions;
	vm.periodoOptions = helperService.periodoOptions;
	vm.perfilEspecialistaOptions = helperService.perfilEspecialistaOptions;
	vm.habilidadeOptions = helperService.habilidadeOptions;
	vm.estadoOptions = helperService.UFOptions;

  function submitSignupForm(form) {
    // TODO: submit data to server
		vm.loading = false;

		var data = angular.copy(form);

		data.perfilID = '2';
		data.disponibilidade = data.disponibilidade ? '1' : '0';

		var url = 'http://titi.net.br/_homolog/cadastro/usuario_update.php';

		vm.loading = true;
		$http.post(url, data)
	    .then(function (res) {
				console.log('succeess', res);
	      vm.loading = false;
				$window.alert('Usuário cadastrado com sucesso. Faça login para continuar.');
				// Redirect to login
				$location.path('/users/login/partners');
	    }, function (err) {
	      console.log('error', err);
	      vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
	      vm.loading = false;
	    }
	  );
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
function PartnerManageController($http, $window, $location, $cookies, helperService) {
	var vm = this;
	vm.states = helperService.UFOptions;
		url = 'http://titi.net.br/_homolog/cadastro/usuario.php';
		globals = $cookies.getObject('globals');
		data = {"usuariosID": globals.currentUser.usuariosID};
			$http.post(url, data)
				.then(function (res) {
					console.log(res);
					vm.data = res.data[0];
				}, function (err) {
					console.log('error', err);
					$window.location.reload();
				}
			);

	vm.loading = false;
  vm.submitManageForm = submitManageForm;
	vm.regexCEP = helperService.regex.CEP;
	vm.regexPhone = helperService.regex.phone;
	vm.regexYear = helperService.regex.year;

	vm.orgaoEmissorOptions = helperService.orgaoEmissorOptions;
	vm.atuacaoOptions = helperService.partnerOptions;
	vm.periodoOptions = helperService.periodoOptions;
	vm.perfilEspecialistaOptions = helperService.perfilEspecialistaOptions;
	vm.habilidadeOptions = helperService.habilidadeOptions;
	vm.estadoOptions = helperService.UFOptions;

  function submitManageForm(form) {
    // TODO: submit data to server
		vm.loading = false;

		var data = angular.copy(form);

		data.perfilID = '2';
		data.disponibilidade = data.disponibilidade ? '1' : '0';
		globals = $cookies.getObject('globals');
		data.usuariosID = globals.currentUser.usuariosID;
		var url = 'http://titi.net.br/_homolog/cadastro/usuario_update.php';

		vm.loading = true;
		$http.post(url, data)
	    .then(function (res) {
				console.log('succeess', res);
	      vm.loading = false;
				$window.alert('Dados alterados com sucesso.');
				// Redirect to login
				$location.path('/users/login/partners');
	    }, function (err) {
	      console.log('error', err);
	      vm.errorMessage = err.statusText || 'Ocorreu um erro. Tente novamente.';
	      vm.loading = false;
	    }
	  );
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
