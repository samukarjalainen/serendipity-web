'use strict';

app
  .controller('RegisterCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.sendRegistration = function(user) {
      $http.post('/register', user).
        then(function (response) {
          console.log("Register SuccessCallback");
          console.log(response);
          $location.path('/dashboard');
        }, function (response) {
          console.log("Register ErrorCallback");
          console.log(response);
        });
    }
  }]);
