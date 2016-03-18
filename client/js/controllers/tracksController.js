'use strict';

app.controller('TracksCtrl', ['$scope', '$http', 'TrackService', function ($scope, $http, TrackService) {

  var TAG = 'TracksCtrl: ';

  $http.get('/tracks/get-all')
  .then(function (successResponse) {
    $scope.tracks = successResponse.data;
    TrackService.setTracksFetched(true);
    console.log(TAG + "Fetched via $http");
  }, function (errorResponse) {
    console.log(errorResponse)
  });



  //$scope.tracks = TrackService.getTracks();

  //if ($scope.tracks.length === 0) {
  //  $scope.tracks = TrackService.getTracks();
  //}

  //console.log($scope.tracks);
  //
  //if (typeof $scope.tracks == 'undefined') {
  //  console.log(TAG + "Getting tracks!");
  //  $scope.tracks = TrackService.getTracks();
  //}

}]);
