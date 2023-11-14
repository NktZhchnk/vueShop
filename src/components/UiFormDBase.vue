<script setup>
import { ref } from 'vue';
import axios from 'axios';

const newProduct = {
  name_item: "Название продукта",
  price_item: 26,
  quan_item: 20,
  image_item: "новый_продукт.jpg"
};

const addProduct = async () => {
  try {
    // Отправка данных на сервер
    console.log('h')
    await axios.post('https://eseniabila.com.ua/addProduct', newProduct.value);

    // Обновление списка продуктов после добавления
    // (вызов метода для обновления данных)
  } catch (error) {
    console.log('j')
    console.error('Ошибка добавления продукта:', error);
  }
};

</script>

<template>
  <div>
    <!-- Ваш текущий код отображения продуктов -->

    <!-- Форма для добавления нового продукта -->
    <form @submit.prevent="addProduct">
      <label for="productName">Название:</label>
      <input v-model="newProduct.name_item" type="text" id="productName" required>

      <label for="productPrice">Цена:</label>
      <input v-model="newProduct.price_item" type="number" id="productPrice" required>

      <label for="productQuantity">Количество:</label>
      <input v-model="newProduct.quan_item" type="number" id="productQuantity" required>

      <label for="productImage">Изображение:</label>
      <input v-model="newProduct.image_item" type="text" id="productImage" required>

      <button type="submit">Добавить продукт</button>
    </form>
  </div>
</template>

<style scoped>

</style>