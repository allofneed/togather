document.addEventListener("DOMContentLoaded", function() {

    if (window.isRollingStared) return;
    window.isRollingStared = true;

    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 17,
        zoomControl: false
    };
    var map = new naver.maps.Map('map', mapOptions);

    // ✨ 1. 화면 크기를 감지하여 모바일인지 PC인지 판단합니다.
    const isMobile = window.innerWidth <= 768;
    
    // ✨ 2. 매장 마커 크기 설정 (모바일은 90px, PC는 80px)
    const storeMarkerSize = isMobile ? 90 : 80;
    const storeAnchor = storeMarkerSize / 2;

    // ✨ 3. 내 위치(발바닥) 마커 크기 설정 (모바일은 60px, PC는 40px)
    const myLocSize = isMobile ? 60 : 40;
    const myLocAnchor = myLocSize / 2;

    // ✨ 4. 궤적(지나온 길) 마커 크기 설정 (모바일은 45px, PC는 30px)
    const trailSize = isMobile ? 45 : 30;
    const trailAnchor = trailSize / 2;

    if (typeof storeDataList !== 'undefined' && storeDataList.length > 0) {
        storeDataList.forEach(function(store) {
            var lat = parseFloat(store.latitude);
            var lng = parseFloat(store.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
                let markerImgSrc = "/static/svg/marker_default.svg"; 
                const category = store.category || ''; 

                if (category === '카페·베이커리') {
                    markerImgSrc = "/static/svg/map_log/marker_cafe.svg"; 
                } else if (category === '식당') {
                    markerImgSrc = "/static/svg/map_log/marker_food.svg"; 
                } else if (category === '놀거리(나들이)') {
                    markerImgSrc = "/static/svg/map_log/marker_play.svg"; 
                } else if (category === '반려동물 용품') {
                    markerImgSrc = "/static/svg/map_log/marker_pet.svg"; 
                } else if (category === '투개더대여소') {
                    markerImgSrc = "/static/svg/map_log/marker_togetthe.svg";
                }
                
                // HTML 크기에 동적 변수(storeMarkerSize) 적용
                var storeMarkerHtml = `
                    <div style="width: ${storeMarkerSize}px; height: ${storeMarkerSize}px; pointer-events: none;">
                        <img src="${markerImgSrc}" alt="${category}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                `;
                
                new naver.maps.Marker({
                    position: new naver.maps.LatLng(lat, lng),
                    map: map,
                    title: store.name,
                    icon: {
                        content: storeMarkerHtml,
                        // 네이버 지도 아이콘 크기에도 동적 변수 적용
                        size: new naver.maps.Size(storeMarkerSize, storeMarkerSize),
                        anchor: new naver.maps.Point(storeAnchor, storeAnchor)
                    }
                });
            }
        });
    }

    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 
    var lastRecordedPosition = null;

    naver.maps.Event.addListener(map, 'dragstart', function() { isTracking = false; });
    naver.maps.Event.addListener(map, 'pinchstart', function() { isTracking = false; });
    naver.maps.Event.addListener(map, 'zoom_changed', function() { isTracking = false; });
    naver.maps.Event.addListener(map, 'touchstart', function() { isTracking = false; });

    function startTrackingLocation() {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var myPosition = new naver.maps.LatLng(lat, lng);
                var heading = position.coords.heading || 0; 

                // 발바닥 마커 크기에 동적 변수(myLocSize) 적용
                var markerHtml = `
                    <div style="transform: rotate(${heading}deg); width: ${myLocSize}px; height: ${myLocSize}px; transition: transform 0.3s ease-out; pointer-events: none;">
                        <img src="/static/svg/dog_paw.svg" style="width: 100%; height: 100%;">
                    </div>
                `;

                if (!myLocationMarker) {
                    myLocationMarker = new naver.maps.Marker({
                        position: myPosition,
                        map: map,
                        icon: {
                            content: markerHtml,
                            size: new naver.maps.Size(myLocSize, myLocSize),
                            anchor: new naver.maps.Point(myLocAnchor, myLocAnchor)
                        }
                    });
                } else {
                    myLocationMarker.setPosition(myPosition);
                    myLocationMarker.setIcon({
                        content: markerHtml,
                        size: new naver.maps.Size(myLocSize, myLocSize),
                        anchor: new naver.maps.Point(myLocAnchor, myLocAnchor)
                    });
                }

                if (!lastRecordedPosition) {
                    lastRecordedPosition = myPosition; 
                } else {
                    var distance = map.getProjection().getDistance(lastRecordedPosition, myPosition);
                    
                    if (distance > 5) { 
                        // 발자국 궤적 마커 크기에 동적 변수(trailSize) 적용
                        var trailHtml = `
                            <div style="transform: rotate(${heading}deg); width: ${trailSize}px; height: ${trailSize}px; opacity: 0.4; pointer-events: none;">
                                <img src="/static/svg/dog_paw.svg" style="width: 100%; height: 100%;">
                            </div>
                        `;

                        var trailMarker = new naver.maps.Marker({
                            position: lastRecordedPosition,
                            map: map,
                            icon: {
                                content: trailHtml,
                                size: new naver.maps.Size(trailSize, trailSize),
                                anchor: new naver.maps.Point(trailAnchor, trailAnchor)
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