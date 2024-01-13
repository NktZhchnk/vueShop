<!-- Ваш компонент с карточками -->
<template>
  <div>
    <router-link
        v-for="(order, index) in uniqueOrders"
        :key="index"
        :to="'/order-details/' + order.id"
    >
      <!-- Ваш код для отображения карточек -->
      <div class="card">
        <h2>{{ order.first_name }} {{ order.last_name }}</h2>
        <p>Order Date: {{ order.order_date }}</p>
        <p>Telephone: {{ order.telephone }}</p>
        <!-- Другие поля карточки -->
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import axios from "axios";

const orderDetails = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('https://eseniabila.com.ua/getOrders');
    orderDetails.value = response.data;
    console.log(orderDetails.value);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
});

const uniqueOrders = computed(() => {
  const uniqueNames = new Set();
  const filteredOrders = orderDetails.value.filter(order => {
    const fullName = `${order.first_name} ${order.last_name}`;
    if (!uniqueNames.has(fullName)) {
      uniqueNames.add(fullName);
      return true;
    }
    return false;
  });
  return filteredOrders.reverse();
});
</script>

<style scoped>
/* Ваши стили для карточек */
.card {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
}
</style>
