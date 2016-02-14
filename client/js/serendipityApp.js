'use strict';

var app = angular
  .module('serendipityApp',[
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload'
  ]);

app
  .config(function ($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
    $routeProvider
      .when('/', {
        templateUrl: '../views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: '../views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/users', {
        templateUrl: '../views/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'users'
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
        controllerAs: 'dashboard'
      })
      .when('/upload', {
        templateUrl: '../views/upload.html',
        controller: 'UploadCtrl'
      })
      .when('/sounds', {
        templateUrl: '../views/sounds.html',
        controller: 'SoundsCtrl',
        controllerAs: 'sounds'
      })
      .otherwise({
        redirectTo: '/'
      })
  });





app.factory('HttpInterceptor', function ($window) {
  return {
    request: function (config) {
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
      }
      return config;
    },

    response: function (response) {
      return response;
    }
  }
});
