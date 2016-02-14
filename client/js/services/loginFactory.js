app.factory('LoginFactory', function ($window, $location, $http, AuthenticationFactory) {
  return {
    login: function (user) {
      return $http.post('/login', user);
    },

    logout: function () {
      if (AuthenticationFactory.isLoggedIn) {
        AuthenticationFactory.isLoggedIn = false;
        delete AuthenticationFactory.user;
        delete AuthenticationFactory.userRole;

        delete $window.sessionStorage.token;
        delete $window.sessionStorage.user;
        delete $window.sessionStorage.userRole;

        $location.path('/login');
      }
    }
  }
});
