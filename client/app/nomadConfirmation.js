angular.module('nomadConfirm', ['nomadForm'])
.controller('nomadConfirmCtrl', ($scope, params) => {

  var confirmMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: new google.maps.LatLng(params.lat, params.long),
      mapTypeId: 'roadmap'
    });

  console.log(params);

  // $scope.sendNomadInfo = () => {
  //   fetch('/api/createEvent', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //             info: {
  //               name: params.eventName,
  //               host: params.hostName,
  //               description: params.description,
  //             },
  //             location: {
  //               lat: params.lat,
  //               long: params.long
  //             },
  //             time: [{
  //               start: String(params.origDate).split('T')[0] + 'T' + String(params.origStartTime).split('T')[1],
  //               end: String(params.origDate).split('T')[0] + 'T' + String(params.origEndTime).split('T')[1]
  //             }]
  //           })
  //   });
  // };
});