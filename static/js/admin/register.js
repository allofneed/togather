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

    const inputStoreName = document.getElementById('inputstorename');
    const previewStoreName = document.getElementById('previewstorename');
    if (inputStoreName) {
        inputStoreName.addEventListener('input', function(){
            previewStoreName.textContent = inputStoreName.value;
        });
    }

    const selectStoreCategorySetting = document.getElementById('selectstorecategory');
    const previewStoreCategory = document.getElementById('previewstorecategory');
    if (selectStoreCategorySetting) {
        selectStoreCategorySetting.addEventListener('change', function(){
            previewStoreCategory.textContent = selectStoreCategorySetting.value;
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

    const selectStoreCategory = document.getElementById('selectcategory');
    const serachStoreName = document.getElementById('storesearchInput');
    const allStore = document.querySelectorAll('.registered-store-container');
    const noResultMessage = document.getElementById('no-search-result');

    function filterStore() {
        const selecetCategory = selectStoreCategory.value;
        const searchStoreText = serachStoreName.value.trim().toLowerCase();
        let visibleCount = 0;

        allStore.forEach(store => {
            const filterStoreCategory = store.getAttribute('data-category') || '';
            const filterStoreName = (store.getAttribute('data-name') || '').toLowerCase();

            const isCategoryMatch = (selecetCategory === 'all' || filterStoreCategory === selecetCategory);
            const isNameMatch = filterStoreName.includes(searchStoreText);

            if (isCategoryMatch && isNameMatch) {
                store.style.display = 'flex';
                visibleCount++;
            } else {
                store.style.display = 'none';
            }
        });

        if (noResultMessage) {
            if (visibleCount === 0) {
                noResultMessage.style.display = 'flex';
            } else {
                noResultMessage.style.display = 'none';
            }
        }
    }

    if (selectStoreCategory && serachStoreName) {
        selectStoreCategory.addEventListener('change', filterStore);
        serachStoreName.addEventListener('input', filterStore);
    }

    const categoryContainer = document.getElementById('selectcategory');
    
    if (categoryContainer) {
        const categoryBtns = categoryContainer.querySelectorAll('button');

        categoryBtns.forEach(button => {
            button.addEventListener('click', () => {
                
                categoryBtns.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                
                button.scrollIntoView({ 
                    behavior: 'smooth', 
                    inline: 'center', 
                    block: 'nearest' 
                });
                
                const selectedCategory = button.textContent.trim();
                allStore.forEach(store => {
                    const storeCategory = store.getAttribute('data-category') || '';
                    if (selectedCategory === '전체' || storeCategory === selectedCategory) {
                        store.style.display = 'flex';
                    } else {
                        store.style.display = 'none';
                    }
                });
            });
        });
    }
}); 

function clearSearch() {
    const searchStoreInput = document.getElementById('storesearchInput');
    if (searchStoreInput) {
        searchStoreInput.value = '';
        searchStoreInput.focus();
        
        const event = new Event('input');
        searchStoreInput.dispatchEvent(event);
    }
}

function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            var baseInput = document.getElementById("store-base-address"); 
            var detailInput = document.getElementById("store-detail-address");
            
            baseInput.value = addr;
            detailInput.focus();
        }
    }).open();
}