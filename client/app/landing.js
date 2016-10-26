angular.module('landingPage', [])
.factory('params', function() {
  return {};
})
.controller('landingCtrl', ($scope, $http, $location, params) => {  
	const input = document.getElementById('locSearch');
  var submit = document.getElementById('location-submit-button');
	$scope.locSearch = new google.maps.places.SearchBox(input);  
	
	$scope.setMapCenter = () => {  			 		
		if(input.value){
			$location.url("explorer");
		}	

	  const toRad = (number) => {
	    return number * Math.PI / 180;
	  };
	  
		var place = $scope.locSearch.getPlaces()	  
		var lat = place[0].geometry.location.lat();
		var long  = place[0].geometry.location.lng();
	  console.log("lat rad: ", place[0].geometry.location.lat());
	  console.log("long rad: ", place[0].geometry.location.lng());
	  
	  params.searchObj = {
	  	radius: 1,
	  	lat: lat,
	  	long: long
	  };

  
	  //need to look up what geocoder does - is it getting lat/long
	  //need to look at alex's code to also get radius
	  // make request 

	  // look at geocoder ; add default radius in alex / jemils code
	}
});
