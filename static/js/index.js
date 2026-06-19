document.addEventListener("DOMContentLoaded", function() {
    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712),
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
    
    var myLocationMarker = null; 
    var watchId = null; // 실시간 추적 번호를 기억할 변수 추가!

    // =========================================================
    // ⭐️ 실시간으로 내 위치를 따라다니는 함수!
    // =========================================================
    function startTrackingLocation() {
        if (navigator.geolocation) {
            
            // 💡 getCurrentPosition 대신 watchPosition을 사용합니다!
            watchId = navigator.geolocation.watchPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var myPosition = new naver.maps.LatLng(lat, lng);

                // 1) 지도의 중심을 내 이동 위치로 휙휙 계속 이동시킴
                map.setCenter(myPosition);

                // 2) 마커가 아예 없다면? (맨 처음에만 새로 만듦)
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
                    // 3) 이미 마커가 있다면? 지우지 말고 좌표만 부드럽게 스윽~ 이동! (성능 업그레이드)
                    myLocationMarker.setPosition(myPosition);
                }

            }, function(error) {
                console.warn("위치 정보를 가져올 수 없습니다.", error);
            }, {
                // 🚀 [핵심 옵션] 스마트폰의 진짜 GPS 장치를 써서 최대한 정밀하게 추적해라!
                enableHighAccuracy: true, 
                maximumAge: 0,
                timeout: 5000
            });
            
        } else {
            alert("위치 추적을 지원하지 않는 브라우저입니다.");
        }
    }

    // =========================================================
    // 🚀 실행하기
    // =========================================================
    
    // 페이지가 열리면 실시간 추적 바로 시작!
    startTrackingLocation();

    // 발바닥 버튼 누르면 다시 내 위치로 화면 땡겨오기
    var pawBtn = document.querySelector('.paw-icon-wrapper');
    if (pawBtn) {
        pawBtn.addEventListener('click', function() {
            // 이미 추적 중이므로, 지도를 현재 마커 위치로만 휙 옮겨줍니다.
            if (myLocationMarker) {
                map.setCenter(myLocationMarker.getPosition());
            }
        });
    }
});