<script setup>
import { ref } from 'vue';
import axios from 'axios';

const newProduct = ref({
  name_item: 'Eye',
  price_item: 25,
  quan_item: 5,
  image_item: 'product3.jpg',
});

const addProduct = async () => {
  try {
    // Отправка данных на сервер
    console.log(newProduct.value)

    await axios.post('https://eseniabila.com.ua/addProduct', {
      name_item: newProduct.value.name_item,
      price_item: newProduct.value.price_item,
      quan_item: newProduct.value.quan_item,
      image_item: newProduct.value.image_item
    });

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