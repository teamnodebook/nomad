angular.module('landingPage', [])
.controller('landingCtrl', ($scope) => {
  
  const input = document.getElementById('locSearch');
  $scope.locSearch = new google.maps.places.SearchBox(input);
  console.log("location search from landing: ", $scope.locSearch);
// look at geocoder ; add default radius in alex / jemils code
});