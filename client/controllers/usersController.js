'use strict';

serendipityApp
  .controller('UsersCtrl', function ($scope, $http) {

    $http.get('/api/users').then(function successCallback(response) {
      console.log(response);
      $scope.users = response.data;
    }, function errorCallback(response){
      console.log("Error fetching data");
      console.log(response);
    });

  });
