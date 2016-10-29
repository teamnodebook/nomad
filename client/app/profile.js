angular.module('nomadProfile',[])

.factory('UserEvents', ($http) => {
  const getEvents = (locationObj, cb) => {
    return $http({
      method: 'POST',
      url: '/api/userEvents',
      // We want this to be the user id - 1 is a test
      data: {userid: 1}
    })
    .then((resp) => {
      const events = resp.data.events;
    })
    .catch((err) => {
      console.log(err);
    });
  };
   return {
    	getEvents: getEvents
    }
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

.controller('profileCtrl', function($scope, $http, $location, UserEvents, MapMath){
	$scope.name;
	$scope.email;
	$scope.password;
	$scope.addUser = () => {
	  
	  fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
      	{
      	userinfo: {
	  	name: $scope.username,
	    email: $scope.email,
	    password: $scope.password
			}
	    })
    });
      // $location.path('/profile');
    };
   $scope.userFetch = () => {
    // $scope.eventMarkers.forEach((marker) => {
    //   marker.setMap(null);
    // });
    // $scope.eventMarkers = [];
    // $scope.bounds = new google.maps.LatLngBounds();
    const searchObj = {
      radius: MapMath.toKilometers(1000),
      lat: MapMath.toRad(0),
      long: MapMath.toRad(0)
    }
    // var searchObj = {};
    $scope.eventList = [];
    UserEvents.getEvents(searchObj, (events, msgObj) => {
      $scope.message = msgObj;
      UserEvents.listEvents(events, $scope.eventList);
  });
};
})

