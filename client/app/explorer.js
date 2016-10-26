angular.module('explorer', ['landingPage'])
.controller('mapCtrl', ($scope, Events, MapMath, params) => {
  // initializes map and geolocates if browser allows
  const initializeMap = () => {
    const mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(37.787661, -122.399811),
      mapTypeId: 'roadmap',
      mapTypeControl:false,
      scrollwheel: false,
      streetViewControl: false,
      panControl: false,
      rotateControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     const pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //
    //     $scope.map.setCenter(pos);
    //   }, function() {
    //     handleLocationError(true, $scope.infoWindow, $scope.map.getCenter());
    //   });
    // } else {
    //   handleLocationError(false, $scope.infoWindow, $scope.map.getCenter());
    // }
  };
  initializeMap();

  // initializes google search bar and custom radius change
  const initializeSearch = () => {
    const input = document.getElementById('locSearch');
    const radius = document.getElementById('radiusSelect');
    $scope.locSearch = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(radius);
  };
  initializeSearch();

  // set markers and infowindow before search event
  $scope.labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $scope.searchLocMarker = [];
  $scope.eventMarkers = [];
  $scope.eventList = [];
  let infoWindow = null;
  let eventInfo = null;

  $scope.message = {
    msg: 'Choose an address, then choose a radius',
    cl: 'show'
  }
  //create a message to live in the event list
  $scope.choseAddress = () =>{
    $scope.message = {
      msg: 'Click an address from the search drop down.',
      cl: 'show'
    }
  }

  // Listeners for searchbox inputs, and radius selects
  $scope.locSearch.addListener('places_changed', () => {
    $scope.eventMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    $scope.eventMarkers = [];
    //(remove message)
    $scope.message = {
      msg: 'Choose a radius from the drop down selector.',
      cl: 'show'
    };
    $scope.$apply();

    // todo: clear event list when new place is searched
    $scope.eventList = [];
    // clear infowindow from previous search
    // if (infoWindow) {
    //   infoWindow.close();
    // }
    // infoWindow = new google.maps.InfoWindow({map: $scope.map});
    const places = $scope.locSearch.getPlaces();
    if (places.length === 0) {
      return;
    }
    $scope.searchLoc = places[0];
    // clear markers from previous search
    $scope.searchLocMarker.forEach((marker) => {
      marker.setMap(null);
    });
    $scope.searchLocMarker = [];
    // set new bounds
    $scope.bounds = new google.maps.LatLngBounds();
    // create marker, infowindow, and fit bounds to location
    if (!$scope.searchLoc.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    // icon settings
    const icon = {
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    // create a marker for location
    $scope.searchLocMarker.push(new google.maps.Marker({
      map: $scope.map,
      icon: icon,
      title: $scope.searchLoc.name,
      position: $scope.searchLoc.geometry.location
    }));
    // set 'here' infowindow
    // infoWindow.setPosition($scope.searchLoc.geometry.location);
    // infoWindow.setContent('You here fam.');
    if ($scope.searchLoc.geometry.viewport) {
      $scope.bounds.union($scope.searchLoc.geometry.viewport);
    } else {
      $scope.bounds.extend($scope.searchLoc.geometry.location);
    }
    $scope.map.fitBounds($scope.bounds);
  });
// need to import in landingPage and add params to explorer controller
 // renders results from landing page
    //not working - getting error from post request
  if(params.searchObj){
    $scope.eventMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    $scope.eventMarkers = [];
    $scope.searchLocMarker = [];
    $scope.bounds = new google.maps.LatLngBounds();
    const icon = {
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    // create a marker for location
    $scope.searchLocMarker.push(new google.maps.Marker({
      map: $scope.map,
      icon: icon,
      position: {lat: params.searchObj.lat, lng: params.searchObj.long}
    }));
    $scope.bounds.extend({lat: params.searchObj.lat, lng: params.searchObj.long});
    $scope.map.fitBounds($scope.bounds);

    const searchObj = {
      radius: MapMath.toKilometers(params.searchObj.radius),
      lat: MapMath.toRad(params.searchObj.lat),
      long: MapMath.toRad(params.searchObj.long)
    }
    $scope.eventList = [];

    const setMessage = (msgObj) =>{
      $scope.message = msgObj;
    };

    Events.getEvents(searchObj, (events, msgObj) => {
      setMessage(msgObj);
      Events.mapEvents(events, $scope.map, $scope.bounds, $scope.eventMarkers, $scope.labels);
      Events.listEvents(events, $scope.eventList
        // , (list) =>{

        //   return list.map((event) => {
        //     const lat = MapMath.toLatLong(event.lat);
        //     const long = MapMath.toLatLong(event.long);
        //     const geocoder = new google.maps.Geocoder();

        //     geocoder.geocode({location: { lat: lat, lng: long}}, (results, status) =>{
              
        //       if(status === 'OK' && results[0] !== null){
        //         console.log(results[0], event.name)
        //         const address = results[0].formatted_address;
        //         event.address = address;
        //       }

        //       return event;
        //     });

        //   });

        // }
      );
    });
  }

  // radiusChange function listening on ngChange of $scope.radius
  $scope.radiusChange = () => {
    if ($scope.radius === '') {
      return console.log('Choose a proper radius.');
    }
    $scope.message = {
      msg: '',
      cl: 'hidden'
    };
    $scope.eventMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    $scope.eventMarkers = [];
    $scope.bounds = new google.maps.LatLngBounds();
    const searchObj = {
      radius: MapMath.toKilometers($scope.radius),
      lat: MapMath.toRad($scope.searchLoc.geometry.location.lat()),
      long: MapMath.toRad($scope.searchLoc.geometry.location.lng())
    }
    $scope.eventList = [];
    Events.getEvents(searchObj, (events, msgObj) => {
      $scope.message = msgObj;
      Events.mapEvents(events, $scope.map, $scope.bounds, $scope.eventMarkers, $scope.labels);
      Events.listEvents(events, $scope.eventList
        // , (list) =>{

        //   return list.map((event) => {
        //     const lat = MapMath.toLatLong(event.lat);
        //     const long = MapMath.toLatLong(event.long);
        //     const geocoder = new google.maps.Geocoder();

        //     geocoder.geocode({location: { lat: lat, lng: long}}, (results, status) =>{
              
        //       if(status === 'OK' && results[0] !== null){
        //         console.log(results[0], event.name)
        //         const address = results[0].formatted_address;
        //         event.address = address;
        //       }

        //       return event;
        //     });

        //   });

        // }
      );
    });
  };

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
      let msg = '';
      let cl = 'hidden'

      if(events.length === 0){
        msg = 'No events in your location. Please choose a larger radius or new location.'
        cl = 'show';
      }

      cb(events, {
        msg: msg,
        cl: cl
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const mapEvents = (events, map, bounds, markers, labels) => {
    var labelIndex = 0;
    events.forEach((event) => {
      // todo: change to better icon
        // icon: iconBase + 'assets/shape.png';
        // width: 22px;
        // height: 40px;

      const icon = {
        // url: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7C46ADB5',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      const marker = new google.maps.Marker({
        map: map,
        // label: labels[labelIndex++ % labels.length],
        icon: 'assets/map_icon_color_opacity.png',
        label: {
          text: labels[labelIndex++ % labels.length],
          color: 'white',
          fontFamily: 'ProximaNova-bold',
          fontSize: '12px'
        },
        title: event.name,
        position: {lat: MapMath.toLatLong(Number(event.lat)), lng: MapMath.toLatLong(Number(event.long))}
      });

      const eventInfo = new google.maps.InfoWindow();
      let open = false;
      google.maps.event.addListener(marker, 'click', function() {
        if (!open) {
          eventInfo.setPosition(marker.position);
          eventInfo.setContent(event.name);
          eventInfo.open(map, marker);
          open = true;
        } else {
          eventInfo.close();
          open = false;
        }
      });
      markers.push(marker);
    });
    if (markers.length > 0) {
      markers.forEach((marker) => {
        marker.setMap(map);
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  };

  const listEvents = (events, list, cb) => {
    events.forEach((event) => {
        list.push(event);
    });
    // cb(list);
  }
  return {
    getEvents: getEvents,
    mapEvents: mapEvents,
    listEvents: listEvents
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
