angular.module('nomadProfile',['ngPassword'])

.controller('profileCtrl', function($scope, params, $http, $location,$modalInstance){
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