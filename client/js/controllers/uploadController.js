app
  .controller('UploadCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {

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

    $scope.uploadTrack = function(file) {
      file.upload = Upload.upload({
        url: '/api/tracks/upload',
        data: {
          file: file,
          title: $scope.trackTitle,
          description: $scope.trackDescription,
          type: $scope.type
        }
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

  }]);
