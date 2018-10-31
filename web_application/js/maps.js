function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(40.7128, -74.0060),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.STREET
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}