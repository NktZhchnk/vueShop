<template>
  <div>
    <!-- Поле ввода для поиска -->
    <div class="card">
      <input v-model="searchQuery" placeholder="Пошук за номером телефону" class="search-input"/>
    </div>
    <router-link
        class="link-order"
        v-for="(order, index) in filteredOrders"
        :key="index"
        :to="'/order-details/' + order.id"
    >
      <!-- Ваш код для отображения карточек -->
      <div class="card">
        <h2 style="display: flex; justify-content: space-between">{{ order.last_name }} {{ order.first_name }}
          {{ order.middle_name }}
          <button style="background: greenyellow; border-radius: 5px;" @click.prevent="toggleOrderCompletion(order.id, order.complete)">
            {{ order.complete ? 'Не виконано' : 'Виконано' }}
          </button>

        </h2>
        <p>Дата: {{ formattedDate(order.order_date) }}</p>
        <p>Телефон: {{ order.telephone }}</p>
        <p>Коментар: {{ order.comment }}</p>
        <p>Місто: {{ order.city }}</p>
        <p v-if="order.address">Нова пошта: {{ order.address }}</p>
        <p v-if="order.postal_code">УкрПошта: {{ order.postal_code }}</p>
        <p v-if="order.payment_method === 'creditCard'">Спосiб оплати: Повна передоплата на картку</p>
        <p v-if="order.payment_method === 'cashOnDelivery'">Спосiб оплати: Післяплата (оплата при отриманні)</p>
        <p>Total price: {{ order.total_price }} ₴.</p>
        <p>TTN: {{order.poshta_tnn}}</p>
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
const formattedDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Kiev',
  };

  const utcDate = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', options).format(utcDate);
};
const completedOrders = computed(() => {
  return orderDetails.value.filter(order => order.complete === 0).reverse();
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
  word-wrap: break-word;
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
