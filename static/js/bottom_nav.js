document.addEventListener('DOMContentLoaded', function() {
    // 1. 바텀 네비게이션 안의 모든 a 태그(버튼) 찾기
    const navLinks = document.querySelectorAll('.bottom-nav .nav-item a');
    
    // 2. 바뀔 알맹이가 들어갈 메인 공간 찾기 (대표님 코드의 실제 클래스나 ID로 변경 필요!)
    const contentArea = document.querySelector('.main-content-container'); 

    navLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault(); // 기본 이동(새로고침) 멈춰!
            
            const targetUrl = this.getAttribute('href');
            
            try {
                // 3. 서버에 '알맹이만 줘!' 하고 몰래 통신 보내기
                const response = await fetch(targetUrl, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                
                if (response.ok) {
                    const partialHtml = await response.text();
                    
                    // 4. 받아온 알맹이로 화면 가운데 쏙 갈아끼우기
                    contentArea.innerHTML = partialHtml;
                    
                    // 5. 주소창 URL 감쪽같이 바꾸기
                    history.pushState(null, '', targetUrl);
                    
                    // 6. 눌린 버튼 파란색(active)으로 변경하기
                    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
                    this.closest('.nav-item').classList.add('active');
                }
            } catch (error) {
                console.error('페이지 로딩 실패:', error);
            }
        });
    });
});