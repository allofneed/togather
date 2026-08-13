let allOrders = [];

function fetchOrders() {
  fetch('api/orderer_list')
  .then(response => response.json())
  .then(result => {
    if (result.status === "success"){
      allOrders = result.data;
      createDateTabs();
      renderTable(allOrders);
    } else {
      console.error("데이터 불러오기 실패:", result.message);
    }
  })
  .catch(error => console.error("네트워크 에러:", error));
}

function createDateTabs() {
  const container = document.getElementById('date-tabs-container');
  if (!container) return;
  container.innerHTML = '';

  const uniqueDates = [...new Set(allOrders.map(order => order.res_date).filter(date => date))].sort();

  const allBtn = document.createElement('button');
  allBtn.innerText = "전체보기";
  allBtn.onclick = () => renderTable(allOrders);
  container.appendChild(allBtn);

  uniqueDates.forEach(date => {
    const btn = document.createElement('button');
    btn.innerText = date;
    
    btn.onclick = () => {
      const filtered = allOrders.filter(order => order.res_date === date);
      renderTable(filtered);
    };
    
    container.appendChild(btn);
  });
}

function renderTable(data) {
  const tbody = document.getElementById('order-table-body');
  tbody.innerHTML = ''; 

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">해당 날짜에 예약이 없습니다.</td></tr>';
    return;
  }

  const template = document.getElementById('order-row-template');

  data.forEach(order => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.td-name').innerText = order.user_name || '-';
    clone.querySelector('.td-bike').innerText = order.bike_type || '-';
    clone.querySelector('.td-phone').innerText = order.user_id || '-';

    const statusSelect = clone.querySelector('.status-select');
    statusSelect.value = order.renter_state || '예약';

    statusSelect.addEventListener('change', function(e) {
      const newStatus = e.target.value; 

      fetch('api/update_status', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_order_id: order.product_order_id,
          renter_state: newStatus
        })
      })
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          order.renter_state = newStatus;
          console.log(`${order.user_name} 고객님의 상태가 [${newStatus}]로 변경되었습니다.`);
        } else {
          alert('상태 변경에 실패했습니다: ' + result.message);
          e.target.value = order.renter_state;
        }
      })
      .catch(error => {
        console.error('서버 통신 에러:', error);
        e.target.value = order.renter_state;
      });
    });

    tbody.appendChild(clone);
  });
}

function createDateTabs() {
  const container = document.getElementById('date-tabs-container');
  if (!container) return;
  container.innerHTML = '';

  const uniqueDates = [...new Set(allOrders.map(order => order.res_date).filter(date => date))].sort();

  const allButtons = [];

  // [전체보기] 버튼 생성
  const allBtn = document.createElement('button');
  allBtn.innerText = "전체보기";
  allBtn.className = "date-btn active";
  allButtons.push(allBtn);

  allBtn.onclick = () => {
    allButtons.forEach(b => b.classList.add('active'));
    renderTable(allOrders);
  };
  container.appendChild(allBtn);

  uniqueDates.forEach(date => {
    const btn = document.createElement('button');
    btn.innerText = date;
    btn.className = "date-btn active"; 
    allButtons.push(btn);
    
    btn.onclick = () => {

      allButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filtered = allOrders.filter(order => order.res_date === date);
      renderTable(filtered);
    };
    
    container.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", fetchOrders);