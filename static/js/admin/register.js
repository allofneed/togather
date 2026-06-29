document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 탭 전환 기능
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 2. 미리보기 연동 (Live Preview)
    const inputStoreName = document.getElementById('inputstorename');
    const previewStoreName = document.getElementById('previewstorename');
    if (inputStoreName) {
        inputStoreName.addEventListener('input', function(){
            previewStoreName.textContent = inputStoreName.value;
        });
    }

    const selectStoreCategory = document.getElementById('selectstorecategory');
    const previewStoreCategory = document.getElementById('previewstorecategory');
    if (selectStoreCategory) {
        selectStoreCategory.addEventListener('change', function(){
            previewStoreCategory.textContent = selectStoreCategory.value;
        });
    }

    const inputStoreBenefit = document.getElementById('inputstorebenefit');
    const previewStoreBenefit = document.getElementById('previewstorebenefit');
    if (inputStoreBenefit) {
        inputStoreBenefit.addEventListener('input', function(){
            previewStoreBenefit.textContent = inputStoreBenefit.value;
        });
    }

    const inputStoreBenefitConditiion = document.getElementById('inputstorebenefitcondition');
    const previewStoreBenefitConditiion = document.getElementById('previewstorebenefitcondition');
    if (inputStoreBenefitConditiion) {
        inputStoreBenefitConditiion.addEventListener('input', function(){
            previewStoreBenefitConditiion.textContent = inputStoreBenefitConditiion.value;
        });
    }

    const inputStoreHashtagFirst = document.getElementById('inputstorehashtagfirst');
    const previewStoreHashtagFirst = document.getElementById('previewstorehashtagfirst');
    if (inputStoreHashtagFirst) {
        inputStoreHashtagFirst.addEventListener('input', function(){
            previewStoreHashtagFirst.textContent = inputStoreHashtagFirst.value;
        });
    }
    
    const inputStoreHashtagSecond = document.getElementById('inputstorehashtagsecond');
    const previewStoreHashtagSecond = document.getElementById('previewstorehashtagsecond');
    if (inputStoreHashtagSecond) {
        inputStoreHashtagSecond.addEventListener('input', function(){
            previewStoreHashtagSecond.textContent = inputStoreHashtagSecond.value;
        });
    }

    const inputStoreHashtagThird = document.getElementById('inputstorehashtagthird');
    const previewStoreHashtagThird = document.getElementById('previewstorehashtagthird');
    if (inputStoreHashtagThird) {
        inputStoreHashtagThird.addEventListener('input', function(){
            previewStoreHashtagThird.textContent = inputStoreHashtagThird.value;
        });
    }

    // 3. 이미지 업로드 및 미리보기
    const imgBtn = document.getElementById('imgbtn');
    const inputStoreImg = document.getElementById('inputstoreimg');
    const inputedStoreImg = document.getElementById('inputedstoreimg');
    const PreviewStoreImg = document.getElementById('previewstoreimg');

    if(imgBtn && inputStoreImg) {
        imgBtn.addEventListener('click', function(){
            inputStoreImg.click();
        });
        inputStoreImg.addEventListener('change', function(event){
            const file = event.target.files[0];
            
            if(file){
                const reader = new FileReader();
                reader.onload = function(e){
                    const imageUrl = e.target.result;
                    inputedStoreImg.src = imageUrl;
                    inputedStoreImg.style.display = 'block';
                    PreviewStoreImg.src = imageUrl;
                };
                reader.readAsDataURL(file);
            } else {
                inputedStoreImg.src = "#";
                inputedStoreImg.style.display = 'none';
                PreviewStoreImg.src = "#";
            }
        });
    }

    // 4. 대망의 폼 전송 (fetch) 로직 - 울타리 안으로 가져왔습니다!
    const registerForm = document.getElementById('store-register-form');
    if(registerForm){
        registerForm.addEventListener('submit', function(e){
            e.preventDefault();
            const formData = new FormData(this);

            fetch(this.action,{
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    alert('매장 등록이 완료되었습니다! 🎉');
                    registerForm.reset();

                    const thumnail = document.getElementById('inputedstoreimg');
                    const mainPreview = document.getElementById('previewstoreimg');

                    if(thumnail) {
                        thumnail.src = "#";
                        thumnail.style.display = 'none';
                    }
                    if (mainPreview) {
                        mainPreview.src = "/static/img/store/11.jpg";
                    }
                    window.location.reload();
                } else {
                    alert('등록실패 :' + data.message);
                }
            })
            .catch(error => {
                console.error('에러 세부정보:', error);
                alert('서버와 통신 중 에러가 발생했습니다.');
            });
        });
    }
}); // DOMContentLoaded 울타리 끝

// --- 5. 주소 검색 API (울타리 밖이어도 작동하는 독립 함수) ---
function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            
            // 🚨 [수정 완료] HTML id에 맞게 'store-base-address'로 변경했습니다!
            var baseInput = document.getElementById("store-base-address"); 
            var detailInput = document.getElementById("store-detail-address");
            
            // 기존 폼 입력창에만 주소 넣기
            baseInput.value = addr;
            detailInput.focus();
        }
    }).open();
}