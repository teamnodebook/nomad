angular.module('nomadProfile',[])

.controller('profileCtrl', function($scope, params, $http, $location){
	$scope.username;
	$scope.email;
	$scope.password;
	$scope.addUser = () => {
	  var newUser = {
	  	username: $scope.username,
	    email: $scope.email,
	    password: $scope.password
	    }
	  fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
      // $location.path('/profile');
    };
})
