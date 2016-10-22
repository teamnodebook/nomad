angular.module('landingPage', [])
.controller('landingCtrl', ($scope, $location) => {  
	const input = document.getElementById('locSearch');
  var submit = document.getElementById('location-submit-button');
	$scope.locSearch = new google.maps.places.SearchBox(input);  
	
	$scope.setMapCenter = () => {  			 		
		if(input.value){
			$location.url("nomad");
		}			  


		var place = $scope.locSearch.getPlaces()	  
	  console.log("lat: ", place[0].geometry.location.lat())
	  console.log("long: ", place[0].geometry.location.lng())
	  //need to look up what geocoder does - is it getting lat/long
	  //need to look at alex's code to also get radius
	  // make request 

	  // var geocoder = new google.maps.Geocoder();  
	  // geocoder.geocode( {'address': input}, function(results, status) {
	  //   if (status === 'OK') {        
	  //     lat = results[0].geometry.location.lat();
	  //     long = results[0].geometry.location.lng();
	  //     params.loc = input;
	  //     markers[0].setMap(null);
	  //     markers.shift();
	  //     markers.push(new google.maps.Marker({
	  //                   position: results[0].geometry.location,
	  //                   map: nomadMap
	  //                 }));
	  //   } else {
	  //     alert('geocode not successful ' + status);
	  //   }
	  // });

=
	}
// look at geocoder ; add default radius in alex / jemils code

});