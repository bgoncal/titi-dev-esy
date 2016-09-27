angular
    .module('titi')
    .controller('HomeController', ['$location', 'helperService', '$cookies', '$window', HomeController])
    .config(['$routeProvider', routes]);

function routes($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'Home'
        });
}

function HomeController($location, helperService, $cookies, $window) {
    var vm = this;

    vm.links = helperService.linkOptions;
    vm.setLoggedMenu = setLoggedMenu;
    vm.partners = helperService.partnerOptions;
    vm.contactModal = contactModal;

    vm.submitForm = submitForm;

    function submitForm(data) {
        var redirectLink = '/search-partners/' + data.cep + '/' + data.selectedPartner.id;
        $location.path(redirectLink);
    }
    function contactModal() {
      angular.element("#modalContact").openModal();
    }
    console.log($location.$$path);
    if ($location.$$path == '/') {
        vm.type = 2;
        // checks if user is logged in
        var cookies = $cookies.getObject('globals');
        if (cookies) {
            if (cookies.currentUser.perfilID == vm.type) {
                // redirects to index page according to the user type
                //var redirectLoggedUser = '/search?refresh=1';
                //$location.path(redirectLoggedUser);
                $window.location.href = "#/search";
                return;
            } else {

            }
        }
    }

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
