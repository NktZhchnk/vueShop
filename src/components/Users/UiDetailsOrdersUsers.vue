<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const phoneNumber = ref(localStorage.getItem('phoneNumber'));
const userLogin = ref(localStorage.getItem('userLogin'));
const firstName = ref(localStorage.getItem('firstName'));
const lastName = ref(localStorage.getItem('lastName'));

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



onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="center-container">
    <div class="main-detail">
      <button @click="fetchOrders">424242</button>
    </div>
  </div>
</template>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  height: 92vh; /* На весь экран, можно выбрать другие значения в зависимости от вашего дизайна */
}

.main-detail {
  height: 200px;
  width: 200px;
  background: red;
}
</style>
