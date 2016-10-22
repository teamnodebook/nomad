angular.module('landingPage', [])
.controller('landingCtrl', ($scope, $location) => {  
	const input = document.getElementById('locSearch');
  var submit = document.getElementById('location-submit-button');
	$scope.locSearch = new google.maps.places.SearchBox(input);  
	
	$scope.setMapCenter = () => {  			 		
		// if(input.value){
		// 	$location.url("nomad");
		// }			  

		var place = $scope.locSearch.getPlaces()	  
		var lat = place[0].geometry.location.lat();
		var long  = place[0].geometry.location.lng();
	  console.log("lat: ", place[0].geometry.location.lat())
	  console.log("long: ", place[0].geometry.location.lng())
	  
	  const toRad = (number) => {
	    return number * Math.PI / 180;
	  };
	  
	  const searchObj = {
	  	radius: '1',
	  	lat: lat,
	  	long: long
	  }
	  
	  const getEvents = (locationObj, cb) => {
	    return $http({
	      method: 'POST',
	      url: '/api/getEvent',
	      data: locationObj
	    })
	    .then((resp) => {
	      const events = resp.data.events;
	      // cb(events);
	      console.log("events", events);
	      $location.url("nomad");
	    })
	    .catch((err) => {
	      console.log(err);
	    });
	  };
  
	  //need to look up what geocoder does - is it getting lat/long
	  //need to look at alex's code to also get radius
	  // make request 
	  // look at geocoder ; add default radius in alex / jemils code
	}
});