'use strict';

angular.module('serendipityApp')
  .controller('UsersCtrl', function ($scope, $http) {
    console.log("From UsersCtrl");

    $http.get('/api/users').then(function successCallback(response) {
      console.log("Got data!");
      console.log(response);
      $scope.users = response.data;
    }, function errorCallback(response){
      console.log("Error fetching data");
    });
  });
