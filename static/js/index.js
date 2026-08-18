document.addEventListener("DOMContentLoaded", function() {

    if (window.isRollingStared) return;
    window.isRollingStared = true;

    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 17
    };
    var map = new naver.maps.Map('map', mapOptions);

    if (typeof storeDataList !== 'undefined' && storeDataList.length > 0) {
        storeDataList.forEach(function(store) {
            var lat = parseFloat(store.latitude);
            var lng = parseFloat(store.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {

                let iconEmoji = "🏠";
                let bgColor = "#1a56d6"

                const category = store.category || ''; // 카테고리 정보 가져오기

                if (category === '카페·베이커리') {
                    iconEmoji = "☕";
                    bgColor = "#e67e22"; // 주황색
                } else if (category === '식당') {
                    iconEmoji = "🍽️";
                    bgColor = "#e74c3c"; // 빨간색
                } else if (category === '놀거리(나들이)') {
                    iconEmoji = "🎡";
                    bgColor = "#9b59b6"; // 보라색
                } else if (category === '반려동물 용품') {
                    iconEmoji = "🦴";
                    bgColor = "#27ae60"; // 초록색
                }

                var storeMarkerHtml = `
                    <div style="
                        width: 36px; 
                        height: 36px; 
                        background-color: ${bgColor};
                        border-radius: 50%; 
                        border: 3px solid #ffffff; 
                        box-shadow: 0px 4px 6px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                    ">
                        ${iconEmoji}
                    </div>
                `;
                
                new naver.maps.Marker({
                    position: new naver.maps.LatLng(lat, lng),
                    map: map,
                    title: store.name,
                    icon: {
                        content: storeMarkerHtml,
                        size: new naver.maps.Size(36, 36),
                        anchor: new naver.maps.Point(18, 18) // map -> maps로 수정!
                    }
                });
            }
        });
    }

    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 
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