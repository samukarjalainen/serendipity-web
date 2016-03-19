app.controller('EditCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {

  var TAG = 'EditCtrl: ';

  var soundId = $routeParams.id;

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
    angular.forEach($scope.sounds, function (snd) {
      if (snd.path == $scope.soundSelect) {
        $scope.currentSound = snd;
      }
    })
  }

  $scope.updateTrackInfo = function () {
    angular.forEach($scope.tracks, function (track) {
      if (track.path == $scope.trackSelect) {
        $scope.currentTrack = track;
      }
    })
  }

}]);
