app.service('TrackService', ['$http', function ($http) {

  var TAG = 'TrackService: ';

  var audioTracksFetched = false;
  var tracks = [];

  var getTracks = function () {
    return tracks;
  };

  var setTracks = function (trackArray) {
    tracks = trackArray;
  };

  var tracksFetched = function () {
    return audioTracksFetched;
  };

  // Get tracks
  var fetchTracks = function () {
    $http.get('/tracks/get-all')
    .then(function (successResponse) {
      var data = successResponse.data;
      console.log(TAG);
      console.log(data);
      tracks = data;
      audioTracksFetched = true;
    }, function (errorResponse) {
      console.log(errorResponse)
    });
  };

  return {
    getTracks: getTracks,
    setTracks: setTracks,
    fetchTracks: fetchTracks,
    tracksFetched: tracksFetched,

  }
}]);
