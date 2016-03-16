app.controller('HomeCtrl', ['$scope', '$http', 'SoundService', function ($scope, $http, SoundService) {

  var TAG = 'HomeCtrl: ';

  // Check if the all sounds array is empty
  if (!SoundService.soundsFetched()) {
    SoundService.fetchSounds();
  } else {
    console.log(TAG + "SoundService has sounds");
  }

}]);
