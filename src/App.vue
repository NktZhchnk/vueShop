<script setup>
import {onMounted, ref} from 'vue';
import {useMyStore} from "@/store/store.js";
import UiFormDBase from "@/components/UiFormDBase.vue";
import axios from "axios";

const store = useMyStore()

onMounted(async () => {
  // Вызовите `fetchData` и дождитесь завершения запроса
  await store.fetchData();

  // Теперь можно безопасно получить данные
  console.log(store.data[0]);
});

const fn = async (id) => {
  try {
    await axios.delete(`/deleteProduct/${id}`);
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
    <UiFormDBase></UiFormDBase>
    <div v-for="item in store.data" :key="item.id">
      <button @click="fn(item.id)">delete</button>
      <h1>price2: {{ item.price_item }}</h1>
      <h1>id: {{ item.id }}</h1>
      <h1>q: {{ item.quan_item }}</h1>
      <h1>name: {{ item.name_item }}</h1>
      <img alt="error" :src="'/images/' + item.image_item"/>
    </div>
  </div>
</template>

<style >
 img{
   width: 200px;
   height: 200px;
 }
</style>
