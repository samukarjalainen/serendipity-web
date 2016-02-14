app.factory('AuthenticationFactory', function ($window) {
  var auth = {
    isLoggedIn: false,
    check: function () {
      if ($window.localStorage.token && $window.localStorage.user) {
        this. isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
        delete this.user;
      }
    }
  };
  return auth;
});
