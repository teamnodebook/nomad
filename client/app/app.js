angular.module('nomad', ['ngRoute', 'explorer'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/landing.html',
      controller: 'landingCtrl'
    })
    .when('/nomad', {
      templateUrl: 'app/nomad.html',
      // controller: 'nomadCtrl'
    })
    .when('/explorer', {
      templateUrl: 'app/explorer.html',
      // controller: 'explorerCtrl'
    })
})
