<script setup>
import {ref} from "vue";
import axios from "axios";

const priceItem = ref('');
const nameItem = ref('');
const quanItem = ref('');
const submitForm =  () => {
  const formData = {
    price: this.priceItem,
    name: this.nameItem,
    quantity: this.quanItem,
  };

  // Используйте библиотеку axios или другую для выполнения запроса на сервер
  // Пример с axios:
  axios.post("https://eseniabila.com.ua:3000/addItem", formData)
      .then(response => {
        console.log(response.data);
        // Обновите состояние вашего магазина или выполните другие действия по необходимости
      })
      .catch(error => {
        console.error("Произошла ошибка при добавлении элемента:", error);
      });
}


</script>

<template>
  <div>
    <form @submit="submitForm">
      <input placeholder="price" v-model="priceItem"/>
      <input placeholder="name" v-model="nameItem"/>
      <input placeholder="quan" v-model="quanItem"/>
      <button>addd</button>
    </form>
  </div>
</template>

<style scoped>

</style>