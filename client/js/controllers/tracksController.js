'use strict';

app.controller('TracksCtrl', ['$scope', '$http', 'TrackService', function ($scope, $http, TrackService) {

  var TAG = 'TracksCtrl: ';

  // Get tracks
  $http.get('/tracks/get-all')
  .then(function (successResponse) {
    $scope.tracks = successResponse.data;
    TrackService.setTracksFetched(true);
    console.log(TAG + "Fetched via $http");
  }, function (errorResponse) {
    console.log(errorResponse)
  });

  // Delete tracks
  $scope.deleteTrack = function (track) {
    console.log(track);

    $http.post('/api/tracks/delete-track', track)
    .then(function (successResponse) {
      // Remove deleted track from scope
      for (var i = 0; i < $scope.tracks.length; i++) {
        if ($scope.tracks[i].id === track.id) {
          $scope.tracks.splice(i, 1);
        }
      }
    }, function (errorResponse) {
      console.log(errorResponse);
    });
  };

}]);
