angular.module('nomadProfile',[])

.controller('profileCtrl', function($scope, $http, $location){
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
})
