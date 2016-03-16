app.factory('AuthenticationFactory', function ($window) {
  return {
    isLoggedIn: false,
    check: function () {
      if ($window.localStorage.token && $window.localStorage.user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
        $window.localStorage.clear();
      }
    },
    clear: function () {
      $window.localStorage.clear();
      this.isLoggedIn = false;
    }
  };
});
