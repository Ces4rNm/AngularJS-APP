var app = angular.module('myApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url : '/home',
        templateUrl : 'home/home.html',
        controller : 'homeController'
    });
    $stateProvider.state('about', {
        url : '/about',
        templateUrl : 'about/about.html',
        controller : 'aboutController'
    });
    $stateProvider.state('login', {
        url : '/login',
        templateUrl : 'login/login.html',
        controller : 'loginController',
        
    });
    $urlRouterProvider.otherwise('/home');
})
app.run(function($transitions) {
    $transitions.onStart({}, function(trans) {
        var auth = trans.injector().get('LoginService');
        console.log("statechange sesion: "+auth.isAuthenticated());
        if (!auth.isAuthenticated()) {
            trans.router.stateService.target('login');
        }
    });
})

app.controller('loginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
    if(!LoginService.logout()){
        $scope.formSubmit = function() {
          if(LoginService.login($scope.username, $scope.password)) {
            $scope.error = '';
            $scope.username = '';
            $scope.password = '';
            $state.transitionTo('home');
          } else {
            $scope.error = "Incorrect username/password !";
          }   
        };   
    }
});



app.controller('homeController', function ($scope, $http) {
    $scope.getUser = function () {
        $http({
            method: 'GET',
            url: 'model.php?function=getUser',
            data: {
                function: 'getUser'
            }
        }).then(function successCallback(response) {
            $scope.datos = response.data;
        }, function errorCallback(response) {
            console.log("Error al obtener usuarios");
        });
    }
    $scope.getUser();
    $scope.addUser = function (nombre, edad) {
        $http({
            method: 'GET',
            url: 'model.php?function=addUser&nombre=' + nombre + '&edad=' + edad,
            data: {
                function: 'addUser',
                nombre: nombre,
                edad: edad
            }
        }).then(function successCallback(response) {
            $scope.getUser();
            $scope.nombre = "";
            $scope.edad = "";
        }, function errorCallback(response) {
            console.log("Error al insertar usuarios");
        });
    }
    $scope.deleteUser = function (id) {
        $http({
            method: 'GET',
            url: 'model.php?function=deleteUser&id=' + id,
        }).then(function successCallback(response) {
            $scope.getUser();
            $scope.nombre = "";
            $scope.edad = "";
        }, function errorCallback(response) {
            console.log("Error al insertar usuarios");
        });
    }
});
app.controller('aboutController', function($scope, $rootScope, $stateParams, $state, LoginService) {
    console.log("aboutController");
});

app.service('LoginService', function() {
    var admin = 'admin';
    var pass = 'pass';
    var isAuthenticated = false;
    
    return { 
        login : function(username, password) {
            isAuthenticated = username === admin && password === pass;
            return isAuthenticated;
        },isAuthenticated : function() {
            return isAuthenticated;
        },logout : function() {
            isAuthenticated = false;
            return isAuthenticated;
        }
    };

});
