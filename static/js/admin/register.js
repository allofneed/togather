document.addEventListener("DOMContentLoaded", function() {
    
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

    // preview-store-js //
    const inputStoreName = document.getElementById('inputstorename');
    const previewStoreName = document.getElementById('previewstorename');
    inputStoreName.addEventListener('input', function(){
        previewStoreName.textContent = inputStoreName.value;
    });

    const selectStoreCategory = document.getElementById('selectstorecategory');
    const previewStoreCategory = document.getElementById('previewstorecategory');
    selectStoreCategory.addEventListener('change', function(){
        previewStoreCategory.textContent = selectStoreCategory.value;
    });

    const inputStoreBenefit = document.getElementById('inputstorebenefit');
    const previewStoreBenefit = document.getElementById('previewstorebenefit');
    inputStoreBenefit.addEventListener('input', function(){
        previewStoreBenefit.textContent = inputStoreBenefit.value;
    });

    const inputStoreBenefitConditiion = document.getElementById('inputstorebenefitcondition');
    const previewStoreBenefitConditiion = document.getElementById('previewstorebenefitcondition');
    inputStoreBenefitConditiion.addEventListener('input', function(){
        previewStoreBenefitConditiion.textContent = inputStoreBenefitConditiion.value;
    });
   

    // (이제 여기에 사진 업로드와 실시간 텍스트 연동 코드를 하나씩 직접 짜서 넣어보세요!)
    
});

// --- 2. 주소 검색 API (미리보기 연동 줄만 제거) ---
function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            var baseInput = document.getElementById("base_address");
            var detailInput = document.getElementById("detail_address");
            
            // 기존 폼 입력창에만 주소 넣기
            baseInput.value = addr;
            detailInput.focus();
        }
    }).open();
}