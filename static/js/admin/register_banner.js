document.addEventListener("DOMContentLoaded", function() {
  
  //Tap function part
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function(){
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      this.classList.add('active');

      const targetId = this.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  //bannerimage preview part
  const fileInput = document.getElementById('bannerImgInput');
  const previewImg = document.getElementById('bannerPreview');
  const uploadText = document.getElementById('uploadText');

  if(fileInput){
    fileInput.addEventListener('change', function(){
      const file = this.files[0];

      if(file){
        const imageUrl = URL.createObjectURL(file);

        previewImg.src = imageUrl;
        previewImg.style.display = 'block';

        if(uploadText){
          uploadText.style.display = 'none';
        }
      }
    });
  }

  const bannerForm = document.getElementById('banner-register-form');

  if(bannerForm){
    bannerForm.addEventListener('submit', function(event){
      event.preventDefault();
      
      const formData = new FormData(this);
      fetch('/admin/register_banner',{
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if(data.status === 'success'){
          alert('배너가 성공적으로 등록되었습니다!');
          bannerForm.reset();
          document.querySelector('[data-tab="register-banner-list"]').click();
        }else{
          alert('등록 실패: ' + data.message);
        }
      })
      .catch(error => {
        console.error('발송 에러:', error);
        alert('서버와 통신하는 중 문제가 발생했습니다.');
      });
    });
  }
});
