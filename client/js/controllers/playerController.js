app.controller('PlayerCtrl', ['$scope', '$rootScope', '$sce', 'SoundService', function($scope, $rootScope, $sce, SoundService) {

  var TAG = 'PlayerCtrl: ';

  $scope.sounds = SoundService.getSounds();
  $scope.overlay = angular.element('.overlay');
  $scope.audioModal = $scope.overlay.find('.audio');
  $scope.closeBtn = $scope.overlay.find('.close-button').on('click', closeAudioModal);
  $scope.audioTitle = $scope.overlay.find('.audio-title');
  $scope.audioDesc = $scope.overlay.find('.audio-description');
  $scope.player = document.getElementById('player');
  $scope.audioSrc = document.getElementById('player-source-mp3');


  $rootScope.$on('OpenPlayer', playSound);


  function playSound(event, sound) {
    // Set the source for the sound
    //var source = this.path.toString();
    var source = sound.path;
    //console.log(source);
    console.log(TAG + "playSound called");

    // Hack for MS Windows
    if (source.indexOf('\\') !== -1) {
      source = source.replace(/\\/g, '/');
    }

    $scope.source = source;
    $scope.trustedSrc = $sce.trustAsResourceUrl($scope.source);
    console.log(TAG + "scope source: " + $scope.source);



    // Set the source and refresh player
    $scope.audioSrc.src = source;
    $scope.player.load();

    // Set the player's content to be the current sound
    if (sound.title.length > 0)
      $scope.audioTitle.html(sound.title);
    else
      $scope.audioTitle.html('<span class="text-muted">No title</span>');

    if (sound.description.length > 0)
      $scope.audioDesc.html(sound.desc);
    else
      $scope.audioDesc.html('<span class="text-muted">No description</span>');

    // Pop the overlay and player window

    openAudioModal();

  }

  function openAudioModal() {
    $scope.overlay.addClass('is-open');
    $scope.audioModal.addClass('is-open');
  }

  function closeAudioModal() {
    $scope.player.pause();
    $scope.overlay.removeClass('is-open');
    $scope.audioModal.removeClass('is-open');
  }

  (function () {

    $scope.overlay.click(function (event) {
      if (this == event.target) {
        closeAudioModal();
      }
    });

  })();


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
      marker.addListener('click', playSound);
    }

    //console.log(TAG + "markers");
    //console.log($scope.markers);

  }




}]);
