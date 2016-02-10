'use strict';

angular.module('serendipityApp')
  .controller('RegisterCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.emptyUser = {};

    $scope.sendRegistration = function(user) {

      $scope.code = null;
      $scope.response = null;

      $http.post('/api/register', user).
      then(function(response) {
        $scope.status = response.status;
        $scope.data = response.data;
        console.log($scope.status + ' ' + $scope.data);
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
        console.log($scope.status + ' ' + $scope.data);
      });

      //$http.post('/api/register', user)

      //var request = {
      //  method: 'POST',
      //  url: '/api/register',
      //  data: user
      //};
      //
      //$http.post('/api/register', user).then(function successCallback(response){
      //  console.log(response.status);
      //}, function errorCallback(err){
      //  console.log(response);
      //});

    };

    $scope.reset = function() {
      $scope.user = angular.copy($scope.emptyUser);
    };

    $scope.reset();
  }]);
