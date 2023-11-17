<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useMyStore } from "@/store/store.js";
import Checkbox from "@/components/Checkbox.vue";

const store = useMyStore();

const newData = {
  name_item: 'Шар',
  price_item: 105,
  quan_item: 5,
  image_item: 'https://example.com/product.jpg',
  show_item: 1,
  category_item: ref(null),
  varieties_item: store.radioOptions,
};

const addProduct = () => {
  axios.post('https://eseniabila.com.ua/addProduct', {
    ...newData,
    category_item: newData.category_item.value // Получение значения из ref
  })
      .then(response => {
        console.log('Ответ сервера:', response.data);
        setTimeout(() => {
          store.fetchData();
        }, 2000);
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

      <!-- Остальные поля ввода -->

      <checkbox></checkbox>
      <input v-model="newData.category_item" type="radio" id="option1" name="choice" value="item">
      <label for="option1">Вещи</label><br>
      <input v-model="newData.category_item" type="radio" id="option2" name="choice" value="cosmetics">
      <label for="option2">Косметика</label><br>
      <input v-model="newData.category_item" type="radio" id="option3" name="choice" value="accessories">
      <label for="option3">Принадлежности</label><br>
      <h1>{{ newData.category_item.value }}</h1>
      <button type="submit">Добавить продукт</button>

    </form>
  </div>
</template>

<style scoped>

</style>
