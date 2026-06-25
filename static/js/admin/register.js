document.addEventListener("DOMContentLoaded", function() {
    // 1. 탭 전환 기능 (기존과 동일)
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

    // 2. 이미지 업로드 & 미리보기 기능 (기존 코드에 새 미리보기 연동 추가)
    const fileInput = document.getElementById('store_img_input');
    const fileBtn = document.getElementById('file-btn');
    const previewImg = document.getElementById('image_preview_img'); // 폼 안의 작은 미리보기
    const livePreviewImg = document.getElementById('preview-main-img'); // [추가] 상단 카드 미리보기

    if (fileBtn && fileInput) {
        fileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // 기존 작은 미리보기
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                    // [추가] 상단 카드의 메인 이미지
                    livePreviewImg.src = e.target.result; 
                }
                reader.readAsDataURL(file);
            } else {
                previewImg.src = "#";
                previewImg.style.display = 'none';
                livePreviewImg.src = "https://via.placeholder.com/120x120?text=사진+미리보기"; // 초기화
            }
        });
    }

    // --- [추가된 부분] 폼 입력 시 실시간 텍스트 연동 ---
    // 폼 요소 선택 (HTML 수정 없이 name 속성으로 찾음)
    const storeNameInput = document.querySelector('input[name="store_name"]');
    const categoryInput = document.querySelector('select[name="category"]');
    const benefitInput = document.querySelector('input[name="benefit"]');

    // 미리보기 영역 요소 선택
    const previewName = document.getElementById('preview-store-name');
    const previewCategory = document.getElementById('preview-category-badge');
    const previewBenefit = document.getElementById('preview-benefit-tag');

    // 이벤트 리스너: 입력할 때마다 즉시 반영
    if (storeNameInput) {
        storeNameInput.addEventListener('input', (e) => {
            previewName.textContent = e.target.value || '스토어 이름';
        });
    }
    if (categoryInput) {
        categoryInput.addEventListener('change', (e) => {
            previewCategory.textContent = e.target.value;
        });
    }
    if (benefitInput) {
        benefitInput.addEventListener('input', (e) => {
            previewBenefit.textContent = e.target.value ? `🎁 ${e.target.value}` : '🎁 혜택';
        });
    }
});

// 3. 주소 검색 기능 (기존 코드에 미리보기 연동 추가)
function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            var baseInput = document.getElementById("base_address");
            var detailInput = document.getElementById("detail_address");
            
            // 기존 폼 입력
            baseInput.value = addr;
            
            // [추가] 미리보기 텍스트에 즉시 반영
            document.getElementById('preview-address-text').textContent = addr;

            detailInput.focus();
        }
    }).open();
}