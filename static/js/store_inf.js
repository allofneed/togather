document.addEventListener("DOMContentLoaded", function(){
  const openBtn = document.getElementById("open-qr-btn");
  const closeBtn = document.getElementById("close-qr-btn");
  const modal = document.getElementById("qr-modal");

  let html5QrcodeScanner = null;

  function startScanner() {
        if (html5QrcodeScanner === null) {
            html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader-modal", 
                { 
                    fps: 10, 
                    qrbox: { width: 220, height: 220 },
                    aspectRatio: 1.0 // 1:1 정정방형 비율 고정
                },
                false
            );
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }
    }
  function stopScanner() {
      if (html5QrcodeScanner) {
          html5QrcodeScanner.clear().then(() => {
              html5QrcodeScanner = null;
          }).catch(err => {
              console.error("카메라 종료 실패:", err);
              html5QrcodeScanner = null; // 에러가 나도 강제 초기화
          });
      }
  }
  if (openBtn) {
        openBtn.addEventListener("click", function() {
            if (modal) {
                modal.classList.add("active"); // 모달창 보여주기 (CSS와 연동)
                startScanner(); // 카메라 켜기
            }
        });
    }
  if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            if (modal) {
                modal.classList.remove("active"); // 모달창 숨기기
                stopScanner(); // 카메라 끄기
            }
        });
    }
  function onScanSuccess(decodedText, decodedResult) {
        stopScanner(); // 성공하면 카메라부터 끄고
        if (modal) {
            modal.classList.remove("active"); // 모달 닫고
        }
        // 💡 역사 기록을 교체하며 주소 이동 (뒤로가기 버그 완벽 방지!)
        window.location.replace(decodedText);
    }

    // 스캔 실패 시 (초점이 안 맞아서 인식 진행 중일 때 실행되는 부분)
    function onScanFailure(error) {
        // 불필요한 로그는 비워두어 모바일 브라우저 성능을 확보합니다.
    }
});