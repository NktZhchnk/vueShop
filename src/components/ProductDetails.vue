<script setup>
import { useMyStore } from "@/store/store.js";
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";

const route = useRoute();
const productId = route.params.id;

const store = useMyStore();

const productById = ref(null); // Создаем реактивную переменную

axios.get(`https://eseniabila.com.ua/getProductById/${productId}`)
    .then(response => {
      // Данные о товаре с указанным ID
      // Обработка полученных данных о товаре
      store.productById.id = [];
      store.productById.id.push(response.data) ;
      productById.value = response.data; // Обновляем значение переменной
      console.log('Информация о товаре:', response.data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных о товаре:', error);
    });
axios.get(`https://eseniabila.com.ua/getImgById/${productId}`)
    .then(response => {
      // Данные о товаре с указанным ID
      // Обработка полученных данных о товаре
      store.productById.img = [];
      store.productById.img.push(response.data) ;
      productById.value = response.data; // Обновляем значение переменной
      console.log('Информация о товаре:', response.data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных о товаре:', error);
    });

// Функция, проверяющая, является ли объект массивом
const isArray = (obj) => {
  return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]';
};

const getProductById = computed(() => {
  if (isArray(store.productById.id)) {
    return store.productById.id.find(item => item.id === Number(productId));
  } else {
    return null; // Или другое значение по умолчанию, если productById не является массивом
  }
});
console.log(store.productById.img)
</script>

<template>
  <div v-if="getProductById" class="product-details">
    <h1>{{ getProductById.name_item }}</h1>
    <p>Price: {{getProductById.price_item}}</p>
    <p>{{getProductById.text_info}}</p>
    <button>Add to Cart</button>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style>
.product-details {
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.product-details h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.product-details p {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
}

.product-details button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.product-details button:hover {
  background-color: #0056b3;
}
</style>