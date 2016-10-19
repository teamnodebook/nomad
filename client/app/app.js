angular.module('nomad', ['ngRoute', 'explorer', 'nomadForm'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/landing.html',
      // controller: 'landingCtrl'
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
