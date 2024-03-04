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
  <div v-if="ordersData.length > 0" class="center-container">
    <div v-for="info in ordersData" class="main-detail" :key="info.id" :class="{ 'processing': info.complete === 0, 'completed': info.complete === 1 }">
    <div class="header">
        <p class="name">{{info.last_name}} {{info.first_name}} {{info.middle_name}}</p>
        <p class="status">{{ info.city}}</p>
      </div>
      <div class="content">
        <h3 v-if="info.complete === 0" style="text-align: center;padding-bottom: 5px; margin: 0;">Замовлення відправлено</h3>
        <h3 v-if="info.complete === 1" style="text-align: center;padding-bottom: 5px; margin: 0;">Збір замовлення</h3>
        <p  v-if="info.address !=='' " class="address">{{info.address}}</p>
        <p  v-if="info.postal_code !== '' " class="address">Поштовий індекс: {{info.postal_code}}</p>
        <p class="phone">Телефон: {{info.telephone}}</p>
        <p v-if="info.poshta_tnn !== null">TTN: {{info.poshta_tnn }}</p>
        <div v-if="info.comment_for_user !== null" class="comment-container">
          <p class="comment-title">Коментар:</p>
          <p class="comment">{{info.comment_for_user}}</p>
        </div>
        <p class="total">Ціна: {{info.total_price}}</p>
      </div>
    </div>
  </div>
  <div v-else class="custom-container">
    <h1>У вас ще немає замовлень.</h1>
  </div>
</template>

<style scoped>
.custom-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.center-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.main-detail {
  width: 300px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.processing .header {
   /* Цвет для состояния "в обработке" */
  background: #2ecc71;
  color: #fff;
  padding: 10px;
  text-align: center;
}

.completed .header {
  /* Цвет для состояния "выполняется" */
  background: #3498db;
  color: #fff;
  padding: 10px;
  text-align: center;
}
.header p.name {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.header p.status {
  margin: 0;
  font-size: 18px;
}

.content {
  padding: 10px;
}
.content p {
  font-size: 16px;
  margin: 5px;
}

.address,
.comment,
.phone,
.total {
  margin-bottom: 8px;
  font-size: 14px;
}
.comment-container {
  margin-top: 8px;
}

.comment-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}

.comment {
  font-size: 14px;
  color: #555;
}

/* Адаптивность для мобильных устройств */
@media screen and (max-width: 768px) {
  .main-detail {
    width: 90%;
  }
}
</style>

