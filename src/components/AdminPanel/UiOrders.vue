<script setup>
import {computed, ref, onMounted} from "vue";
import axios from "axios";

const orderDetails = ref([]);
const searchQuery = ref('');
const poshtaTnn = ref('');
const commentForUser = ref('');
const notification = ref ('');
const showNotification = ref(false);

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
      commentForUser.value = ''
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
  showNotification.value = true;
  notification.value = text
  setTimeout(() => {
    showNotification.value = false;
  }, 1000);
};
</script>

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
        <h2 style="display: flex; justify-content: space-between"> {{ order.last_name }} {{ order.first_name }}
          {{ order.middle_name }}
          <button class="completion-button"
                  @click.prevent="toggleOrderCompletion(order.id, order.complete)">
            {{ order.complete ? 'Не виконано' : 'Виконано' }}
          </button>
        </h2>
        <div class="card-details">

          <div class="order-details">
            <p>Дата: {{ formattedDate(order.order_date) }}</p>
            <p>Телефон: <span @click.prevent="copyToClipboard(order.telephone)" class="copy-text">{{ order.telephone }}</span></p>
            <p>Коментар: {{ order.comment }}</p>
            <p>Місто: <span @click.prevent="copyToClipboard(order.city)" class="copy-text">{{ order.city }}</span></p>
            <p v-if="order.address">Нова Пошта: <span @click.prevent="copyToClipboard(order.address)" class="copy-text">{{ order.address }}</span></p>
            <p v-if="order.postal_code">УкрПошта: <span @click.prevent="copyToClipboard(order.postal_code)" class="copy-text">{{ order.postal_code }}</span></p>
            <p v-if="order.payment_method === 'creditCard'">Спосіб оплати: Повна передплата на картку</p>
            <p v-if="order.payment_method === 'cashOnDelivery'">Спосіб оплати: Постоплата (оплата при отриманні)</p>
            <p>Загальна ціна: {{ order.total_price }} ₴.</p>
          </div>

          <div  class="additional-info">
            <textarea v-model="commentForUser" placeholder="Коментар" @click.prevent></textarea>
            <input v-model="poshtaTnn" placeholder="ТТН" @click.prevent/>
          </div>

        </div>
        <!-- Другие поля карточки -->
      </div>
    </router-link>
    <div v-if="showNotification" class="notification">
      Скопійовано {{notification}}
    </div>
  </div>
</template>

<style scoped>
/* выпад меню */
.notification {
  position: fixed;
  top: 50px; /* Регулируйте отступ сверху по вашему желанию */
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #ababab;
  background-color: #88fdfd; /* Зеленый цвет для уведомления об успешном действии */
  color: #383838;
  padding: 15px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 999; /* Убедитесь, что уведомление находится выше других элементов */
  animation: slideInDown 0.5s ease-out, slideOutUp 0.5s ease-in 3s forwards; /* Анимация появления и исчезновения */
}

@keyframes slideInDown {
  0% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutUp {
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
}

/* закончил */
.copy-text {
  cursor: pointer;
  color: #3498db;
  transition: color 0.3s ease;
}

.copy-text:hover {
  color: #21618c;
}

.search-input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
  width: 98%; /* Измените ширину по вашему усмотрению */
}

.card {
  border: 1px solid #ddd;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  padding: 20px;
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

p {
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
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

.completion-button {
  background: #f31a1a;
  border-radius: 5px;
  padding: 8px 12px;
  color: white;
  border: none;
  cursor: pointer;
}

.completion-button:hover {
  background: #d30a0a;
}

.card-details {
  display: flex;
  justify-content: space-between;
}

.order-details {
  width: 70%;
}

.additional-info {
  width: 30%;
}

.additional-info textarea {
  width: 94%;
  height: 100px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.additional-info input {
  width: 94%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

@media (max-width: 768px) {
  .card-details {
    flex-direction: column;
  }

  .order-details,
  .additional-info {
    width: 100%;
  }

  .additional-info {
    margin-top: 20px;
  }
  .additional-info textarea{
    height: 50px;
  }
  .additional-info textarea,
  .additional-info input {
    width: 90%;
  }
  h2{
    font-size: 20px;
  }
}
</style>

