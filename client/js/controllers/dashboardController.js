'use strict';

app.controller('DashboardCtrl', ['$scope', '$http', '$location', 'SoundService', function ($scope, $http, $location, SoundService) {

  var TAG = "DashboardCtrl: ";

	$scope.sounds = [];

  // Get sounds
	$http.post('/api/sounds/mysounds').
		then(function successCallback(successResponse) {
			$scope.sounds = successResponse.data;
		}, function errorCallback( errorResponse) {
			console.log(errorResponse);
		});

  // Delete sound
  $scope.deleteSound = function (sound) {
    console.log(sound);

    $http.post('/api/sounds/delete-sound', sound)
    .then(function (successResponse) {
      // Remove deleted sound from scope
      for (var i = 0; i < $scope.sounds.length; i++) {
        if ($scope.sounds[i].id === sound.id) {
          $scope.sounds.splice(i, 1);
        }
      }
    }, function (errorResponse) {
      console.log(errorResponse);
    });
  };

  // Open editor
  $scope.openEditor = function () {
    //SoundService.setCurrentSoundId(sound.id);
    $location.path('/edit');
  };

}]);
