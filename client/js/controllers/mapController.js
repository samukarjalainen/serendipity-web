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
      var pos = {
        lat: 65.0136864,
        lng: 25.4775258
      };

      var mapWindow = new google.maps.InfoWindow({map: map});

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos.lat = position.coords.latitude;
          pos.lng = position.coords.longitude;

          mapWindow.setPosition(pos);
          mapWindow.setContent('You are here');
          map.setCenter(pos);

        }, function() {
          handleLocationError(true, mapWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, mapWindow, map.getCenter());
      }

      getAndParseSounds(map);

      map.setZoom(12);
      map.setCenter(pos);
    });
  }, 100);




  //function playSound() {
  //  // Set the source for the sound
  //  var source = this.path.toString();
  //
  //  // Hack for MS Windows
  //  if (source.indexOf('\\') !== -1) {
  //    source = source.replace(/\\/g, '/');
  //  }
  //
  //  $scope.source = source;
  //
  //  // Set the source and refresh player
  //  $scope.audioSrc.src = source;
  //  $scope.player.load();
  //
  //  // Set the player's content to be the current sound
  //  if (this.title.length > 0)
  //    $scope.audioTitle.html(this.title);
  //  else
  //    $scope.audioTitle.html('<span class="text-muted">No title</span>');
  //
  //  if (this.desc.length > 0)
  //    $scope.audioDesc.html(this.desc);
  //  else
  //    $scope.audioDesc.html('<span class="text-muted">No description</span>');
  //
  //  // Pop the overlay and player window
  //  openAudioModal();
  //
  //}
  //
  //function openAudioModal() {
  //  $scope.overlay.addClass('is-open');
  //  $scope.audioModal.addClass('is-open');
  //}
  //
  //function closeAudioModal() {
  //  $scope.player.pause();
  //  $scope.overlay.removeClass('is-open');
  //  $scope.audioModal.removeClass('is-open');
  //}
  //
  //(function () {
  //
  //  $scope.overlay.click(function (event) {
  //    if (this == event.target) {
  //      closeAudioModal();
  //    }
  //  });
  //
  //})();


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
        //var $overlay = angular.element('.overlay');
        //var $audioModal = $overlay.find('.audio');
        //$overlay.addClass('is-open');
        //$audioModal.addClass('is-open');
      });
    }

    //console.log(TAG + "markers");
    //console.log($scope.markers);

  }




}]);
