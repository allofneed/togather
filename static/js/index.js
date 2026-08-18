document.addEventListener("DOMContentLoaded", function() {

    if (window.isRollingStared) return;
    window.isRollingStared = true;

    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 17,
        // ✨ 1. 화면에 확대/축소(+,-) 버튼 다시 살리기
        zoomControl: true, 
        zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT
        }
    };
    var map = new naver.maps.Map('map', mapOptions);

    if (typeof storeDataList !== 'undefined' && storeDataList.length > 0) {
        storeDataList.forEach(function(store) {
            var lat = parseFloat(store.latitude);
            var lng = parseFloat(store.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
                let markerImgSrc = "/static/svg/marker_default.svg"; 
                const category = store.category || ''; 

                if (category === '카페·베이커리') {
                    markerImgSrc = "/static/svg/map_log/카페·베이커리.svg"; 
                } else if (category === '식당') {
                    markerImgSrc = "/static/svg/map_log/식당.svg";
                } else if (category === '놀거리(나들이)') {
                    markerImgSrc = "/static/svg/map_log/놀거리(나들이).svg";
                } else if (category === '반려동물 용품') {
                    markerImgSrc = "/static/svg/map_log/반려동물 용품.svg";
                } else if (category === '투개더대여소') {
                    markerImgSrc = "/static/svg/map_log/투개더본부.svg";
                }

                var storeMarkerHtml = `
                    <div style="width: 40px; height: 40px; pointer-events: none;">
                        <img src="${markerImgSrc}" alt="${category}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                `;
                
                new naver.maps.Marker({
                    position: new naver.maps.LatLng(lat, lng),
                    map: map,
                    title: store.name,
                    icon: {
                        content: storeMarkerHtml,
                        size: new naver.maps.Size(40, 40),
                        anchor: new naver.maps.Point(20, 20)
                    }
                });
            }
        });
    }

    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 
    var lastRecordedPosition = null;

    // ✨ 2. 사용자가 지도를 조작하려고 하면 GPS 추적을 즉시 멈추는 완벽한 방어막!
    naver.maps.Event.addListener(map, 'dragstart', function() { isTracking = false; });
    naver.maps.Event.addListener(map, 'pinchstart', function() { isTracking = false; }); // 두 손가락 줌
    naver.maps.Event.addListener(map, 'zoom_changed', function() { isTracking = false; }); // 줌 변경
    naver.maps.Event.addListener(map, 'touchstart', function() { isTracking = false; }); // 모바일 터치

    function startTrackingLocation() {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var myPosition = new naver.maps.LatLng(lat, lng);
                var heading = position.coords.heading || 0; 

                var markerHtml = `
                    <div style="transform: rotate(${heading}deg); width: 40px; height: 40px; transition: transform 0.3s ease-out; pointer-events: none;">
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
                            <div style="transform: rotate(${heading}deg); width: 30px; height: 30px; opacity: 0.4; pointer-events: none;">
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

    const track = document.getElementById('rolling-track');

    if (track && track.children.length > 1) {
        const itemHeight = track.firstElementChild.offsetHeight; 

        setInterval(function(){
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateY(-${itemHeight}px)`;

            setTimeout(function(){
                track.style.transition = 'none'; 
                void track.offsetHeight; 
                
                track.appendChild(track.firstElementChild); 
                track.style.transform = 'translateY(0)'; 
            }, 500); 
        }, 3000); 
    }
});

function expandCards(btnElement) {
    var wrapper = btnElement.parentElement.previousElementSibling;
    wrapper.classList.add('expanded');
    btnElement.style.display = 'none';
}