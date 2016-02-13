'use strict';

serendipityApp
  .controller('RegisterCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.sendRegistration = function(user) {
      $http.post('/api/users/create', user).
        then(function (response) {
          console.log("Register SuccessCallback");
          console.log(response);
        }, function (response) {
          console.log("Register ErrorCallback");
          console.log(response);
        });
    }
  }]);
