<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const orderDetails = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('https://eseniabila.com.ua/orders');
    orderDetails.value = response.data; // Предположим, что данные находятся в свойстве data объекта ответа
    console.log(orderDetails.value)
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
});
</script>

<template>
  <div>
    <div v-if="orderDetails.length > 0">
      <!-- Здесь вы можете использовать данные orderDetails в вашем шаблоне -->
    </div>
    <div v-else>
      <!-- Ваше сообщение или заглушка, если данных нет -->
    </div>
  </div>
</template>

<style scoped>

</style>