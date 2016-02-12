'use strict';

serendipityApp
  .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.loginStatus = "";
    $scope.loginSuccess = null;

    $scope.login = function (user) {
      $http.post('/login', user).
        then(function (response) {
        console.log("Login SuccessCallback");
        console.log(response);
        $scope.loginSuccess = response.data;
        console.log($scope.loginSuccess);
      }, function (response) {
        console.log("Login ErrorCallback");
        console.log(response);
      });
    }
  }]);
