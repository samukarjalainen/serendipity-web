app.controller('MapCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'NgMap', 'SoundService', function($scope, $rootScope, $location, $timeout, NgMap, SoundService) {

  var TAG = 'MapCtrl: ';

  $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz7PBHLbH9Bh-sAJBOZ6-rQjULBf_1nys";
  $scope.sounds = SoundService.getSounds();
  $scope.markers = [];
  //$scope.overlay = angular.element('.overlay');
  //$scope.audioModal = $scope.overlay.find('.audio');
  //$scope.closeBtn = $scope.overlay.find('.close-button').on('click', closeAudioModal);
  //$scope.audioTitle = $scope.overlay.find('.audio-title');
  //$scope.audioDesc = $scope.overlay.find('.audio-description');
  //$scope.player = document.getElementById('player');
  //$scope.audioSrc = document.getElementById('player-source-mp3');
  //$scope.source = "";


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
    });
  }, 100);

  $rootScope.$on('ShowSoundInfo', setMapCenter);

  function setMapCenter(event, pos) {
    console.log(TAG + "setMapCenter called");
    if ($scope.map) {
      console.log(TAG + "Map found");
      console.log(pos);
      $scope.pos.lat = parseFloat(pos.lat);
      $scope.pos.lng = parseFloat(pos.lng);
      console.log($scope.pos.lat);
      console.log($scope.pos.lng);
      // $scope.map.panTo(new google.maps.LatLng(lat, lng));
      // $scope.map.setCenter(new google.maps.LatLng(lat, lng));
      // NgMap.getMap().then(function (map) {
      //   map.setCenter({lat: lat, lng: lng});
      // });
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

  function getAndParseSounds(map) {
    // Loop through the sounds and get place them on the map
    for (var i = 0; i < $scope.sounds.length; i++) {
      var curSound = $scope.sounds[i];
      var marker = new google.maps.Marker({
        position: { lat: parseFloat(curSound.lat), lng: parseFloat(curSound.long) },
        map: map,
        title: curSound.title,
        desc: curSound.description,
        soundId: curSound.id,
        path: curSound.path
      });
      $scope.markers.push(marker);
      // Add click event listener to marker
      marker.addListener('click', function () {
        SoundService.setCurrentSoundMarker(this);
        $rootScope.$emit('OpenPlayer', this);
      });
    }
  }




}]);
