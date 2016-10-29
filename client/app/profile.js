angular.module('nomadProfile',[])

<<<<<<< HEAD
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
=======
.controller('profileCtrl', function($scope, $http, $location, $rootScope){
>>>>>>> 5977465479f222c2ba07c9f060e67400ba9c1348
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
      
    };
<<<<<<< HEAD
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
=======

    $scope.userLogin = () =>{

      fetch('/login', {
      	method: 'POST',
      	headers:{
      	  'Content-Type': 'application/json'
      	},
      	body: JSON.stringify({
      	  email: $scope.email,
      	  password: $scope.password
      	})
      }).then(function(data){
      	if(data.status === 200) {
      		console.log('here I am');
      		$rootScope.$apply(() => $location.path('/profile'))
      	} else {
      		// todo: close modal here
      		$rootScope.$apply(() => $location.path('/'))
      	}
      	      	   //  $rootScope.$apply(function() {
          //     $location.path("/profile");
          //     console.log($location.path());
          // })
      }).catch(function(err){
      	// $rootScope.$apply(function() {
       //        $location.path("/");
       //        console.log($location.path());
       //    })
      })
    }
>>>>>>> 5977465479f222c2ba07c9f060e67400ba9c1348
})

