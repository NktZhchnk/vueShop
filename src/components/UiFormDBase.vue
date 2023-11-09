<script setup>
import { ref } from 'vue';
import axios from 'axios';

const priceItem = ref('');
const nameItem = ref('');
const quanItem = ref('');

const submitForm = async () => {
  try {
    const response = await axios.post('https://eseniabila.com.ua:3000/addItem', {
      price: priceItem.value,
      name: nameItem.value,
      quantity: quanItem.value,
    });

    console.log('Успешно добавлено:', response.data);
    // Обновите вашу локальную базу данных или выполните другие действия после успешного добавления на сервер
  } catch (error) {
    console.error('Ошибка добавления:', error);
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="submitForm">
      <input placeholder="price" v-model="priceItem"/>
      <input placeholder="name" v-model="nameItem"/>
      <input placeholder="quan" v-model="quanItem"/>
      <button type="submit">Добавить</button>
    </form>
  </div>
</template>

<style scoped>

</style>