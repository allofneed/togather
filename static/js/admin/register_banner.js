document.addEventListener("DOMContentLoaded", function() {
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
});
