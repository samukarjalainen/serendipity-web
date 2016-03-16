'use strict';

app.controller('TracksCtrl', function ($scope, $http) {

  $http.get('/tracks/get-all').then(function successCallback(response) {
    $scope.tracks = response.data;
  }, function errorCallback(response){
    console.log(response);
  });

});
