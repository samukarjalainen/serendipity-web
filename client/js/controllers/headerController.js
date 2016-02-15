app.controller('HeaderCtrl', ['$scope', '$location', '$window', 'LoginFactory', function ($scope, $location, $window, LoginFactory) {

  $scope.loggedInUser = $window.localStorage.username;

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.logout = function () {
    console.log("Logout called in header controller");
    LoginFactory.logout();
  };

}]);
