<script setup>
import { ref } from 'vue';
import axios from 'axios';

const newData = {
  name_item: 'pussy',
  price_item: 100, // цена продукта
  quan_item: 5,    // количество продукта
  image_item: 'https://example.com/product.jpg' // ссылка на изображение продукта
};

const addProduct = () => {
  axios.post('https://eseniabila.com.ua/addProduct', newData)
      .then(response => {
          console.log('Ответ сервера:', response.data);
        // Обработка успешного ответа
      })
      .catch(error => {
        console.error('Ошибка при отправке данных на сервер:', error);
        // Обработка ошибки
      });
};

</script>

<template>
  <div>
    <!-- Ваш текущий код отображения продуктов -->

    <!-- Форма для добавления нового продукта -->
    <form @submit.prevent="addProduct">
      <label for="productName">Название:</label>
      <input v-model="newData.name_item" type="text" id="productName" required>

      <label for="productPrice">Цена:</label>
      <input v-model="newData.price_item" type="number" id="productPrice" required>

      <label for="productQuantity">Количество:</label>
      <input v-model="newData.quan_item" type="number" id="productQuantity" required>

      <label for="productImage">Изображение:</label>
      <input v-model="newData.image_item" type="text" id="productImage" required>

      <button type="submit">Добавить продукт</button>
    </form>
  </div>
</template>

<style scoped>

</style>