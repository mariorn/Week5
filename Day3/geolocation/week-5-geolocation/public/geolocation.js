var map;

if ("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(onLocation, onError);
}

function onLocation(position){

  var myPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  createMap(myPosition);
  setupAutocomplete();
  showMarkers();
}

function onError(err){
  console.log("What are you using, IE 7??", err);
}

function createMap(position){
  map = new google.maps.Map($('#map')[0], {
    center: position,
    zoom: 12
  });
}

function setupAutocomplete(){
  var input = $('#get-places')[0];
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function(){
    var place = autocomplete.getPlace();
    if (place.geometry.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(17);

      var locations = JSON.parse(window.localStorage.getItem("locations")) || [] ;
      locations.push({position: place.geometry.location, address: place.formatted_address});
      window.localStorage.setItem( "locations" , JSON.stringify(locations));

      createMarker(place.geometry.location, place.formatted_address);
    } else {
      alert("The place has no location...?")
    }
  });
}


function createMarker(position, address){
  var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: 'Hello World!'
    });

  var infowindow = new google.maps.InfoWindow({
      content: address
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
}


function showMarkers(){

  var locations = JSON.parse(window.localStorage.getItem("locations")) || [] ;

  if(locations){
    locations.forEach(function showMarkers (location) {
      createMarker(location.position, location.address);
    });
  }

}



