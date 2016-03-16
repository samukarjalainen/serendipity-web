app.service('SoundService', ['$http', function ($http) {

  var TAG = 'SoundService: ';

  var allSoundsFetched = false;
  var curUsersSoundsFetched = false;
  var sounds = [];
  var userSounds = [];

  var getSounds = function () {
    return sounds;
  };

  var setSounds = function (soundArray) {
    sounds = soundArray;
  };

  var getSoundsLength = function () {
    return sounds.length;
  };

  var getUserSounds = function () {
    return userSounds;
  };

  var setUserSounds = function (soundArray) {
    userSounds = soundArray;
  };

  var getUserSoundsLength = function () {
    return userSounds.length;
  };

  var soundsFetched = function () {
    return allSoundsFetched;
  };

  // Get sounds
  var fetchSounds = function () {
    $http.get('/sounds/get-all')
    .then(function (successResponse) {
      var data = successResponse.data;
      console.log(data);
      sounds = successResponse.data;
      allSoundsFetched = true;
    }, function (errorResponse) {
      console.log(errorResponse)
    });
  };

  var userSoundsFetched = function () {
    return curUsersSoundsFetched;
  };

  var fetchUserSounds = function () {
    $http.post('/api/sounds/mysounds')
    .then(function (successResponse) {
      var data = successResponse.data;
      console.log(TAG);
      console.log(data);
      userSounds = data;
      curUsersSoundsFetched = true;
    }, function (errorResponse) {

    });
    console.log($scope.sounds);
  };

  return {
    getSounds: getSounds,
    setSounds: setSounds,
    getSoundsLength: getSoundsLength,
    getUserSounds: getUserSounds,
    setUserSounds: setUserSounds,
    getUserSoundsLength: getUserSoundsLength,
    fetchSounds: fetchSounds,
    soundsFetched: soundsFetched,
    fetchUserSounds: fetchUserSounds,
    userSoundsFetched: userSoundsFetched

  }
}]);
