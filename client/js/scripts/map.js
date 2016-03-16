// Cache DOM
var $window = $('window');
var $overlay = $('.overlay');
var $audioModal = $overlay.find('.audio');
var $audioTitle = $overlay.find('.audio-title');
var $audioDesc = $overlay.find('.audio-description');
var $closeBtn = $overlay.find('.close-button');
var homeAudio = document.getElementById('player-home');
var homeAudioSrcElem = document.getElementById('audio-source-mp3');

/**
 * Callback function for initializing the map.
 * Fired when the map script src has been downloaded from google maps cdn.
 */
function initMap() {

  // Oulu centre 65.0136864,25.4775258
  var mapDiv = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 65.013, lng: 25.477},
    zoom: 12
  });
  var mapWindow = new google.maps.InfoWindow({map: mapDiv});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      mapWindow.setPosition(pos);
      mapWindow.setContent('You are here');
      mapDiv.setCenter(pos);

    }, function() {
      handleLocationError(true, mapWindow, mapDiv.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, mapWindow, mapDiv.getCenter());
  }

  // Place sound markers
  getAndParseSounds(mapDiv);

  $closeBtn.on('click', closeAudioModal);

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

/**
 * Make an asynchronous call to the backend that fetches sounds.
 * When results are ready, place a marker on map for each sound.
 * The sound title is set to marker title
 *
 * @param map google.maps.Map object on which the markers are placed
 */
function getAndParseSounds(map) {
  // TODO: Implement logic to only fetch nearby sounds. Map boundaries can be used for this
  // TODO: Refactor xhttp back out of function call scope
  var sounds;
  var xhttp = new XMLHttpRequest();

  xhttp.open("GET", "/sounds/get-all", true);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      sounds = JSON.parse(xhttp.responseText);

      // Loop through the sounds and get place them on the map
      for (var i = 0; i < sounds.length; i++) {
        var curSound = sounds[i];
        var marker = new google.maps.Marker({
          position: { lat: parseFloat(curSound.lat), lng: parseFloat(curSound.long) },
          map: map,
          title: curSound.title,
          desc: curSound.description,
          soundId: curSound.id,
          path: curSound.path
        });
        // Add click event listener to marker
        marker.addListener('click', playSound);
      }
    }
  };
}

function playSound() {

  // Set the source for the sound
  var source = this.path.toString();

  // Hack for MS Windows
  if (source.indexOf('\\') !== -1) {
    source = source.replace(/\\/g, '/');
  }

  // Set the source and refresh player
  homeAudioSrcElem.src = source;
  homeAudio.load();

  // Set the player's content to be the current sound
  if (this.title.length > 0)
    $audioTitle.html(this.title);
  else
    $audioTitle.html('<span class="text-muted">No title</span>');

  if (this.desc.length > 0)
    $audioDesc.html(this.desc);
  else
    $audioDesc.html('<span class="text-muted">No description</span>');

  // Pop the overlay and player window
  openAudioModal();

}

function openAudioModal() {
  $overlay.addClass('is-open');
  $audioModal.addClass('is-open');
}

function closeAudioModal() {
  homeAudio.pause();
  $overlay.removeClass('is-open');
  $audioModal.removeClass('is-open');
}

// Enable clicking outside the modal box to close it
(function () {

  $overlay.click(function (event) {
    if (this == event.target) {
      closeAudioModal();
    }
  });

})();


