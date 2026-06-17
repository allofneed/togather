document.addEventListener("DOMContentLoaded", function() {
    // 지도 옵션
    var mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399), 
        zoom: 15
    };
    var map = new naver.maps.Map('map', mapOptions);
});