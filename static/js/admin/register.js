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

    const fileInput = document.getElementById('store_img_input');
    const fileBtn = document.getElementById('file-btn');
    const previewImg = document.getElementById('image_preview_img');

    if (fileBtn && fileInput) {
        fileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                previewImg.src = "#";
                previewImg.style.display = 'none';
            }
        });
    }
});

function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            var baseInput = document.getElementById("base_address");
            var detailInput = document.getElementById("detail_address");

            baseInput.value = addr;
            detailInput.focus();
        }
    }).open();
}