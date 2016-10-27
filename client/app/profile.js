angular.module('nomadProfile',[])

.controller('profileCtrl', function($scope, params, $http, $location){
	$scope.username;
	$scope.email;
	$scope.password;
	$scope.addUser = () => {
	  // var newUser = {
	  // 	username: $scope.username,
	  //   email: $scope.email,
	  //   password: $scope.password
	  //   }
	    console.log('Hello');
	}
})
