'use strict';

app.controller('LoginCtrl', ['$scope', '$window', '$location', 'LoginFactory', 'AuthenticationFactory',
  function ($scope, $window, $location, LoginFactory, AuthenticationFactory) {

    $scope.login = function (user) {
      if (user.username !== undefined && user.password !== undefined) {
        LoginFactory.login(user).then(function (response) {
          console.log(response);
          console.log("LoginCtrl: Logged in.");

          AuthenticationFactory.isLoggedIn = true;
          AuthenticationFactory.user = response.data.id;
          AuthenticationFactory.userRole = response.data.role;
          AuthenticationFactory.username = response.data.username;

          $window.localStorage.token = response.data.token;
          $window.localStorage.user = response.data.id;
          $window.localStorage.username = response.data.username;
          $window.localStorage.userRole = response.data.role;

          $location.path('/dashboard');
        })
      }
    };

  }
]);
