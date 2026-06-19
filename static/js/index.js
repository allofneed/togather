document.addEventListener("DOMContentLoaded", function() {
    var mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
    
    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 

    naver.maps.Event.addListener(map, 'dragstart', function() {
        isTracking = false; 
    });

    function startTrackingLocation() {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var myPosition = new naver.maps.LatLng(lat, lng);

                if (!myLocationMarker) {
                    myLocationMarker = new naver.maps.Marker({
                        position: myPosition,
                        map: map,
                        icon: {
                            url: '/static/svg/dog_paw.svg', 
                            size: new naver.maps.Size(40, 40),
                            scaledSize: new naver.maps.Size(40, 40),
                            origin: new naver.maps.Point(0, 0),
                            anchor: new naver.maps.Point(20, 20) 
                        }
                    });
                } else {
                    myLocationMarker.setPosition(myPosition);
                }

                if (isTracking) {
                    map.setCenter(myPosition);
                }

            }, function(error) {
                console.warn(error);
            }, {
                enableHighAccuracy: true, 
                maximumAge: 0,
                timeout: 5000
            });
            
        } else {
            alert("위치 추적을 지원하지 않는 브라우저입니다.");
        }
    }

    startTrackingLocation();

    var pawBtn = document.querySelector('.paw-icon-wrapper');
    if (pawBtn) {
        pawBtn.addEventListener('click', function() {
            isTracking = true; 
            if (myLocationMarker) {
                map.setCenter(myLocationMarker.getPosition()); 
            }
        });
    }
});