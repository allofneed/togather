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

  data.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${order.user_name || '-'}</td>
    <td>${order.bike_type || '-'}</td>
    <td>${order.user_id || '-'}</td>
    <td>${order.user_name || '-'}</td>
    <td>${order.user_name || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", fetchOrders);