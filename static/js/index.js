document.addEventListener("DOMContentLoaded", function() {
    // 지도 옵션
    var mapOptions = {
        center: new naver.maps.LatLng(37.35320025573827, 126.70152103090712), 
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
});