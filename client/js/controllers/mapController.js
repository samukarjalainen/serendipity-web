app.controller('MapCtrl', ['$scope', '$rootScope', '$location', '$timeout', '$window', 'NgMap', 'AuthenticationFactory', 'SoundService',
  function($scope, $rootScope, $location, $timeout, $window, NgMap, AuthenticationFactory, SoundService) {

  var TAG = 'MapCtrl: ';

  $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz7PBHLbH9Bh-sAJBOZ6-rQjULBf_1nys";
  $scope.sounds = SoundService.getSounds();
  $scope.markers = [];


  $timeout(function () {
    NgMap.getMap().then(function(map) {

      $scope.sounds = SoundService.getSounds();

      // Oulu centre coordinates
      $scope.pos = {};


      var mapWindow = new google.maps.InfoWindow({map: map});

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {


          $scope.pos.lat = position.coords.latitude;
          $scope.pos.lng = position.coords.longitude;

          mapWindow.setPosition($scope.pos);
          mapWindow.setContent('You are here');
          //map.setCenter(pos);

        }, function() {
          handleLocationError(true, mapWindow, map.getCenter());
        });
      } else {
        $scope.pos = {
          lat: 65.0136864,
          lng: 25.4775258
        };
      }

      getAndParseSounds(map);

      map.setZoom(12);
      $scope.lat = parseFloat($scope.pos.lat);
      $scope.lng = parseFloat($scope.pos.lng);
      //map.setCenter($scope.pos);

      // Listener for map center change to make the transition smooth.
      map.addListener('center_changed', function () {
        map.panTo(map.getCenter());
      });

      $scope.map = map;

      // Broadcast map ready
      $rootScope.$emit('MapReady');
    });
  }, 100);

  $rootScope.$on('ShowSoundInfo', setMapCenter);

  function setMapCenter(event, pos) {
    if ($scope.map) {
      $scope.pos.lat = parseFloat(pos.lat);
      $scope.pos.lng = parseFloat(pos.lng);
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  function getAndParseSounds(map) {
    // Check whether user is logged in
    if (AuthenticationFactory.isLoggedIn) {
      console.log("User was logged in");
      var userId = $window.localStorage.user;

      // Loop through the sounds and get place them on the map
      for (var i = 0; i < $scope.sounds.length; i++) {
        var curSound = $scope.sounds[i];

        if (curSound.UserId == userId) {
          var marker = new google.maps.Marker({
            position: { lat: parseFloat(curSound.lat), lng: parseFloat(curSound.long) },
            map: map,
            title: curSound.title,
            description: curSound.description,
            soundId: curSound.id,
            path: curSound.path
          });
        }
        $scope.markers.push(marker);
        // Add click event listener to marker if the user is logged in
        marker.addListener('click', function () {
          SoundService.setCurrentSoundMarker(this);
          $rootScope.$emit('OpenPlayer', this);
        });
      }
    } else {
      console.log("Not logged in");
      for (var j = 0; j < $scope.sounds.length; j++) {
        var currSound = $scope.sounds[j];
        var markerr = new google.maps.Marker({
          position: { lat: parseFloat(currSound.lat), lng: parseFloat(currSound.long) },
          map: map,
          title: currSound.title,
          description: currSound.description,
          soundId: currSound.id,
          path: currSound.path
        });
        $scope.markers.push(markerr);
        // TODO: Add listener for displaying message for unregistered users
      }
    }
  }

}]);
