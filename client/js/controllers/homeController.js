app.controller('HomeCtrl', ['$scope', '$http', 'SoundService', 'TrackService', function ($scope, $http, SoundService, TrackService) {

  var TAG = 'HomeCtrl: ';

  if (!SoundService.soundsFetched()) {
    SoundService.fetchSounds();
  } else {
    console.log(TAG + "SoundService has sounds");
  }

  if (!TrackService.tracksFetched()) {
    TrackService.fetchTracks();
  } else {
    console.log(TAG + "TrackService has tracks");
  }



  // Check if the all sounds array is empty
  //if (!SoundService.soundsFetched()) {
  //  SoundService.fetchSounds();
  //} else {
  //  console.log(TAG + "SoundService has sounds");
  //}

}]);
