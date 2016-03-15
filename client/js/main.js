var $win = $(window);
var previousScroll = 0;
var currentScroll;
var $bgElements = [];


$(document).ready(function(){

  $body = $('body');
  $helpUs = $('.help-us');

  $bgElements.push($body);
  $bgElements.push($helpUs);

  // Things that happen when window is scrolled go in here
  $win.scroll(function(){

    currentScroll = $(this).scrollTop();

    // Hide or show navigation depending on scroll
    navigationScroll();

    // Parallax effect
    backgroundImageParallax(currentScroll);

  });
});

function hideNav() {
  $(".header > .navbar").removeClass("is-visible").addClass("is-hidden");
}
function showNav() {
  $(".header > .navbar").removeClass("is-hidden").addClass("is-visible");
}

function navigationScroll() {
  if (currentScroll > 0 && currentScroll < $(document).height() - $win.height()){
    if (currentScroll > previousScroll){
      hideNav();
    } else {
      showNav();
    }
    previousScroll = currentScroll;
  }
}

function backgroundImageParallax(currentScroll) {

}
