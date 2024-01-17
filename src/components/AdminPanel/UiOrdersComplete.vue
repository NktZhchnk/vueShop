<template>
  <div>
    <!-- Поле ввода для поиска -->
    <div class="card">
      <input v-model="searchQuery" placeholder="Поиск по номеру телефона" class="search-input"/>
    </div>
    <router-link
        class="link-order"
        v-for="(order, index) in filteredOrders"
        :key="index"
        :to="'/order-details/' + order.id"
    >
      <!-- Ваш код для отображения карточек -->
      <div class="card">
        <h2 style="display: flex; justify-content: space-between">{{ order.first_name }} {{ order.last_name }}
          {{ order.middle_name }}
          <button @click.prevent="toggleOrderCompletion(order.id, order.complete)">
            {{ order.complete ? 'Не выполнено' : 'Выполнено' }}
          </button>
          <svg @click.prevent="console.log('h')" xmlns="http://www.w3.org/2000/svg" height="28" width="26" viewBox="0 0 448 512">
            <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
        </h2>
        <p>Дата: {{ order.order_date }}</p>
        <p>Телефон: {{ order.telephone }}</p>
        <p>Комментарий: {{ order.comment }}</p>
        <p>Город: {{ order.city }}</p>
        <p v-if="order.address">Новая почта: {{ order.address }}</p>
        <p v-if="order.postal_code">УкрПочта: {{ order.postal_code }}</p>
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
const searchQuery = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('https://eseniabila.com.ua/getOrders');
    orderDetails.value = response.data;
    console.log(orderDetails.value);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
});

const completedOrders = computed(() => {
  return orderDetails.value.filter(order => order.complete === 1).reverse();
});

const filteredOrders = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return completedOrders.value.filter(order => order.telephone.toLowerCase().includes(query));
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

<!-- Ваши стили для карточек и ссылок -->
<style scoped>

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
  width: 98%; /* Измените ширину по вашему усмотрению */
}

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
  color: #3498db;
  transition: color 0.3s ease;
}

.link-order:hover {
  color: #21618c;
}
</style>
