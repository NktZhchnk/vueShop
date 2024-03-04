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
          <button style="background: red; border-radius: 5px;"
                  @click.prevent="toggleOrderCompletion(order.id, order.complete)">
            {{ order.complete ? 'Не выполнено' : 'Выполнено' }}
          </button>
        </h2>
        <div style=" display: flex; justify-content: space-between">
          <div style="width:80%;">
            <p>Дата: {{ formattedDate(order.order_date) }}</p>
            <p>Телефон: <span @click.prevent="copyToClipboard(order.telephone)" class="copy-text">{{ order.telephone }}</span></p>
            <p>Коментар: {{ order.comment }}</p>
            <p>Місто: <span @click.prevent="copyToClipboard(order.city)" class="copy-text">{{ order.city }}</span></p>
            <p v-if="order.address">Нова пошта: <span @click.prevent="copyToClipboard(order.address)" class="copy-text">{{ order.address }}</span></p>
            <p v-if="order.postal_code">УкрПошта: <span @click.prevent="copyToClipboard(order.postal_code)" class="copy-text">{{ order.postal_code }}</span></p>
            <p v-if="order.payment_method === 'creditCard'">Спосiб оплати: Повна передоплата на картку</p>
            <p v-if="order.payment_method === 'cashOnDelivery'">Спосiб оплати: Післяплата (оплата при отриманні)</p>
          </div>
          <div style="width: 20%">
            <textarea v-model="commentForUser" placeholder="Коментар" @click.prevent style="width: 100%; padding: 5px; height: 90px" ></textarea>
          </div>
        </div>
        <p style="display: flex; justify-content: space-between;">Total price: {{ order.total_price }} ₴.
          <input v-model="poshtaTnn" style="padding: 5px; border-radius: 5px;" placeholder="ТТН" @click.prevent/>
        </p>
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
const poshtaTnn = ref('')
const commentForUser = ref('')

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
  return orderDetails.value.filter(order => order.complete === 1).reverse();
});

const filteredOrders = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return completedOrders.value.filter(order => order.telephone.toLowerCase().includes(query));
});

const toggleOrderCompletion = async (orderId, currentStatus) => {
  if(poshtaTnn.value !== ''){
    try {
      const response = await axios.put(`https://eseniabila.com.ua/updateOrder/${orderId}`, {
        complete: !currentStatus,
        poshta_tnn: poshtaTnn.value, // Добавлено поле poshta_tnn в теле запроса
        comment_for_user: commentForUser.value
      });

      // Обновление локальных данных после успешного обновления на сервере
      const updatedOrder = response.data;
      const index = orderDetails.value.findIndex(order => order.id === orderId);
      orderDetails.value[index] = updatedOrder;
      poshtaTnn.value = ''
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
    }
  }else{
    alert('Ввiдiть ТТН')
  }
};
const copyToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};
</script>

<!-- Ваши стили для карточек и ссылок -->
<style scoped>
.copy-text {
  cursor: pointer;
  color: #3498db;
  transition: color 0.3s ease;
}

.copy-text:hover {
  color: #21618c;
}
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
