<script setup>
import {ref} from "vue";
import axios from "axios";

const priceItem = ref('');
const nameItem = ref('');
const quanItem = ref('');
const submitForm = async () => {
  try {
    const response = await axios.post("https://eseniabila.com.ua/addItem", {
      price: this.priceItem,
      name: this.nameItem,
      quantity: this.quanItem,
    });

    console.log("Успешно добавлено:", response.data);
    // Обновите вашу локальную базу данных или выполните другие действия после успешного добавления на сервер
  } catch (error) {
    console.error("Ошибка добавления:", error);
  }
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