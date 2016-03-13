app.controller('HeaderCtrl', ['$scope', '$location', '$window', 'LoginFactory', function ($scope, $location, $window, LoginFactory) {

  $scope.loggedInUser = $window.localStorage.username;
  $scope.admin = false;

  if ($window.localStorage.userRole === 'admin') {
    $scope.admin = true;
  } else {
    $scope.admin = false;
  }

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.logout = function () {
    console.log("Logout called in header controller");
    LoginFactory.logout();
  };

}]);
