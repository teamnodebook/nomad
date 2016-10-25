angular.module('nomadForm', [])
.factory('params', function() {
  return {};
})
.controller('nomadCtrl', ($scope, $location, params) => {

  var address, lat, lng;

  // $scope.eventName = params.eventName;
  // $scope.hostName = params.host;
  // $scope.description = params.description;

  var input = document.getElementById('locSearch');
  locSearch = new google.maps.places.SearchBox(input);

  geocoder = new google.maps.Geocoder();

  document.getElementById('eventSubmission').style.display = 'none';

  $scope.times = [ {} ];

  $scope.addTimes = () => {
    if ($scope.times[$scope.times.length - 1].date && $scope.times[$scope.times.length - 1].startTime && $scope.times[$scope.times.length - 1].endTime) {
      $scope.times.push({});
    } else {
      console.log('poop');
    }
  }

  /////////////////////////////////////
  // $scope.addressMsg = {
  //   class: 'alert alert-warning',
  //   msg: 'Save your event address.'
  // };

  $scope.inputMsg = {
    class: 'alert alert-warning',
    msg: 'Complete all inputs.'
  };

  // $scope.addedAddress = (check) =>{
  //   if(check){
  //     $scope.addressMsg = {
  //       class: 'alert alert-success',
  //       msg: 'Your event address was saved.'
  //     }
  //   }else{
  //     $scope.addressMsg = {
  //       class: 'alert alert-warning',
  //       msg: 'Select a new address.'
  //     }
  //   }
  //   $scope.$apply();
  // };

  $scope.allInputs = (check) => {
    if (check) {
      $scope.inputMsg = {
        class: 'alert alert-success',
        msg: 'All inputs saved.'
      }
    }
  }
  /////////////////////////////////////

  locSearch.addListener('places_changed', () => {
    address = document.getElementById('locSearch').value;
    geocoder.geocode( { address: address }, (results, status) => {
      if (status === 'OK') {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        $scope.checkInputs();
      }
    });
  });

  $scope.checkInputs = () => {
    // console.log($scope.times);
    if (lat && lng && $scope.eventName && $scope.hostName && $scope.times[$scope.times.length - 1].date && $scope.times[$scope.times.length - 1].startTime && $scope.times[$scope.times.length - 1].endTime && $scope.description) {
      document.getElementById('eventSubmission').style.display = 'block';
      $scope.allInputs(true);
    }
  };

  $scope.confirm = () => {
    // time
    params.convertedTimes = [];
    for (var i = 0; i < $scope.times.length; i++) {
      if ($scope.times[i].date && $scope.times[i].startTime && $scope.times[i].endTime) {
        params.convertedTimes.push({
          start: $scope.times[i].date.toISOString().split('T')[0] + 'T' + $scope.times[i].startTime.toISOString().split('T')[1],
          end: $scope.times[i].date.toISOString().split('T')[0] + 'T' + $scope.times[i].endTime.toISOString().split('T')[1]
        });
      }
    }

    // location
    params.address = address;
    params.lat = lat;
    params.long = lng;

    params.eventName = $scope.eventName;
    params.host = $scope.hostName;
    params.description = $scope.description;
    $location.path('/nomadConfirmation');
  };
});