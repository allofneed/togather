document.addEventListener("DOMContentLoaded", function() {
    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
    
    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 

    var lastRecordedPosition = null;

    naver.maps.Event.addListener(map, 'dragstart', function() {
        isTracking = false; 
    });

    // ⬇️⬇️⬇️ [추가된 부분 1: 위도/경도로 거리를 계산해주는 공식(함수) 추가] ⬇️⬇️⬇️
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        function deg2rad(deg) { return deg * (Math.PI/180); }
        var R = 6371; 
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1); 
    }
    // ⬆️⬆️⬆️ [추가된 부분 1 끝] ⬆️⬆️⬆️

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

                        setTimeout(function() {
                            trailMarker.setMap(null);
                        }, 5000);

                        lastRecordedPosition = myPosition;
                    }
                }
                // ====================================================

                // ⬇️⬇️⬇️ [추가된 부분 2: 실시간 내 위치(lat, lng)를 기반으로 매장 카드 거리 글자 업데이트] ⬇️⬇️⬇️
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
                // ⬆️⬆️⬆️ [추가된 부분 2 끝] ⬆️⬆️⬆️

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