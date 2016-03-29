'use strict';

app.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$location', '$timeout', function ($scope, $rootScope, $http, $location, $timeout) {

  var TAG = "DashboardCtrl: ";

	$scope.sounds = [];
  $scope.detailOverlay = angular.element('.details-overlay');
  $scope.detailsModal = $scope.detailOverlay.find('.sound-edit-details-wrapper');
  $scope.closeDetailsBtn = $scope.detailOverlay.find('.sound-close-button');
  $scope.closeDetailsBtn.on('click', closeEditSoundModal);
  $scope.editorOverlay = angular.element('.editor-overlay');
  $scope.editorModal = $scope.editorOverlay.find('.editor-wrapper');
  $scope.closeEditorBtn = $scope.editorOverlay.find('.close-button').on('click', closeMixerModal);

  var tempSoundTitle = "";
  var tempSoundDesc = "";

  angular.element(document).ready(function () {

  });


  // Get sounds
	$http.post('/api/sounds/mysounds')
		.then(function successCallback(successResponse) {
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

  $scope.playCurrentSound = function () {
    $rootScope.$emit('OpenPlayer', $scope.curSound);
  };

  // Open editor
  $scope.openEditor = function () {
    //SoundService.setCurrentSoundId(sound.id);
    // $location.path('/edit');
    openMixerModal();
  };

  $scope.editDetails = function (sound) {
    tempSoundTitle = $scope.curSound.title;
    tempSoundDesc = $scope.curSound.description;
    openEditSoundModal();
  };

  $scope.cancel = function () {
    $scope.curSound.title = tempSoundTitle;
    $scope.curSound.description = tempSoundDesc;
    closeEditSoundModal();
  };

  $scope.save = function () {
    console.log($scope.curSound);
    $http.post('/api/sounds/update', $scope.curSound)
    .then(function (successResponse) {
      console.log(TAG + "success");
      console.log(successResponse);
      closeEditSoundModal();
    }, function (errorResponse) {
      console.log(TAG + "error");
      console.log(errorResponse);
      $scope.cancel();
    });
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

	// Edit current user
	$scope.editUser = function (user) {
		$http.post('/api/users/update', user).
			then(function (successResponse) {
		}, function errorCallback(errorResponse){
			console.log("Error posting data");
			console.log(response);
			console.log(user);
		});
	};


  // Helpers
  function openEditSoundModal() {
    $scope.detailOverlay.addClass('is-open');
    $scope.detailsModal.addClass('is-open');
  }

  function closeEditSoundModal() {
    $scope.detailOverlay.removeClass('is-open');
    $scope.detailsModal.removeClass('is-open');
  }

  (function () {
    $scope.detailOverlay.click(function (event) {
      if (this == event.target) {
        closeEditSoundModal();
      }
    });
  })();

  function openMixerModal() {
    $scope.editorOverlay.addClass('is-open');
    $scope.editorModal.addClass('is-open');
  }

  function closeMixerModal() {
    $scope.editorOverlay.removeClass('is-open');
    $scope.editorModal.removeClass('is-open');
    $rootScope.$emit('CloseMixer');
  }

  (function () {
    $scope.editorOverlay.click(function (event) {
      if (this == event.target) {
        closeMixerModal();
      }
    });
  })();



}]);
