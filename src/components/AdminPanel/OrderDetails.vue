<!-- OrderDetails.vue -->

<template>
  <div class="order-details">
    <h2>Order Details</h2>
    <p v-if="orderId" class="order-id">Order ID: {{ orderId }}</p>

    <!-- Используем v-for для перебора элементов в массиве order -->
    <div v-for="item in order" :key="item.id" class="order-item">

      <!-- Проверка наличия вариаций -->
      <template v-if="item.variety_name !== null">
        <div style="display: flex">
          <div>
            <img v-if="item.image_url" :src="item.image_url" alt="Product Image" class="variety-image"/>
          </div>
          <div style="margin-left: 20px">
            <p class="variety-info">Variety Name: {{ item.variety_name }}</p>
            <p class="variety-info">Variety Price: {{ item.variety_price }}</p>
            <p class="variety-info">Variety quantity: {{ item.quantity }}</p></div>
        </div>
      </template>

      <!-- Проверка отсутствия вариаций -->
      <template v-else>
        <div style="display: flex">
          <div> <img v-if="item.image_url" :src="item.image_url" alt="Product Image" class="item-image"/></div>
          <div style="margin-left: 20px">
            <p class="item-info">Item Name: {{ item.item_name }}</p>
            <p class="item-info">Price: {{ item.price }}</p>
            <p class="item-info">Quantity: {{ item.quantity }}</p>
          </div>
        </div>


      </template>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

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
      const response = await axios.get(`https://eseniabila.com.ua/getItemOrder/${orderId.value}`);
      console.log(response.data)
      order.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении подробной информации о заказе:', error);
    }
  }
});
</script>

<style scoped>
/* Ваши стили для подробной информации о заказе */

.order-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
}

.order-id {
  font-size: 18px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
}

.order-item {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.order-item:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.variety-info, .item-info {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

.variety-info {
  color: #e74c3c;
}
img{
  height: 150px;
  width: 150px;
}
.item-image, .variety-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.item-image:hover, .variety-image:hover {
  transform: scale(1.05);
}
</style>
