document.addEventListener("DOMContentLoaded", function() {
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        function deg2rad(deg) { return deg * (Math.PI/180); }
        var R = 6371; 
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1); 
    }

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var distanceElements = document.querySelectorAll('.store-distance-value');
            
            distanceElements.forEach(function(el) {
                var storeLat = parseFloat(el.getAttribute('data-lat'));
                var storeLng = parseFloat(el.getAttribute('data-lng'));
                
                if (storeLat && storeLng) {
                    var calDistance = getDistanceFromLatLonInKm(lat, lng, storeLat, storeLng);
                    el.innerText = calDistance + "km";
                } else {
                    el.innerText = "- km"; 
                }
            });
        }, function(error) {
            console.warn(error);
        }, {
            enableHighAccuracy: true, 
            maximumAge: 0,
            timeout: 5000
        });
    }
});