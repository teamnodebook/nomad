angular.module('nomadConfirm', ['nomadForm'])
.controller('nomadConfirmCtrl', ($scope, params) => {
  $scope.location = params.loc;
  $scope.date = params.date;
  $scope.startTime = params.startTime;
  $scope.endTime = params.endTime;
  $scope.eventName = params.eventName;
  $scope.hostName = params.host;
  $scope.description = params.description;

  $scope.sendNomadInfo = () => {
    fetch('/api/createEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
              info: {
                name: params.eventName,
                host: params.hostName,
                description: params.description,
              },
              location: {
                lat: params.lat,
                long: params.long
              },
              time: [{
                start: String(params.origDate).split('T')[0] + 'T' + String(params.origStartTime).split('T')[1],
                end: String(params.origDate).split('T')[0] + 'T' + String(params.origEndTime).split('T')[1]
              }]
            })
    });
  };
});