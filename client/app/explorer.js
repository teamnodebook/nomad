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
    const radius = document.getElementById('radiusSelect');
    $scope.locSearch = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(radius);
  };
  initializeSearch();


  // set markers and infowindow before search event
  $scope.markers = [];
  let infoWindow = null;

  // Listeners for bound changes and searchbox inputs
  // todo: see if bounds_changed listener is necessary
  // $scope.map.addListener('bounds_changed', () => {
  //   $scope.locSearch.setBounds($scope.map.getBounds());
  // });
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
      radius: MapMath.toKilometers(.5),
      lat: MapMath.toRad(searchLoc.geometry.location.lat()),
      long: MapMath.toRad(searchLoc.geometry.location.lng())
    }
    Events.getEvents(searchObj, (events) => {
      Events.mapEvents(events, $scope.map, $scope.bounds);
    });

    // change radius event listener ng-model change
    // const searchObj = {
    //   radius: MapMath.toKilometers($scope.radius),
    //   lat: MapMath.toRad(searchLoc.geometry.location.lat()),
    //   long: MapMath.toRad(searchLoc.geometry.location.lng())
    // }
    // Events.getEvents(searchObj, (events) => {
    //   Events.mapEvents(events, $scope.map, $scope.bounds);
    // });

  });
})
.factory('Events', ($http, MapMath) => {
  const getEvents = (locationObj, cb) => {
    return $http({
      method: 'POST',
      url: '/api/getEvent',
      data: locationObj
    })
    .then((resp) => {
      const events = resp.data.events;
      cb(events);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const mapEvents = (events, map, bounds) => {
    const markerArr = [];
    events.forEach((event) => {
      const icon = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      markerArr.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: event.name,
          position: {lat: MapMath.toLatLong(Number(event.lat)), lng: MapMath.toLatLong(Number(event.long))}
        })
      );
    });
    markerArr.forEach((marker) => {
      marker.setMap(map);
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  };

  return {
    getEvents: getEvents,
    mapEvents: mapEvents
  };
})
.factory('MapMath', () => {
  const toRad = (number) => {
    return number * Math.PI / 180;
  };
  const toLatLong = (radians) => {
    return radians * (180 / Math.PI);
  };
  const toKilometers = (miles) => {
    return miles * 1.609344;
  };
  return {
    toRad: toRad,
    toLatLong: toLatLong,
    toKilometers: toKilometers
  };


})
