<!-- OrderDetails.vue -->

<template>
  <div>
    <h2>Order Details</h2>
    <p v-if="orderId">Order ID: {{ orderId }}</p>
    <div v-if="order">
      <p>Order Date: {{ order.order_date }}</p>
      <p>Telephone: {{ order.telephone }}</p>
      <!-- Другие поля подробной информации о заказе -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const orderId = ref(null);
const order = ref(null);

onMounted(async () => {
  // Используем useRoute для получения доступа к $route
  const route = useRoute();

  // Получаем orderId из параметров маршрута
  orderId.value = route.params.orderId;

  // Проверяем наличие orderId перед запросом к серверу
  if (orderId.value) {
    try {
      // Загружаем подробную информацию о заказе
      const response = await axios.get(`https://eseniabila.com.ua/getOrderDetails/${orderId.value}`);
      order.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении подробной информации о заказе:', error);
    }
  }
});
</script>

<style scoped>
/* Ваши стили для подробной информации о заказе */
</style>
