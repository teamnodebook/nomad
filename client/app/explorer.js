angular.module('explorer', [])
.controller('mapCtrl', ($scope, Events, MapMath) => {
  const initializeMap = () => {
    const mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(37.787661, -122.399811),
      mapTypeId: 'roadmap'
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
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

  const initializeSearch = () => {
    const input = document.getElementById('locSearch');
    $scope.locSearch = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  };
  initializeSearch();

  // Listeners for bound changes and searchbox inputs
  $scope.map.addListener('bounds_changed', () => {
    $scope.locSearch.setBounds($scope.map.getBounds());
  });

  $scope.markers = [];
  let infoWindow = null;
  $scope.locSearch.addListener('places_changed', () => {
    // clear infowindow from previous search
    if (infoWindow) {
      infoWindow.close();
    }
    infoWindow = new google.maps.InfoWindow({map: $scope.map});
    const places = $scope.locSearch.getPlaces();
    if (places.length === 0) {
      return;
    }
    const searchLoc = places[0];
    // clear markers from previous search
    $scope.markers.forEach((marker) => {
      marker.setMap(null);
    });
    $scope.markers = [];
    // set new bounds
    $scope.bounds = new google.maps.LatLngBounds();
    // create marker, infowindow, and fit bounds to location
    if (!searchLoc.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    // icon settings
    const icon = {
      url: searchLoc.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    // create a marker for location
    $scope.markers.push(new google.maps.Marker({
      map: $scope.map,
      icon: icon,
      title: searchLoc.name,
      position: searchLoc.geometry.location
    }));
    // set 'here' infowindow
    infoWindow.setPosition(searchLoc.geometry.location);
    infoWindow.setContent('You here fam.');
    if (searchLoc.geometry.viewport) {
      $scope.bounds.union(searchLoc.geometry.viewport);
    } else {
      $scope.bounds.extend(searchLoc.geometry.location);
    }
    $scope.map.fitBounds($scope.bounds);

    // get events using getEvents factory
    const searchObj = {
      radius: 3, // todo: this is currently in kilometers
      lat: MapMath.toRad(searchLoc.geometry.location.lat()),
      long: MapMath.toRad(searchLoc.geometry.location.lng())
    }
    Events.getEvents(searchObj);
  });
})
.factory('Events', ($http) => {
  const getEvents = (locationObj) => {
    console.log(locationObj);
    return $http({
      method: 'POST',
      url: '/api/getEvent',
      data: locationObj
    })
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    })
    .catch((err) => {
      console.log(err);
    });
  };
  return {
    getEvents: getEvents
  };
})
.factory('MapMath', () => {
  const toRad = (number) => {
    return number * Math.PI / 180;
  };
  return {
    toRad: toRad
  };
})
