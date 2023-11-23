<script setup>
import {onMounted, ref} from 'vue';
import {useMyStore} from "@/store/store.js";
import axios from "axios";
import UiFormAddDataBase from "@/components/UiFormAddDataBase.vue";
import UiFormRadioCategories from "@/components/UiFormRadioCategories.vue";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});
const test = () => {
  store.getRadioPrice();

  console.log(store.radioPrice)
  console.log(store.radioOptions)
}

const deleteProductInDataBase = async (id) => {
  try {
    await axios.delete(`https://eseniabila.com.ua/deleteProduct/${id}`);
    console.log(`Продукт с ID ${id} успешно удален`);
    // После удаления обновите данные, если необходимо
    await store.fetchData();
  } catch (error) {
    console.error(`Ошибка при удалении продукта с ID ${id}:`, error);
  }
}

</script>


<template>
  <div>
    <UiFormAddDataBase></UiFormAddDataBase>
    <button @click="test">click</button>
    <UiFormRadioCategories></UiFormRadioCategories>
    <div v-for="item in store.data" :key="item.id">
      <div v-if="item.show_item">
        <button @click="deleteProductInDataBase(item.id)">delete</button>
        <h1>price2: {{ item.price_item }}</h1>
        <h1>id: {{ item.id }}</h1>
        <h1>q: {{ item.quan_item }}</h1>
        <h1>name: {{ item.name_item }}</h1>
        <h1>categories:{{ item.category_item }}</h1>
        <h1>show:{{ item.show_item }}</h1>
        <input type="radio" :value="item.varieties_item"/>
        <label>{{ item.varieties_item }}</label>

        <img alt="error" :src="'/images/' + item.image_item"/>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background: rgba(0, 0, 0, 0.9);
  color: white;
}

img {
  width: 200px;
  height: 200px;
}
</style>
