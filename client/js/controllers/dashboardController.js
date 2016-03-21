'use strict';

app.controller('DashboardCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

	$scope.sounds = [];

	$http.post('/api/sounds/mysounds').
		then(function successCallback(successResponse) {
			$scope.sounds = successResponse.data;
			console.log(successResponse);
		}, function errorCallback( errorResponse) {
			console.log(errorResponse);
		});
		console.log($scope.sounds);



  $scope.deleteSound = function (sound) {
    console.log(sound);

    $http.post('/api/sounds/delete-sound', sound)
    .then(function (successResponse) {
      console.log(successResponse);
    }, function (errorResponse) {
      console.log(errorResponse);
    });
  };
		//Delelting sounds
/*		$scope.deleteSound = function() {
			$http.post('/the/route/in/question/', params).then(function (successCallback), function (errorCallback)
		}
		*/

/*Edit for editting sounds

		$scope.uploadSound = function(file) {
      file.upload = Upload.upload({
        url: '/api/sounds/upload',
        data: {file: file, title: $scope.title, description: $scope.description, lat: $scope.lat, long: $scope.long},
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    };
		*/
  $scope.openEditor = function (sound) {
    console.log(sound);
    $location.path('/edit');
  };

}]);
