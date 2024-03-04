<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const phoneNumber = ref(localStorage.getItem('phoneNumber'));
const userLogin = ref(localStorage.getItem('userLogin'));
const firstName = ref(localStorage.getItem('firstName'));
const lastName = ref(localStorage.getItem('lastName'));

const ordersData = ref([]);

const fetchOrders = async () => {
  try {
    const response = await axios.get(`/getOrdersPhone?phoneNumber=${phoneNumber.value}`);
    ordersData.value = response.data
  } catch (error) {
    console.log('error Запроса:', error)
  }
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
