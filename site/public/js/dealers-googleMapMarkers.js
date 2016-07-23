function addMarkers(map){
var markers = [];
var Marker = google.maps.Marker;
var LatLng = google.maps.LatLng;
markers.push(new Marker({
	position: new LatLng(45.5244002, -122.6804891),
	map: map,
	title: 'Oregon Novelties',
}));
markers.push(new Marker({
	position: new LatLng(43.5244002, -112.6804891),
	map: map,
	title: 'Other Novelties',
}));
markers.push(new Marker({
	position: new LatLng(40.5244002, -120.6804891),
	map: map,
	title: 'Other Novelties',
}));
markers.push(new Marker({
	position: new LatLng(38.5244002, -110.6804891),
	map: map,
	title: 'Other Novelties',
}));
markers.push(new Marker({
	position: new LatLng(32.5244002, -112.6804891),
	map: map,
	title: 'Other Novelties',
}));

}