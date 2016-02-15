app.factory('AuthenticationFactory', function ($window) {
  return {
    isLoggedIn: false,
    check: function () {
      console.log("AuthenticationFactory: check() called");
      if ($window.localStorage.token && $window.localStorage.user) {
        console.log("AuthenticationFactory: check() found user login information, setting login to true");
        this.isLoggedIn = true;
      } else {
        console.log("AuthenticationFactory: check() did not find user login information, setting login to false");
        this.isLoggedIn = false;
        $window.localStorage.clear();
      }
    },
    clear: function () {
      console.log("AuthenticationFactory: clear() called, removing items");
      this.isLoggedIn = false;
    }
  };
});
