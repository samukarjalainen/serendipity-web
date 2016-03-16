'use strict';

app.controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {

	$scope.sounds = [];

	$http.post('/api/sounds/mysounds').
		then(function successCallback(successResponse) {
			$scope.sounds = successResponse.data;
			console.log(successResponse);
		}, function errorCallback( errorResponse) {
			console.log(errorResponse);

		});
		console.log($scope.sounds);

  $scope.openEditor = function (sound) {
    console.log(sound);
  };

}]);
