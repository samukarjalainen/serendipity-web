'use strict';

app.controller('LoginCtrl', ['$scope', '$window', '$location', 'LoginFactory', 'AuthenticationFactory',
  function ($scope, $window, $location, LoginFactory, AuthenticationFactory) {

    $scope.error = "";

    $scope.login = function (user) {
      if (user.username !== undefined && user.password !== undefined) {
        LoginFactory.login(user).then(function (successResponse) {
          var status = successResponse.status;
          var data = successResponse.data;

          if (status === 200) {
            console.log("LoginCtrl: Logged in.");
            $scope.error = "";

            AuthenticationFactory.isLoggedIn = true;
            AuthenticationFactory.user = data.id;
            AuthenticationFactory.userRole = data.role;
            AuthenticationFactory.username = data.username;

            $window.localStorage.token = data.token;
            $window.localStorage.user = data.id;
            $window.localStorage.username = data.username;
            $window.localStorage.userRole = data.role;

            $location.path('/dashboard');
            $window.location.reload();
          }
        }, function (errorResponse) {
          var status = errorResponse.status;
          var data = errorResponse.data;

          if (status === 401) {
            $scope.error = data.message;
          } else {
            $scope.error = "Something went wrong. Please try again."
          }
        })
      }
    };

  }
]);
