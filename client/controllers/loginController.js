'use strict';

angular.module('serendipityApp')
  .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.login = function (user) {
      $http.post('/login', user).
        then(function (response) {
        console.log("Login SuccessCallback");
        console.log(response);
      }, function (response) {
        console.log("Login ErrorCallback");
        console.log(response);
      });
    }
  }]);
