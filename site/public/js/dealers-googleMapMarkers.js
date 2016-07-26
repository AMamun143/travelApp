function addMarkers(map){
var markers = [];
var Marker = google.maps.Marker;
var LatLng = google.maps.LatLng;
markers.push(new Marker({
	position: new LatLng(45.5244002, -122.6804891),
	map: map,
	title: 'Oregon Novelties',
}));
}