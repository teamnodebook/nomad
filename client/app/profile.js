angular.module('nomadProfile',[])


.factory('UserEvents', ($http) => {
  const getEvents = () => {
    return $http({
      method: 'GET',
      url: '/api/userEvents',
      // We want this to be the user id - 1 is a test
      data: JSON.stringify({
          userid: window.userId,
        })
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

.controller('profileCtrl', function($scope, $http, $location, $rootScope, UserEvents, MapMath){

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

   $scope.userFetch = () =>{
    return $http({
      url: '/api/userEvents',
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({
        userid: window.userId
      })
    })
   }


    $scope.cancel = () => {
      console.log('DO IT')
      $('.modal-backdrop').remove();
    }

    $scope.userLogin = () =>{

      return $http({
        url: '/login', 
      	method: 'POST',
      	headers: {'Content-Type': 'application/json'},
      	data: JSON.stringify({
      	  email: $scope.email,
      	  password: $scope.password
      	})})
        .then(function(data){
        	if(data.status === 200) {
      		console.log('here I am', data.data.id);
          window.userId = data.data.id;
      		$location.path('/profile');
      	} else {
      		
      		$rootScope.$apply(() => $location.path('/'))
      	}
  
      })
    }
})

