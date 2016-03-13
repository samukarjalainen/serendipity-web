$(document).ready(function(){

  var previousScroll = 0;
  var $win = $(window);

  // Hide or show navigation depending on scroll
  $win.scroll(function(){
    var currentScroll = $(this).scrollTop();

    if (currentScroll > 0 && currentScroll < $(document).height() - $win.height()){

      if (currentScroll > previousScroll){
        hideNav();
      } else {
        showNav();
      }

      previousScroll = currentScroll;
    }
  });

  function hideNav() {
    $(".header > .navbar").removeClass("is-visible").addClass("is-hidden");
  }
  function showNav() {
    $(".header > .navbar").removeClass("is-hidden").addClass("is-visible");
  }

});
