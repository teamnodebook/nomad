angular.module('nomadProfile',[])

.controller('profileCtrl', function($scope, $http, $location, $rootScope){
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
      }).then(function(response){
      	    $rootScope.$apply(function() {
              $location.path("/profile");
              console.log($location.path());
          })
      }).catch(function(err){
      	$rootScope.$apply(function() {
              $location.path("/");
              console.log($location.path());
          })
      })
    }
})
