'use strict';

app.controller('SoundsCtrl', function ($scope, $http) {

  $http.get('/api/sounds').then(function successCallback(response) {
    $scope.sounds = response.data;
  }, function errorCallback(response){
    console.log(response);
  });

});
