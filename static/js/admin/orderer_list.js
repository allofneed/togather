function fetchOrders() {
  fetch('api/orderer_list')
  .then(response => response.json())
  .then(result => {
    if (result.status === "success"){
      const tbody = document.getElementById('order-table-body');
      tbody.innerText = '';

      result.data.forEach(order => {
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
    }else{
      console.error("데이터 불러오기 실패:", result.message);
    }
  })
  .catch(error => console.error("네트워크 에러:", error));
}
document.addEventListener("DOMContentLoaded", fetchOrders);