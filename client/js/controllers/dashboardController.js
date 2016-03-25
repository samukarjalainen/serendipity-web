'use strict';

app.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$location', '$timeout', function ($scope, $rootScope, $http, $location, $timeout) {

  var TAG = "DashboardCtrl: ";

	$scope.sounds = [];


  // Get sounds
	$http.post('/api/sounds/mysounds').
		then(function successCallback(successResponse) {
      // Initialize data
      $scope.sounds = successResponse.data;
      $scope.curSound = $scope.sounds[0];

      // Reposition map when it's ready
      $rootScope.$on('MapReady', function () {
        $rootScope.$emit('ShowSoundInfo', {lat: $scope.curSound.lat, lng: $scope.curSound.long});
      });
		}, function errorCallback( errorResponse) {
			console.log(errorResponse);
		});

  $scope.showSoundInfo = function (index, sound, event) {
    // Set the current sound index
    $scope.curSound = $scope.sounds[index];
    console.log($scope.curSound);

    // Broadcast event to map
    var pos = {
      lat: sound.lat,
      lng: sound.long
    };
    $rootScope.$emit('ShowSoundInfo', pos);

    // Update selection indicator
    var $itemClicked = $(event.target);
    $itemClicked.siblings().removeClass('selected');
    $itemClicked.addClass('selected');
  };

  // Open editor
  $scope.openEditor = function () {
    //SoundService.setCurrentSoundId(sound.id);
    $location.path('/edit');
  };

  // Delete sound
  $scope.deleteSound = function (sound) {
    $http.post('/api/sounds/delete-sound', sound)
    .then(function (successResponse) {
      // Remove deleted sound from scope
      for (var i = 0; i < $scope.sounds.length; i++) {
        if ($scope.sounds[i].id === sound.id) {
          $scope.sounds.splice(i, 1);
        }
      }
      // Set the current sound as index 0
      // TODO: Refactor to set index -1 or 0 if index was 0
      if ($scope.sounds.length > 0) {
        $scope.curSound = $scope.sounds[0];
      }
    }, function (errorResponse) {
      console.log(errorResponse);
    });
  };

  // Set the current sound
  $scope.setCurSound = function (index) {
    $scope.curSound = $scope.sounds[index];
  };

	// Get current user's data
	$http.get('/api/user/' + localStorage.username).then(function successCallback(response) {
		$scope.user = response.data;
	}, function errorCallback(response){
		console.log("Error fetching data");
		console.log(response);
		console.log(user);
	});

}]);
