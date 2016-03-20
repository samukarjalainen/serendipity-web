app.controller('EditCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {

  var TAG = 'EditCtrl: ';

  $scope.newFile = false;

  var soundId = $routeParams.id;
  var soundElement = document.getElementById('sound-audio');
  var trackElement = document.getElementById('track-audio');

  $http.post('/api/sounds/mysounds').then(function successCallback(response) {
    $scope.sounds = response.data;
    angular.forEach($scope.sounds, function (snd) {
      if (snd.id == soundId) {
        //console.log(TAG + "Found!");
        //$scope.currentSound = snd;
        //console.log($scope.currentSound);
      }
    })
  }, function errorCallback(response){
    console.log(response);
  });

  $http.get('/tracks/get-all')
  .then(function (successResponse) {
    $scope.tracks = successResponse.data;
    console.log(TAG + "Fetched via $http");
  }, function (errorResponse) {
    console.log(errorResponse)
  });

  $scope.updateSoundInfo = function () {
    console.log(soundElement.volume);
    angular.forEach($scope.sounds, function (snd) {
      if (snd.path == $scope.soundSelect) {
        $scope.currentSound = snd;
      }
    })
  };

  $scope.updateTrackInfo = function () {
    console.log(trackElement.volume);
    angular.forEach($scope.tracks, function (track) {
      if (track.path == $scope.trackSelect) {
        $scope.currentTrack = track;
      }
    })
  };

  $scope.playBoth = function () {
    if (soundElement.src === '' || trackElement.src === '') {
      console.log(TAG + "source empty");
    } else {

      soundElement.play();
      trackElement.play();
      //soundElement[soundElement.paused ? 'play' : 'pause']();
      //return AUDIO[AUDIO.paused?'play':'pause'
    }
  };

  $scope.pauseBoth = function () {
    soundElement.pause();
    trackElement.pause();
  };

  $scope.stopBoth = function () {
    soundElement.pause();
    soundElement.currentTime = 0;
    trackElement.pause();
    trackElement.currentTime = 0;
  };

  $scope.saveSoundRemix = function () {
    console.log($scope.currentSound);
    console.log($scope.currentTrack);
    console.log("sound volume: " + soundElement.volume.toFixed(2));
    console.log("track volume: " + trackElement.volume.toFixed(2));
    console.log($scope.newFile);

    var sndvolFixed = soundElement.volume.toFixed(2);
    var sndVolFloat = parseFloat(sndvolFixed);
    var trckVolFixed = trackElement.volume.toFixed(2);
    var trckVolFloat = parseFloat(trckVolFixed);
    var sound = $scope.currentSound;
    var track = $scope.currentTrack;
    var newFileVal = $scope.newFile;


    // Make a request
    $http.post('/api/sounds/upload-remix', {sound: sound, track: track, soundVol: sndVolFloat, trackVol: trckVolFloat, newFile: newFileVal})
    .then(function (successResponse) {
      console.log(successResponse);
    }, function (errorResponse) {
      console.log(errorResponse)
    });

  }

}]);
