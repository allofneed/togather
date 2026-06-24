document.addEventListener("DOMContentLoaded", function() {
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
      
            const targetId = this.getAttribute('data-tab');
            
            document.getElementById(targetId).classList.add('active');
        });
    });

});

function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 1. 도로명/지번 주소 구별해서 가져오기
            var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

            // 2. 주소 칸에 넣고 상세 주소로 넘어가기
            document.getElementById("base_address").value = addr;
            document.getElementById("detail_address").focus();

            // 3. 네이버 지도 API 로드 확인
            if (typeof naver === 'undefined' || !naver.maps.Service) {
                console.error("네이버 지도 API를 불러오지 못했습니다. 파이썬에서 키가 잘 넘어왔는지 확인하세요.");
                alert("지도 API 오류로 좌표 자동 변환에 실패했습니다.");
                return;
            }

            // 4. 네이버 지도로 좌표 변환 요청!
            naver.maps.Service.geocode({
                query: addr
            }, function(status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    return alert('주소는 입력되었으나, 네이버 지도에서 해당 주소의 좌표를 찾을 수 없습니다.');
                }

                var result = response.v2,
                    items = result.addresses;

                if (items.length > 0) {
                    // 성공적으로 위도(y), 경도(x)를 입력칸에 꽂아 넣습니다!
                    document.getElementById("latitude").value = items[0].y;
                    document.getElementById("longitude").value = items[0].x;
                    console.log("네이버 좌표 변환 성공!", items[0].y, items[0].x);
                }
            });
        }
    }).open();
}