angular.module('nomadForm', [])
.factory('params', function() {
  return {};
})
.controller('nomadCtrl', ($scope, $location, params) => {

  var address, lat, lng;

  $scope.eventName = params.eventName;
  $scope.hostName = params.host;
  $scope.description = params.description;

  var input = document.getElementById('locSearch');
  locSearch = new google.maps.places.SearchBox(input);

  geocoder = new google.maps.Geocoder();

  $scope.times = ['start'];

  // $scope.addTimes = () => {
  //   $scope.times.push({
  //     startTime: $scope.startTime,
  //     endTime: $scope.endTime
  //   });
  //   console.log($scope.startTime);
  //   console.log($scope.times);
  // }

  /////////////////////////////////////
  $scope.addressMsg = {
    class: 'alert alert-warning',
    msg: 'Select a new address.'
  }

  $scope.addedAddress = (check) =>{
    if(check){
      $scope.addressMsg = {
        class: 'alert alert-success',
        msg: 'The address was added.'
      }
    }else{
      $scope.addressMsg = {
        class: 'alert alert-warning',
        msg: 'Select a new address.'
      }
    }
    $scope.$apply();
  }
  /////////////////////////////////////

  $scope.useAddress = () => {
    address = document.getElementById('locSearch').value;
    geocoder.geocode( { address: address }, (results, status) => {
      if (status === 'OK') {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        console.log(lat, lng);
        $scope.addedAddress(true); // set the message to know if address got added
      }else{
        $scope.addedAddress(false); // set the message to know if address got added
      }
    });
  }

  $scope.checkInputs = () => {
    console.log($scope.startTime);
    if (lat && lng && $scope.eventName && $scope.hostName && $scope.startTime && $scope.endTime && $scope.description) {
      $scope.confirm();
      $location.path('/nomadConfirmation');
    } else {
      alert('Some fields are missing');
    }
  }

  $scope.confirm = () => {
    // time
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

    // date
    params.date = $scope.date.toString().slice(0, 10);
    params.origStartTime = startTime.toISOString();
    params.origEndTime = endTime.toISOString();
    params.origDate = $scope.date.toISOString();

    // location
    params.address = address;
    params.lat = lat;
    params.long = lng;

    params.startTime = String(startHour) + ':' + startMinutes;
    params.endTime = String(endHour) + ':' + endMinutes;
    params.eventName = $scope.eventName;
    params.host = $scope.hostName;
    params.description = $scope.description;
  };
});