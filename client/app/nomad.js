angular.module('nomadForm', [])
.controller('nomadCtrl', ($scope) => {
  var pos, lat, long, markers;
  
  $scope.log = () => {
    console.log('poop');
  };

  $scope.sendNomadInfo = () => {
    var startTime = $scope.date.toISOString().split('T')[0] + 'T' + $scope.startTime.toISOString().split('T')[1];
    var endTime = $scope.date.toISOString().split('T')[0] + 'T' + $scope.endTime.toISOString().split('T')[1];
    fetch('/api/createEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
              info: {
                name: $scope.eventName,
                host: $scope.hostName,
                description: $scope.description,
              },
              location: {
                lat: lat,
                long: long
              },
              time: [{
                start: startTime,
                end: endTime
              }]
            })
    });
  };

  var markers = [];

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