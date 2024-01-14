<!-- Ваш компонент с карточками -->
<template>
  <div>
    <router-link
        class="link-order"
        v-for="(order, index) in uniqueOrders"
        :key="index"
        :to="'/order-details/' + order.id"
    >
      <!-- Ваш код для отображения карточек -->
      <div class="card">
        <h2>{{ order.first_name }} {{ order.last_name }} {{ order.middle_name }}
          <button @click="toggleOrderCompletion(order.id, order.complete)">{{ order.complete ? 'Mark Incomplete' : 'Mark Complete' }}</button>
        </h2>
        <p>Дата: {{ order.order_date }}</p>
        <p>Телефон: {{ order.telephone }}</p>
        <p>Коментар: {{ order.comment }}</p>
        <p>Город: {{ order.city }}</p>
        <p v-if="order.address">Нова пошта: {{ order.address }}</p>
        <p v-if="order.postal_code">УкрПошта: {{ order.postal_code }}</p>
        <p>Total price: {{ order.total_price }} ₴.</p>
        <!-- Другие поля карточки -->
      </div>
    </router-link>
  </div>
</template>

<script setup>
import {computed, ref, onMounted} from "vue";
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
const toggleOrderCompletion = async (orderId, currentStatus) => {
  try {
    const response = await axios.put(`https://eseniabila.com.ua/updateOrder/${orderId}`, {
      complete: !currentStatus
    });
    // Обновление локальных данных после успешного обновления на сервере
    const updatedOrder = response.data;
    const index = orderDetails.value.findIndex(order => order.id === orderId);
    orderDetails.value[index] = updatedOrder;
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
  }
};
</script>

<style scoped>
/* Ваши стили для карточек */
.card {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 22px;
  margin-bottom: 12px;
  color: #333;
}

p {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

.link-order {
  display: block;
  text-decoration: none;
  color: #3498db; /* Adjust the color to your preference */
  transition: color 0.3s ease;
}

.link-order:hover {
  color: #21618c; /* Darker shade on hover */
}
</style>
