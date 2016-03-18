app.service('TrackService', ['$http', function ($http) {

  var TAG = 'TrackService: ';

  var audioTracksFetched = false;
  var tracks = [];

  var getTracks = function () {
    if (!audioTracksFetched) {
      fetchTracks();
    }
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

  var setTracksFetched = function (value) {
    audioTracksFetched = value;
  };

  return {
    getTracks: getTracks,
    setTracks: setTracks,
    updateTracks: fetchTracks,
    tracksFetched: tracksFetched,
    setTracksFetched: setTracksFetched
  }

}]);
