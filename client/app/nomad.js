angular.module('nomadForm', [])
.factory('params', function() {
  return {};
})
.controller('nomadCtrl', ($scope, params) => {
  var pos, lat, long, markers;

  $scope.eventName = params.eventName;
  $scope.hostName = params.host;
  $scope.description = params.description;

  $scope.confirm = () => {
    var startTime = $scope.startTime;
    var endTime = $scope.endTime;
    var startHour = Number(startTime.toISOString().slice(11, 13)) - 8;
    var startMinutes = Number(startTime.toISOString().slice(14, 16));
    var endHour = Number(endTime.toISOString().slice(11, 13)) - 8;
    var endMinutes = Number(endTime.toISOString().slice(14, 16));
    if (startHour < 0) {
      startHour += 24;
    }
    if (endHour < 0) {
      endHour += 24;
    }
    if (startMinutes < 10) {
      startMinutes = '0' + String(startMinutes);
    }
    if (endMinutes < 10) {
      endMinutes = '0' + String(endMinutes);
    }
    params.date = $scope.date.toString().slice(0, 10);
    params.origStartTime = startTime.toISOString();
    params.origEndTime = endTime.toISOString();
    params.origDate = $scope.date.toISOString();
    params.lat = lat;
    params.long = long;
    params.startTime = String(startHour) + ':' + startMinutes;
    params.endTime = String(endHour) + ':' + endMinutes;
    params.eventName = $scope.eventName;
    params.host = $scope.hostName;
    params.description = $scope.description;
  };

  markers = [];

  var geocoder = new google.maps.Geocoder();

  var nomadMap = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38, lng: -122},
          scrollwheel: false,
          zoom: 4
        });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      lat = pos.lat;
      long = pos.lng;

      geocoder.geocode( { 'location': {lat: lat, lng: long } }, function(results, status) {
        if (status === 'OK') {
          params.loc = results[0].formatted_address;
        }
      });

      nomadMap.setCenter(pos);

      nomadMap.setZoom(15);

      markers.push(new google.maps.Marker({
                    position: pos,
                    map: nomadMap
                  }));
    });
  }

  var input = document.getElementById('locSearch');
  var submit = document.getElementById('submitSearch');
  locSearch = new google.maps.places.SearchBox(input);
  nomadMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  nomadMap.controls[google.maps.ControlPosition.TOP_LEFT].push(submit);

  $scope.setMapCenter = () => {
    var address = document.getElementById('locSearch').value;
    geocoder.geocode( {'address': address}, function(results, status) {
        if (status === 'OK') {
          nomadMap.setCenter(results[0].geometry.location);
          lat = results[0].geometry.location.lat();
          long = results[0].geometry.location.lng();
          params.loc = address;
          markers[0].setMap(null);
          markers.shift();
          markers.push(new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: nomadMap
                      }));
        } else {
          alert('geocode not successful ' + status);
        }
      });
  };
});