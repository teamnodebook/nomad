
angular.module('nomadConfirm', ['nomadForm', 'explorer'])
.controller('nomadConfirmCtrl', ($scope, $location, params, MapMath) => {

  $scope.location = params.address;
  $scope.date = params.date;
  $scope.convertedTimes = params.convertedTimes;
  $scope.eventName = params.eventName;
  $scope.hostName = params.host;
  $scope.paypal = params.paypal;
  $scope.description = params.description;

  var confirmMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(params.lat, params.long),
      mapTypeId: 'roadmap'
    });

  var marker = new google.maps.Marker({
    position: { lat: params.lat, lng: params.long },
    map: confirmMap
  });

  $scope.redirectToEditPage = () => {
    $location.url("nomad");
  }

  $scope.sendNomadInfo = () => {
    fetch('/api/createEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
              info: {
                name: params.eventName,
                host: params.host,
                description: params.description,
                paypal: params.paypal,
                userid: window.userId
              },
              location: {
                lat: params.lat,
                long: params.long
              },
              time: params.convertedTimes
            })
    });
    $location.path('/explorer');
  };
});