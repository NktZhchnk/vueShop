<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";


const phoneNumber = ref(localStorage.getItem('phoneNumber'));


const ordersData = ref([]);
const error = ref(null);
const fetchOrders = async () => {

  if (!phoneNumber.value) {
    error.value = 'Введите номер телефона';
    return;
  }

  // Очистка результатов и ошибок перед новым запросом
  ordersData.value = [];
  error.value = null;

  // Отправка запроса на сервер
// Отправка запроса на сервер
  try {
    const response = await axios.get('https://eseniabila.com.ua/getOrdersPhone', {
      params: {
        phoneNumber: phoneNumber.value
      }
    });
    // Обработка успешного ответа от сервера
    ordersData.value = response.data;
  } catch (err) {
    // Обработка ошибки при получении данных с сервера
    error.value = 'Ошибка при получении данных с сервера';
    console.error('Ошибка при получении данных с сервера:', err);
  }
};

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="orders-container">
    <div v-if="ordersData.length > 0">
      <div v-for="info in ordersData" :key="info.id" class="order-card" :class="{ 'processing': info.complete === 0, 'completed': info.complete === 1 }">
        <span class="customer-name">{{ info.last_name }} {{ info.first_name }} {{ info.middle_name }}</span>
        <div class="order-header">
          <p style="text-align: center; width: 100%" class="order-status">{{ info.complete === 0 ? 'Замовлення відправлено' : 'Збір замовлення' }}</p>
        </div>
        <div class="order-details">
          <div class="detail-item">
            <span class="detail-label">Місто:</span>
            <span class="detail-value">{{ info.city }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Поштовий індекс:</span>
            <span class="detail-value">{{ info.postal_code }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Телефон:</span>
            <span class="detail-value">{{info.telephone}}</span>
          </div>
          <div class="detail-item" v-if="info.poshta_tnn !== null">
            <span class="detail-label">TTN:</span>
            <span class="detail-value">{{ info.poshta_tnn }}</span>
          </div>
          <div v-if="info.comment_for_user !== null" class="comment-container">
            <p class="comment-title">Коментар:</p>
            <p class="comment">{{ info.comment_for_user }}</p>
          </div>
          <div class="detail-item">
            <span class="detail-label">Ціна:</span>
            <span class="detail-value">{{ info.total_price }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-orders">
      <h1>У вас ще немає замовлень.</h1>
    </div>
  </div>
</template>
<style scoped>
.orders-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin: 15px;
  justify-items: center;
}

@media (max-width: 768px) {
  .orders-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .orders-container {
    grid-template-columns: 1fr;
  }
}

.order-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 20px;
}

.order-card:hover {
  transform: translateY(-5px);
}

.processing {
  border-color: #27ae60;
}

.completed {
  border-color: #f39c12;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.customer-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.order-status {
  font-size: 14px;
  color: #555;
}

.order-details {
  color: #555;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: bold;
  width: 140px;
}

.detail-value {
  flex: 1;
}

.comment-container {
  margin-top: 10px;

}

.comment-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.comment {
  font-size: 14px;
  color: #777;
  max-width: 290px;
  word-wrap: break-word;
}

.no-orders {
  text-align: center;
  margin-top: 50px;
}

.no-orders h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>