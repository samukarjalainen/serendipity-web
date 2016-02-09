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

    //
    //function($scope, $http) {
    //$scope.user = {};
    //$scope.user.firstName = user.firstName;
    //$scope.user.lastName = user.lastName;
    //$scope.user.email = user.email;
    //$scope.user.password = user.password;
    //$scope.user.city = user.city;
    //$scope.user.country = user.country;
    //
    //
    //
    //$scope.sendRegistration = function (user) {
    //  console.log(user);
    //};

    //$scope.update = function(user) {
    //  $scope.user = angular.copy(user);
    //};
    //
    //$scope.reset = function() {
    //  $scope.user = angular.copy($scope.master);
    //};

  // });
