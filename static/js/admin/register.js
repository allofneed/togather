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