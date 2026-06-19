document.addEventListener("DOMContentLoaded", function() {
    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
    
    var myLocationMarker = null; 
    var watchId = null;
    var isTracking = true; 

    // ⭐️ 잔상(발자국)을 저장할 배열과 마지막 위치 기록 변수 추가
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

                // 1. 메인 마커(현재 위치) 업데이트
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

                // ====================================================
                // ⭐️ 2. 잔상(발자국) 남기기 로직
                // ====================================================
                if (!lastRecordedPosition) {
                    // 처음 켜졌을 때는 현재 위치를 기준점으로 기록만 해둡니다.
                    lastRecordedPosition = myPosition; 
                } else {
                    // 네이버 지도 기능: '마지막 발자국 위치'와 '현재 위치'의 거리(미터) 계산
                    var distance = map.getProjection().getDistance(lastRecordedPosition, myPosition);
                    
                    // 5미터 이상 이동했을 때만 발자국을 하나 톡! 떨어뜨림
                    if (distance > 5) { 
                        // 잔상 효과: 크기는 살짝 작게(30px), 반투명하게(opacity: 0.4)
                        var trailHtml = `
                            <div style="transform: rotate(${heading}deg); width: 30px; height: 30px; opacity: 0.4;">
                                <img src="/static/svg/dog_paw.svg" style="width: 100%; height: 100%;">
                            </div>
                        `;

                        var trailMarker = new naver.maps.Marker({
                            position: lastRecordedPosition, // 내가 방금 '지나온' 자리에 찍기
                            map: map,
                            icon: {
                                content: trailHtml,
                                size: new naver.maps.Size(30, 30),
                                anchor: new naver.maps.Point(15, 15) // 크기가 30이니 절반인 15
                            }
                        });

                        // 배열에 방금 찍은 발자국 추가
                        trailMarkers.push(trailMarker); 

                        // 발자국이 4개가 넘어가면? 
                        if (trailMarkers.length > 4) {
                            var oldMarker = trailMarkers.shift(); // 맨 앞(가장 오래된) 발자국 꺼내기
                            oldMarker.setMap(null); // 지도에서 쓱 지워버리기
                        }

                        // 다음 발자국 간격 계산을 위해 기준 위치 갱신
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