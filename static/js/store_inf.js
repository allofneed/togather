document.addEventListener("DOMContentLoaded", function() {
    const openBtn = document.getElementById("open-qr-btn");
    const closeBtn = document.getElementById("close-qr-btn");
    const modal = document.getElementById("qr-modal");
    
    // 💡 Scanner(UI포함)가 아니라 코어 엔진을 담을 변수
    let html5QrCode = null;

    function startScanner() {
        // 1. 껍데기 없는 순수 카메라 엔진(Html5Qrcode)을 호출합니다.
        html5QrCode = new Html5Qrcode("qr-reader-modal");

        // 2. 중간 버튼 없이 후면 카메라(environment)를 즉시 강제 실행합니다!
        html5QrCode.start(
            { facingMode: "environment" }, // 스마트폰 후면 카메라 강제 지정
            {
                fps: 10,
                qrbox: { width: 220, height: 220 },
                aspectRatio: 1.0 // 1:1 정방형
            },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error("카메라 켜기 실패:", err);
            // 만약 유저가 브라우저 권한을 거절했을 때 띄울 안내
            alert("카메라 권한을 허용해 주셔야 QR 스캔이 가능합니다!");
        });
    }

    function stopScanner() {
        // 카메라가 현재 켜져 있을 때만 확실하게 끕니다
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                html5QrCode = null;
            }).catch(err => {
                console.error("카메라 끄기 실패:", err);
                html5QrCode = null;
            });
        }
    }

    // [이벤트] QR 버튼 누르면 ➡️ 팝업 띄우고 즉시 카메라 ON!
    if (openBtn) {
        openBtn.addEventListener("click", function() {
            if (modal) {
                modal.classList.add("active");
                startScanner(); // 버튼 누를 필요 없이 바로 렌즈가 열립니다
            }
        });
    }

    // [이벤트] 닫기 누르면 ➡️ 팝업 닫고 카메라 끄기
    if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            if (modal) {
                modal.classList.remove("active");
                stopScanner();
            }
        });
    }

    // 스캔 성공 시
    function onScanSuccess(decodedText, decodedResult) {
        stopScanner();
        if (modal) {
            modal.classList.remove("active");
        }
        window.location.replace(decodedText);
    }

    // 스캔 진행 중 (초점 안 맞을 때)
    function onScanFailure(error) {
        // 패스
    }
});