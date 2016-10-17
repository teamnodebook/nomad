angular.module('explorer', [])
.controller('mapCtrl', function($scope) {
  var initializeMap = function() {
    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(37.787661, -122.399811),
      mapTypeId: 'roadmap'
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.infoWindow = new google.maps.InfoWindow({map: $scope.map});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // $scope.infoWindow.setPosition(pos);
        // $scope.infoWindow.setContent('You here fam.');
        $scope.map.setCenter(pos);
      }, function() {
        handleLocationError(true, $scope.infoWindow, $scope.map.getCenter());
      });
    } else {
      handleLocationError(false, $scope.infoWindow, $scope.map.getCenter());
    }
  };
  initializeMap();

  var initializeSearch = function () {
    var input = document.getElementById('locSearch');
    $scope.locSearch = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  };
  initializeSearch();
})
