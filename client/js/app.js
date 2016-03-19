'use strict';

var app = angular.module('serendipityApp',[
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngFileUpload',
  'ngMap'
]);

app.config(function ($httpProvider, $routeProvider) {
  $httpProvider.interceptors.push('HttpInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: '../views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home'
    })
    .when('/users', {
      templateUrl: '../views/users.html',
      controller: 'UsersCtrl',
      controllerAs: 'users',
      access: {
        requiredLogin: true,
        requiredAdmin: true
      }
    })
    .when('/register', {
      templateUrl: '../views/register.html',
      controller: 'RegisterCtrl',
      controllerAs: 'register'
    })
    .when('/login', {
      templateUrl: '../views/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .when('/dashboard', {
      templateUrl: '../views/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'dashboard',
      access: {
        requiredLogin: true
      }
    })
    .when('/upload', {
      templateUrl: '../views/upload.html',
      controller: 'UploadCtrl',
      access: {
        requiredLogin: true
      }
    })
    .when('/sounds', {
      templateUrl: '../views/sounds.html',
      controller: 'SoundsCtrl',
      controllerAs: 'sounds',
      access: {
        requiredLogin: true,
        requiredAdmin: true
      }
    })
    .when('/tracks', {
      templateUrl: '../views/tracks.html',
      controller: 'TracksCtrl',
      access: {
        requiredLogin: true,
        requiredAdmin: true
      }
    })
  .when('/edit', {
    templateUrl: '../views/edit.html',
    controller: 'EditCtrl',
    access: {
      requiredLogin: true
    }
  })
    .otherwise({
      redirectTo: '/'
    })
});

app.filter("trustUrl", ['$sce', function ($sce) {
  console.log('App: $sce trustUrl called');
  return function (recordingUrl) {
    return $sce.trustAsResourceUrl(recordingUrl);
  };
}]);

app.run(function($rootScope, $window, $location, AuthenticationFactory) {
  AuthenticationFactory.check();

  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if (nextRoute.access && nextRoute.access.requiredAdmin && $window.localStorage.userRole !== 'admin') {
      console.log("Admin rights are needed for that");
      $window.alert("Unauthorized action!");
      $location.path("login");
    }

    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLoggedIn) {
      $location.path("/login");
    } else {
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.localStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.localStorage.userRole;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLoggedIn;
    $rootScope.role = AuthenticationFactory.userRole;
    // if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLoggedIn == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});



app.factory('HttpInterceptor', function ($window) {
  return {
    request: function (config) {
      if ($window.localStorage.token) {
        config.headers['authorization'] = 'Bearer ' + $window.localStorage.token;
        config.loggedInUser = $window.localStorage.username;
      }
      return config;
    },

    response: function (response) {
      return response;
    }
  }
});
