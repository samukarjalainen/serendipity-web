app.factory('LoginFactory', function ($http, $window, $location, AuthenticationFactory) {
  return {
    login: function (user) {
      return $http.post('/login', user);
    },

    logout: function () {
      console.log("LoginFactory: Logout called.");

      AuthenticationFactory.clear();
      $window.localStorage.clear();

      $location.path('/');
      $window.location.reload();
    }
  }
});
