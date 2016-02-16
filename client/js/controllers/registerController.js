'use strict';

app
  .controller('RegisterCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.sendRegistration = function(user) {
      $http.post('/register', user).
        then(function (response) {
          console.log("Register SuccessCallback");
          console.log(response);
        }, function (response) {
          console.log("Register ErrorCallback");
          console.log(response);
        });
    }
  }]);
