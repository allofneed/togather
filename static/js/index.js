document.addEventListener("DOMContentLoaded", function() {
    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
    
    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 
    var trailMarkers = []; 
    var lastRecordedPosition = null;

    naver.maps.Event.addListener(map, 'dragstart', function() {
        isTracking = false; 
    });

    function startTrackingLocation() {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var myPosition = new naver.maps.LatLng(lat, lng);
                
                var heading = position.coords.heading || 0; 

                var markerHtml = `
                    <div style="transform: rotate(${heading}deg); width: 40px; height: 40px; transition: transform 0.3s ease-out;">
                        <img src="/static/svg/dog_paw.svg" style="width: 100%; height: 100%;">
                    </div>
                `;

                if (!myLocationMarker) {
                    myLocationMarker = new naver.maps.Marker({
                        position: myPosition,
                        map: map,
                        icon: {
                            content: markerHtml,
                            size: new naver.maps.Size(40, 40),
                            anchor: new naver.maps.Point(20, 20)
                        }
                    });
                } else {
                    myLocationMarker.setPosition(myPosition);
                    myLocationMarker.setIcon({
                        content: markerHtml,
                        size: new naver.maps.Size(40, 40),
                        anchor: new naver.maps.Point(20, 20)
                    });
                }

                if (!lastRecordedPosition) {
                    lastRecordedPosition = myPosition; 
                } else {
                    var distance = map.getProjection().getDistance(lastRecordedPosition, myPosition);
                    
                    if (distance > 5) { 
                        var trailHtml = `
                            <div style="transform: rotate(${heading}deg); width: 30px; height: 30px; opacity: 0.4;">
                                <img src="/static/svg/dog_paw.svg" style="width: 100%; height: 100%;">
                            </div>
                        `;

                        var trailMarker = new naver.maps.Marker({
                            position: lastRecordedPosition,
                            map: map,
                            icon: {
                                content: trailHtml,
                                size: new naver.maps.Size(30, 30),
                                anchor: new naver.maps.Point(15, 15)
                            }
                        });

                        trailMarkers.push(trailMarker); 

                        if (trailMarkers.length > 4) {
                            var oldMarker = trailMarkers.shift(); 
                            oldMarker.setMap(null);
                        }
                        lastRecordedPosition = myPosition;
                    }
                }
                // ====================================================

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